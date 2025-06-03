'use client'
import { useEffect } from 'react';


export default function github() {
    useEffect(() => {
        // Este código solo se ejecuta en el cliente
        window.location.href = 'http://localhost:8081/autenticacion/github';
    }, []);
}