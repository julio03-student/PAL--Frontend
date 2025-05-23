"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Exam, getCourses, getExams,type Course } from "@/lib/api"
import { Trash2, Plus, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useLoading } from "@/hooks/use-loading"
import Link from "next/link"

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [open, setOpen] = useState(false)
  const [expandedExams, setExpandedExams] = useState<Set<number>>(new Set())

  const [formData, setFormData] = useState({
    title: "",
    courseId: 0,
    questions: [
      {
        text: "",
        examId: 0,
        answers: [
          { text: "", isCorrect: false }
        ]
      }
    ],
  })

  const { isLoading, withLoading } = useLoading()

  useEffect(() => {
    const fetchData = async () => {
      const examsData = await getExams()
      setExams(examsData)
      const coursesData = await getCourses()
      setCourses(coursesData)
    }

    fetchData()
  }, [withLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "courseId" ? Number.parseInt(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "courseId" ? Number.parseInt(value) : value,
    }))
  }

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[index] = { ...updatedQuestions[index], text: value }
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }))
  }

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { text: "", examId: 0, answers: [{ text: "", isCorrect: false }] }],
    }))
  }

  const removeQuestion = (index: number) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = [...formData.questions]
      updatedQuestions.splice(index, 1)
      setFormData((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }))
    }
  }

  const addAnswer = (qIdx: number) => {
    setFormData(prev => {
      const questions = [...prev.questions];
      questions[qIdx].answers = [...(questions[qIdx].answers || []), { text: "", isCorrect: false }];
      return { ...prev, questions };
    });
  };

  const updateAnswer = (qIdx: number, aIdx: number, value: string) => {
    setFormData(prev => {
      const questions = [...prev.questions];
      questions[qIdx].answers[aIdx].text = value;
      return { ...prev, questions };
    });
  };

  const removeAnswer = (qIdx: number, aIdx: number) => {
    setFormData(prev => {
      const questions = [...prev.questions];
      questions[qIdx].answers.splice(aIdx, 1);
      return { ...prev, questions };
    });
  };

  const markCorrect = (qIdx: number, aIdx: number) => {
    setFormData(prev => {
      const questions = [...prev.questions];
      questions[qIdx].answers = questions[qIdx].answers.map((ans, idx) => ({
        ...ans,
        isCorrect: idx === aIdx
      }));
      return { ...prev, questions };
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      courseId: 0,
      questions: [{ text: "", examId: 0, answers: [{ text: "", isCorrect: false }] }],
    })
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este examen?")) {
      const success = await withLoading(() => deleteExam(id))
      if (success) {
        setExams(exams.filter((exam) => exam.id !== id))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newExam = await withLoading(() => createExam(formData))

    if (newExam) {
      setExams([...exams, newExam])
      setOpen(false)
      resetForm()
    }
  }

  const getCourseTitle = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId)
    return course ? course.title : "Curso no encontrado"
  }

  const toggleExpansion = (examId: number) => {
    setExpandedExams(prev => {
      const newSet = new Set(prev)
      if (newSet.has(examId)) {
        newSet.delete(examId)
      } else {
        newSet.add(examId)
      }
      return newSet
    })
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mt-2">Exámenes</h1>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700" disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Examen
              {isLoading && <LoadingSpinner/>}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Examen</DialogTitle>
                <DialogDescription>Completa los detalles del examen a continuación.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="courseId">Curso</Label>
                    <Select
                      value={formData.courseId.toString()}
                      onValueChange={(value) => handleSelectChange("courseId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label>Preguntas</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addQuestion}
                      className="text-accent-600 border-accent-600 hover:bg-accent-100"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Añadir Pregunta
                    </Button>
                  </div>
                  {formData.questions.map((question, qIdx) => (
                    <div key={qIdx} className="flex flex-col gap-2 border p-2 rounded-md bg-gray-50">
                      <Textarea
                        placeholder={`Pregunta ${qIdx + 1}`}
                        value={question.text}
                        onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                        required
                        className="flex-1"
                      />
                      <div className="ml-4 flex flex-col gap-2">
                        {question.answers?.map((answer, aIdx) => (
                          <div key={aIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={answer.isCorrect}
                              onChange={() => markCorrect(qIdx, aIdx)}
                            />
                            <Input
                              value={answer.text}
                              onChange={e => updateAnswer(qIdx, aIdx, e.target.value)}
                              placeholder={`Respuesta ${aIdx + 1}`}
                              required
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeAnswer(qIdx, aIdx)}
                              className="text-destructive hover:bg-destructive/10"
                              disabled={question.answers.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addAnswer(qIdx)}
                          className="text-accent-600 border-accent-600 hover:bg-accent-100"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Añadir Respuesta
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(qIdx)}
                        disabled={formData.questions.length <= 1}
                        className="mt-1 text-destructive hover:bg-destructive/10 self-end"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={isLoading}>
                  Crear
                  {isLoading && <LoadingSpinner/>}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No hay exámenes disponibles. Crea uno nuevo para comenzar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="overflow-hidden">
              <CardHeader className="pb-2 bg-primary-100">
                <CardTitle className="text-primary-800">{exam.title}</CardTitle>
                <CardDescription>Curso: {getCourseTitle(exam.courseId)}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Preguntas:</span> {Array.isArray(exam.questions) ? exam.questions.length : 0}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpansion(exam.id)}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    {expandedExams.has(exam.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {expandedExams.has(exam.id) && (
                  <div className="space-y-2 mt-3">
                    {exam.questions.map((q, idx) => (
                      <div key={idx} className="border-l-2 border-gray-200 pl-3 py-1">
                        <p className="text-sm font-medium text-gray-700">
                          Pregunta {idx + 1}:
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {q.text.length > 100 ? `${q.text.substring(0, 100)}...` : q.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Respuestas: {Array.isArray(q.answers) ? q.answers.length : 0}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between space-x-2 pt-0">
                <Link href={`/examenes/${exam.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-secondary-600 border-secondary-600 hover:bg-secondary-100"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(exam.id)} disabled={isLoading}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

async function createExam(formData: {
  title: string;
  courseId: number;
  questions: { text: string; examId: number; answers?: { text: string; isCorrect: boolean }[] }[];
}) {
  try {
    // Solo enviamos text y examId de cada pregunta
    const body = {
      title: formData.title,
      courseId: formData.courseId,
      questions: formData.questions.map(q => ({
        text: q.text,
        examId: q.examId
      }))
    };

    const response = await fetch("http://localhost:8081/api/exams/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Error al crear el examen");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

function deleteExam(id: number) {
  throw new Error("Function not implemented.")
}

