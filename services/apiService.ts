
import { Course, AttendanceHistory, AttendanceStatus } from '../types';

/**
 * apiService conecta el frontend con las Vercel API Routes.
 * Todas las operaciones ahora persisten en MongoDB Atlas.
 */

const fetchAPI = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`/api/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.statusText}`);
  }
  return response.json();
};

export const apiService = {
  // --- Cursos ---
  getCourses: async (): Promise<Course[]> => {
    return fetchAPI('courses');
  },

  saveCourse: async (course: Course) => {
    // Si tiene _id, es una actualización (PUT), si no, es creación (POST)
    if (course._id && !course._id.startsWith('temp_')) {
      return fetchAPI('courses', {
        method: 'PUT',
        body: JSON.stringify(course),
      });
    } else {
      // Limpiamos un posible ID temporal antes de enviar a Mongo
      const { _id, ...rest } = course;
      return fetchAPI('courses', {
        method: 'POST',
        body: JSON.stringify(rest),
      });
    }
  },

  deleteCourse: async (id: string) => {
    return fetchAPI(`courses?id=${id}`, {
      method: 'DELETE',
    });
  },

  // --- Asistencia ---
  saveAttendance: async (courseName: string, date: string, records: any[]) => {
    const entry = {
      date,
      courseName,
      presentCount: records.filter(r => r.status === 'P').length,
      absentCount: records.filter(r => r.status === 'A').length,
      details: records
    };
    return fetchAPI('attendance', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  },

  getHistory: async (): Promise<any[]> => {
    return fetchAPI('attendance');
  },

  // --- Rúbricas ---
  saveRubric: async (rubricData: any) => {
    return fetchAPI('rubrics', {
      method: 'POST',
      body: JSON.stringify(rubricData),
    });
  }
};
