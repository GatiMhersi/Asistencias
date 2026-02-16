
import { Course, AttendanceHistory, AttendanceStatus } from '../types';

/**
 * Nota: En una app real, estas funciones harían fetch() a tu API de Node.js.
 * Aquí implementamos una lógica persistente en localStorage para que puedas probar la funcionalidad.
 */

export const apiService = {
  // --- Cursos ---
  getCourses: async (): Promise<Course[]> => {
    const data = localStorage.getItem('asistencia_cursos');
    return data ? JSON.parse(data) : [];
  },

  saveCourse: async (course: Course) => {
    const courses = await apiService.getCourses();
    const index = courses.findIndex(c => c._id === course._id);
    if (index >= 0) courses[index] = course;
    else courses.push(course);
    localStorage.setItem('asistencia_cursos', JSON.stringify(courses));
  },

  deleteCourse: async (id: string) => {
    const courses = await apiService.getCourses();
    const filtered = courses.filter(c => c._id !== id);
    localStorage.setItem('asistencia_cursos', JSON.stringify(filtered));
  },

  // --- Asistencia ---
  saveAttendance: async (courseName: string, date: string, records: any[]) => {
    const history = await apiService.getHistory();
    const newEntry = {
      _id: Date.now().toString(),
      date,
      courseName,
      presentCount: records.filter(r => r.status === 'P').length,
      absentCount: records.filter(r => r.status === 'A').length,
      details: records
    };
    history.push(newEntry);
    localStorage.setItem('asistencia_historial', JSON.stringify(history));
  },

  getHistory: async (): Promise<any[]> => {
    const data = localStorage.getItem('asistencia_historial');
    return data ? JSON.parse(data) : [];
  }
};
