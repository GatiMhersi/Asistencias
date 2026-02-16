
import { Course, AttendanceHistory, AttendanceStatus } from '../types';

/**
 * apiService conecta el frontend con las Vercel API Routes.
 * Todas las operaciones ahora persisten en MongoDB Atlas.
 */

const fetchAPI = async (endpoint: string, options?: RequestInit) => {
  // Eliminamos el slash inicial si existe para manejar la ruta de forma relativa
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // En muchos entornos de desarrollo, la ruta debe ser relativa al origen de la app
  const url = `/api/${cleanEndpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      // Manejo de errores cuando el servidor devuelve un 404 o similar
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Error ${response.status}`);
      } else {
        const textError = await response.text();
        console.error('Respuesta no-JSON del servidor:', textError.slice(0, 100));
        throw new Error(`Servidor respondió con estado ${response.status}. Verifique que el backend esté corriendo.`);
      }
    }

    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return null;
  } catch (error: any) {
    console.error(`Error en API (${url}):`, error.message);
    throw error;
  }
};

export const apiService = {
  // --- Cursos ---
  getCourses: async (): Promise<Course[]> => {
    return fetchAPI('courses');
  },

  saveCourse: async (course: Course) => {
    if (course._id && !course._id.includes('_temp')) {
      return fetchAPI('courses', {
        method: 'PUT',
        body: JSON.stringify(course),
      });
    } else {
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
      presentCount: records.filter(r => r.status === 'P' || r.status === AttendanceStatus.PRESENT).length,
      absentCount: records.filter(r => r.status === 'A' || r.status === AttendanceStatus.ABSENT).length,
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
