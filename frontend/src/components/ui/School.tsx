'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';  // Cambiamos a next/navigation
import { usePathname } from 'next/navigation';

interface School {
  id: number;
  name: string;
}

const SchoolCard: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  // Efecto para manejar el montaje del componente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Efecto para cargar las escuelas
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/escuelas');
        if (!response.ok) {
          throw new Error('Error al cargar las escuelas');
        }
        const data = await response.json();
        setSchools(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las escuelas');
        console.error('Error al obtener las escuelas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      fetchSchools();
    }
  }, [mounted]);

  // Efecto para el cambio automático de escuelas
  useEffect(() => {
    if (schools.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % schools.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [schools.length]);

  const handleSchoolClick = (schoolId: number) => {
    if (mounted) {
      router.push(`/escuela/${schoolId}`);
    }
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center p-4 bg-white rounded-lg shadow-md w-full max-w-xs">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full animate-pulse">
          <span className="text-xl text-blue-600 font-bold">🏫</span>
        </div>
        <div className="ml-4">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  // No renderizar nada si no hay escuelas
  if (schools.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-600">
        No hay escuelas disponibles
      </div>
    );
  }

  const currentSchool = schools[currentIndex];

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md w-full max-w-xs">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
        <span className="text-xl text-blue-600 font-bold">🏫</span>
      </div>
      <div className="ml-4">
        <button
          onClick={() => handleSchoolClick(currentSchool.id)}
          className="text-gray-800 text-lg font-semibold underline hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        >
          {currentSchool.name}
        </button>
      </div>
    </div>
  );
};

export default SchoolCard;
