
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { apiService } from '../services/apiService';
import { Course } from '../types';
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowUpTrayIcon, 
  UserPlusIcon,
  InboxIcon
} from '@heroicons/react/24/outline';

interface Props {
  onUpdate: () => void;
}

const StudentAdmin: React.FC<Props> = ({ onUpdate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [newStudentName, setNewStudentName] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await apiService.getCourses();
    setCourses(data);
  };

  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return;
    const newCourse: Course = {
      _id: Date.now().toString(),
      name: newCourseName,
      students: []
    };
    await apiService.saveCourse(newCourse);
    setNewCourseName('');
    load();
    onUpdate();
  };

  const handleAddStudent = async () => {
    if (!newStudentName.trim() || !selectedCourseId) return;
    const course = courses.find(c => c._id === selectedCourseId);
    if (course) {
      course.students.push({ id: Date.now().toString(), name: newStudentName });
      await apiService.saveCourse(course);
      setNewStudentName('');
      load();
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('¿Eliminar este curso y todos sus alumnos?')) {
      await apiService.deleteCourse(id);
      load();
      onUpdate();
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>, courseId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<any>(ws);

      const newStudents = data.map((row, i) => ({
        id: (Date.now() + i).toString(),
        name: row.Nombre || row.Alumno || Object.values(row)[0]
      }));

      const course = courses.find(c => c._id === courseId);
      if (course) {
        course.students = [...course.students, ...newStudents];
        await apiService.saveCourse(course);
        load();
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Crear Curso */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
          <PlusIcon className="h-5 w-5 text-indigo-500" /> Nuevo Curso
        </h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Nombre del curso (ej: 5to B)"
            className="flex-1 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500"
            value={newCourseName}
            onChange={e => setNewCourseName(e.target.value)}
          />
          <button onClick={handleCreateCourse} className="bg-indigo-600 text-white px-6 rounded-2xl font-bold">Crear</button>
        </div>
      </div>

      {/* Listado de Cursos */}
      <div className="grid gap-4">
        {courses.map(course => (
          <div key={course._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black text-slate-800">{course.name}</h4>
                <p className="text-sm text-slate-500">{course.students.length} alumnos</p>
              </div>
              <button onClick={() => handleDeleteCourse(course._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Nuevo alumno..."
                  className="flex-1 text-sm bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                  value={selectedCourseId === course._id ? newStudentName : ''}
                  onFocus={() => setSelectedCourseId(course._id)}
                  onChange={e => setNewStudentName(e.target.value)}
                />
                <button onClick={handleAddStudent} className="bg-slate-100 text-indigo-600 p-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                  <UserPlusIcon className="h-5 w-5" />
                </button>
              </div>
              
              <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 text-slate-400 text-sm py-3 rounded-xl cursor-pointer hover:border-indigo-400 hover:text-indigo-600 transition-all">
                <ArrowUpTrayIcon className="h-5 w-5" /> Importar Excel
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={(e) => handleImportExcel(e, course._id)} />
              </label>
            </div>

            {course.students.length > 0 && (
              <div className="max-h-32 overflow-y-auto bg-slate-50 rounded-2xl p-2 text-xs space-y-1">
                {course.students.map(s => (
                  <div key={s.id} className="p-2 bg-white rounded-lg shadow-sm flex justify-between">
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {courses.length === 0 && (
          <div className="text-center py-10">
            <InboxIcon className="h-12 w-12 text-slate-200 mx-auto" />
            <p className="text-slate-400 text-sm mt-2">No hay cursos para mostrar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAdmin;
