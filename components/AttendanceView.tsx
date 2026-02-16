
import React, { useState } from 'react';
import { Student, AttendanceStatus } from '../types';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FlagIcon
} from '@heroicons/react/24/solid';

interface Props {
  students: Student[];
  onUpdate: (id: string, status: AttendanceStatus) => void;
  onFinalize: () => void;
  loading: boolean;
}

const AttendanceView: React.FC<Props> = ({ students, onUpdate, onFinalize, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStudent = students[currentIndex];
  
  const pendingCount = students.filter(s => s.status === AttendanceStatus.PENDING).length;
  const progress = ((students.length - pendingCount) / students.length) * 100;

  const handleStatusChange = (status: AttendanceStatus) => {
    onUpdate(currentStudent.id, status);
    if (currentIndex < students.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-slate-500">Progreso</span>
          <span className="text-lg font-bold text-indigo-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div 
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          {students.length - pendingCount} de {students.length} alumnos registrados
        </p>
      </div>

      {/* Main Attendance Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 min-h-[400px] flex flex-col">
        <div className="bg-slate-50 p-6 flex items-center justify-between border-b">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-30 transition-colors"
          >
            <ChevronLeftIcon className="h-8 w-8 text-slate-600" />
          </button>
          <span className="text-slate-400 font-medium uppercase tracking-widest text-xs">
            Alumno {currentIndex + 1} de {students.length}
          </span>
          <button 
            disabled={currentIndex === students.length - 1}
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-30 transition-colors"
          >
            <ChevronRightIcon className="h-8 w-8 text-slate-600" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-indigo-50 p-4 rounded-full mb-6">
            <UserCircleIcon className="h-24 w-24 text-indigo-200" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 break-words w-full">
            {currentStudent.name}
          </h2>
          <div className="mt-4">
            {currentStudent.status === AttendanceStatus.PRESENT && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold">
                <CheckCircleIcon className="h-4 w-4" /> Presente
              </span>
            )}
            {currentStudent.status === AttendanceStatus.ABSENT && (
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-bold">
                <XCircleIcon className="h-4 w-4" /> Ausente
              </span>
            )}
            {currentStudent.status === AttendanceStatus.PENDING && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-400 px-4 py-1 rounded-full text-sm font-bold">
                Pendiente
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 grid grid-cols-2 gap-4 bg-slate-50 border-t">
          <button 
            onClick={() => handleStatusChange(AttendanceStatus.ABSENT)}
            className={`flex flex-col items-center justify-center gap-2 py-6 rounded-2xl font-bold transition-all shadow-md active:scale-95 ${
              currentStudent.status === AttendanceStatus.ABSENT 
              ? 'bg-red-600 text-white' 
              : 'bg-white text-red-600 border-2 border-red-100'
            }`}
          >
            <XCircleIcon className="h-10 w-10" />
            AUSENTE
          </button>
          <button 
            onClick={() => handleStatusChange(AttendanceStatus.PRESENT)}
            className={`flex flex-col items-center justify-center gap-2 py-6 rounded-2xl font-bold transition-all shadow-md active:scale-95 ${
              currentStudent.status === AttendanceStatus.PRESENT 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-green-600 border-2 border-green-100'
            }`}
          >
            <CheckCircleIcon className="h-10 w-10" />
            PRESENTE
          </button>
        </div>
      </div>

      {/* Finalize Button */}
      <button 
        onClick={onFinalize}
        disabled={pendingCount > 0 || loading}
        className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white py-5 px-6 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all"
      >
        <FlagIcon className="h-6 w-6" />
        FINALIZAR ASISTENCIA
      </button>
      
      {pendingCount > 0 && (
        <p className="text-center text-slate-400 text-sm italic">
          Debes completar todos los alumnos para finalizar.
        </p>
      )}
    </div>
  );
};

export default AttendanceView;
