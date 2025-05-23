"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Exam, type Question, getExamById, Answer } from "@/lib/api"
import { ArrowLeft, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useLoading } from "@/hooks/use-loading"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

interface QuestionWithAnswers extends Omit<Question, 'answers'> {
  answers: Answer[];
}

interface QuestionResult {
  questionId: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

interface ExamResult {
  examId: number;
  studentId: number;
  examTitle: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  questionResults: QuestionResult[];
  generalComments: string;
}

export default function ExamDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<QuestionWithAnswers[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set())
  const [expandedResults, setExpandedResults] = useState<Set<number>>(new Set())

  const { isLoading: useLoadingIsLoading, withLoading } = useLoading()

  useEffect(() => {
    const checkExamStatus = async () => {
      if (id) {
        try {
          const response = await fetch(`http://localhost:8081/api/exams/results/2?studentId=2`);
          if (response.ok) {
            const result = await response.json();
            console.log('Respuesta del servidor:', result);

            if (result.data && Array.isArray(result.data) && result.data.length > 0) {
              const examData = result.data[0];
              console.log('Datos del examen:', examData);

              // Obtener las respuestas correctas para cada pregunta
              const questionResults = await Promise.all(
                examData.questionResults.map(async (result: any) => {
                  try {
                    const response = await fetch(`http://localhost:8081/api/answers/question/${result.questionId}`);
                    if (!response.ok) {
                      throw new Error(`Error al obtener respuestas para la pregunta ${result.questionId}`);
                    }
                    const answersData = await response.json();
                    const answers = answersData.data || [];

                    // Encontrar la respuesta correcta
                    const correctAnswer = answers.find((a: any) => a.isCorrect)?.text || result.correctAnswer;

                    // Encontrar la respuesta del estudiante
                    const studentAnswer = answers.find((a: any) => a.id.toString() === result.studentAnswer)?.text || result.studentAnswer;

                    return {
                      ...result,
                      studentAnswer: studentAnswer,
                      correctAnswer: correctAnswer,
                      correct: studentAnswer === correctAnswer
                    };
                  } catch (error) {
                    console.error(`Error al obtener respuestas para la pregunta ${result.questionId}:`, error);
                    return result;
                  }
                })
              );

              setExamResult({
                examId: examData.examId,
                studentId: examData.studentId,
                examTitle: examData.examTitle,
                studentName: examData.studentName,
                score: examData.score,
                totalQuestions: examData.totalQuestions,
                percentage: examData.percentage,
                questionResults: questionResults,
                generalComments: examData.generalComments
              });

              setHasSubmitted(true);
              return true;
            } else {
              console.log('No se encontraron resultados del examen');
              return false;
            }
          }
          return false;
        } catch (error) {
          console.error("Error al verificar estado del examen:", error);
          return false;
        }
      }
      return false;
    };

    const fetchData = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const examSubmitted = await checkExamStatus();

          if (!examSubmitted) {
            const examData = await getExamById(Number(id));
            if (examData) {
              setExam(examData);
              const examQuestions = examData.questions || [];
              const questionsWithAnswers = await Promise.all(
                examQuestions.map(async (question: Question) => {
                  try {
                    const response = await fetch(`http://localhost:8081/api/answers/question/${question.id}`);
                    if (!response.ok) {
                      throw new Error(`Error al obtener respuestas para la pregunta ${question.id}`);
                    }
                    const answersData = await response.json();
                    return {
                      ...question,
                      answers: answersData.data || []
                    };
                  } catch (error) {
                    console.error(`Error al obtener respuestas para la pregunta ${question.id}:`, error);
                    return {
                      ...question,
                      answers: []
                    };
                  }
                })
              );
              setQuestions(questionsWithAnswers);
            }
          }
        } catch (error) {
          console.error("Error fetching exam data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    
    if (!id) return;

    const unansweredQuestions = questions.filter(q => !selectedAnswers[q.id]);
    if (unansweredQuestions.length > 0) {
      toast.error(`Por favor responde todas las preguntas. Faltan ${unansweredQuestions.length} preguntas.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const answersMap: Record<string, string> = {};
      Object.entries(selectedAnswers).forEach(([questionId, answerId]) => {
        answersMap[questionId] = answerId.toString();
      });

      const submissionData = {
        studentId: 2,
        answers: answersMap
      };

      const response = await fetch(`http://localhost:8081/api/exams/submit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (error) {
        console.error('Error al parsear la respuesta:', error);
        throw new Error('Error al procesar la respuesta del servidor');
      }

      if (result.data) {
        // Obtener los resultados detallados del examen
        const resultsResponse = await fetch(`http://localhost:8081/api/exams/results/2?studentId=2`);
        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json();
          console.log('Respuesta del servidor:', resultsData);
          
          if (resultsData.data && Array.isArray(resultsData.data) && resultsData.data.length > 0) {
            const examData = resultsData.data[0];
            console.log('Datos del examen:', examData);
            
            // Obtener las respuestas correctas para cada pregunta
            const questionResults = await Promise.all(
              examData.questionResults.map(async (result: any) => {
                try {
                  const response = await fetch(`http://localhost:8081/api/answers/question/${result.questionId}`);
                  if (!response.ok) {
                    throw new Error(`Error al obtener respuestas para la pregunta ${result.questionId}`);
                  }
                  const answersData = await response.json();
                  const answers = answersData.data || [];
                  
                  // Encontrar la respuesta correcta
                  const correctAnswer = answers.find((a: any) => a.isCorrect)?.text || result.correctAnswer;
                  
                  // Encontrar la respuesta del estudiante
                  const studentAnswer = answers.find((a: any) => a.id.toString() === result.studentAnswer)?.text || result.studentAnswer;
                  
                  return {
                    ...result,
                    studentAnswer: studentAnswer,
                    correctAnswer: correctAnswer,
                    correct: studentAnswer === correctAnswer
                  };
                } catch (error) {
                  console.error(`Error al obtener respuestas para la pregunta ${result.questionId}:`, error);
                  return result;
                }
              })
            );

            const examResultData = {
              examId: examData.examId,
              studentId: examData.studentId,
              examTitle: examData.examTitle,
              studentName: examData.studentName,
              score: examData.score,
              totalQuestions: examData.totalQuestions,
              percentage: examData.percentage,
              questionResults: questionResults,
              generalComments: examData.generalComments
            };

            console.log('Datos procesados del examen:', examResultData);
            setExamResult(examResultData);
            setHasSubmitted(true);
            
            const percentage = (examData.score / examData.totalQuestions) * 100;
            toast.success(
              `¡Examen completado!\nPuntuación: ${examData.score}/${examData.totalQuestions}\nPorcentaje: ${percentage.toFixed(1)}%`
            );
          }
        }
      }
      if (!response.ok) {
        throw new Error(result.message || 'Error al enviar las respuestas');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al enviar el examen. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleQuestionExpansion = (questionId: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const toggleResultExpansion = (questionId: number) => {
    setExpandedResults(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const toggleAllQuestions = () => {
    if (expandedQuestions.size === questions.length) {
      setExpandedQuestions(new Set())
    } else {
      setExpandedQuestions(new Set(questions.map(q => q.id)))
    }
  }

  const toggleAllResults = () => {
    if (examResult?.questionResults) {
      if (expandedResults.size === examResult.questionResults.length) {
        setExpandedResults(new Set())
      } else {
        setExpandedResults(new Set(examResult.questionResults.map(r => r.questionId)))
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (hasSubmitted && examResult) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/examenes">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{examResult.examTitle}</h1>
          </div>
        </div>

        <div className="space-y-6">

          {examResult.generalComments && (
            <Card className="bg-yellow-50 border-2 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800 text-2xl">Comentarios Generales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-yellow-700">{examResult.generalComments}</p>
              </CardContent>
            </Card>
          )}

          {examResult.questionResults && examResult.questionResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Detalle de Respuestas</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAllResults}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {expandedResults.size === examResult.questionResults.length ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Colapsar Todas
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expandir Todas
                    </>
                  )}
                </Button>
              </div>
              {examResult.questionResults.map((result, index) => (
                <Card key={result.questionId} className={`border-2 ${result.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className={`text-lg ${result.correct ? 'text-green-800' : 'text-red-800'}`}>
                        Pregunta {index + 1}
                        {expandedResults.has(result.questionId) && (
                          <span className="block text-sm font-normal mt-1">
                            {result.questionText}
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {result.correct ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleResultExpansion(result.questionId)}
                          className="h-6 w-6 p-0 hover:bg-gray-100"
                        >
                          {expandedResults.has(result.questionId) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedResults.has(result.questionId) && (
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-semibold">Tu respuesta: 
                          <span className={`ml-2 ${result.correct ? 'text-green-700' : 'text-red-700'}`}>
                            {result.studentAnswer}
                          </span>
                        </p>
                        <p className="font-semibold">Respuesta correcta: 
                          <span className="ml-2 text-green-700">
                            {result.correctAnswer}
                          </span>
                        </p>
                        <div className="flex items-center mt-3">
                          <span className={result.correct ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                            {result.correct ? 'Correcta' : 'Incorrecta'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/examenes">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Examen no disponible</h1>
          </div>
        </div>
        <Card className="bg-red-50 border-2 border-red-200">
          <CardContent className="pt-6">
            <p className="text-lg text-red-700">No se puede acceder a este examen en este momento.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/examenes">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{exam.title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Progreso: {Object.keys(selectedAnswers).length} de {questions.length} preguntas respondidas
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmitExam}>
          <Button 
            type="submit"
            disabled={isSubmitting || Object.keys(selectedAnswers).length === 0}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner />
                Enviando...
              </>
            ) : (
              'Enviar Examen'
            )}
          </Button>
        </form>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold text-gray-700">
          Preguntas del Examen
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAllQuestions}
          className="text-gray-600 hover:text-gray-800"
        >
          {expandedQuestions.size === questions.length ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Colapsar Todas
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Expandir Todas
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader className="pb-2 bg-secondary-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-secondary-800">
                  Pregunta {index + 1}
                  {expandedQuestions.has(question.id) && (
                    <span className="block text-sm font-normal mt-1">
                      {question.text}
                    </span>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleQuestionExpansion(question.id)}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  {expandedQuestions.has(question.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            {expandedQuestions.has(question.id) && (
              <CardContent className="pt-4">
                <h3 className="font-medium mb-2">Respuestas:</h3>
                <ul className="space-y-2 pl-5">
                  {question.answers && question.answers.length > 0 ? (
                    question.answers.map((answer) => (
                      <li key={answer.id} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          id={`answer-${answer.id}`}
                          value={answer.id}
                          checked={selectedAnswers[question.id] === answer.id}
                          onChange={() => handleAnswerSelect(question.id, answer.id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                          disabled={isSubmitting}
                        />
                        <label htmlFor={`answer-${answer.id}`} className="text-gray-700">
                          {answer.text}
                        </label>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No hay respuestas disponibles para esta pregunta.</li>
                  )}
                </ul>
                
                {/* Indicador de respuesta seleccionada cuando está colapsado */}
                {selectedAnswers[question.id] && (
                  <div className="mt-3 text-sm text-green-600 font-medium">
                    ✓ Respuesta seleccionada
                  </div>
                )}
              </CardContent>
            )}
            
            {/* Vista colapsada: mostrar si hay respuesta seleccionada */}
            {!expandedQuestions.has(question.id) && selectedAnswers[question.id] && (
              <CardContent className="py-2 border-t border-gray-200 bg-green-50">
                <div className="text-sm text-green-600 font-medium flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Respondida
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
