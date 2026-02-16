
import React, { useEffect } from 'react';
import { AttendanceSession, AttendanceStatus } from '../types';
import { apiService } from '../services/apiService';
import * as XLSX from 'xlsx';
import { 
  ArrowPathIcon, 
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

interface Props {
  session: AttendanceSession;
  onReset: () => void;
}

const SummaryView: React.FC<Props> = ({ session, onReset }) => {
  const presentCount = session.students.filter(s => s.status === AttendanceStatus.PRESENT).length;
  const absentCount = session.students.filter(s => s.status === AttendanceStatus.ABSENT).length;

  useEffect(() => {
    // Persistencia automática en el historial al finalizar
    const saveToDB = async () => {
      const records = session.students.map(s => ({
        studentName: s.name,
        status: s.status === AttendanceStatus.PRESENT ? 'P' : 'A'
      }));
      await apiService.saveAttendance(session.groupName, session.date, records);
    };
    saveToDB();
  }, []);

  const exportToExcel = () => {
    const today = session.date;
    const data = session.students.map(s => ({
      'Nombre del Alumno': s.name,
      [today]: s.status === AttendanceStatus.PRESENT ? 'P' : 'A'
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 30 }, { wch: 15 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
    XLSX.writeFile(wb, `Asistencia_${session.groupName}_${today.replace(/\//g, '-')}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-indigo-600 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
        <CloudArrowUpIcon className="absolute -right-10 -bottom-10 h-40 w-40 text-white/10" />
        <h2 className="text-3xl font-black mb-1">Registro Guardado</h2>
        <p className="text-white/80">{session.groupName} • {session.date}</p>
        <div className="mt-6 flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold opacity-70">Presentes</span>
                <span className="text-2xl font-black">{presentCount}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold opacity-70">Ausentes</span>
                <span className="text-2xl font-black">{absentCount}</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
          <h3 className="font-bold text-slate-700 text-sm">Resumen Detallado</h3>
          <span className="text-xs bg-slate-200 px-2 py-1 rounded-lg font-bold">{session.students.length} Alumnos</span>
        </div>
        <div className="max-h-[35vh] overflow-y-auto">
          {session.students.map((student) => (
            <div key={student.id} className="p-4 border-b last:border-0 flex justify-between items-center hover:bg-slate-50 transition-colors">
              <span className="text-sm font-semibold text-slate-700">{student.name}</span>
              <span className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black shadow-sm ${
                student.status === AttendanceStatus.PRESENT 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
              }`}>
                {student.status === AttendanceStatus.PRESENT ? 'P' : 'A'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={exportToExcel}
          className="flex items-center justify-center gap-3 bg-slate-900 text-white font-bold py-5 px-6 rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          <DocumentArrowDownIcon className="h-6 w-6 text-indigo-400" />
          DESCARGAR EXCEL
        </button>
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-600 font-bold py-5 px-6 rounded-3xl shadow-sm hover:bg-slate-50 transition-all"
        >
          <ArrowPathIcon className="h-6 w-6" />
          VOLVER AL INICIO
        </button>
      </div>
    </div>
  );
};

export default SummaryView;
