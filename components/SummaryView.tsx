
import React from 'react';
import { AttendanceSession, AttendanceStatus } from '../types';
import * as XLSX from 'xlsx';
import { 
  ArrowPathIcon, 
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface Props {
  session: AttendanceSession;
  onReset: () => void;
}

const SummaryView: React.FC<Props> = ({ session, onReset }) => {
  const presentCount = session.students.filter(s => s.status === AttendanceStatus.PRESENT).length;
  const absentCount = session.students.filter(s => s.status === AttendanceStatus.ABSENT).length;

  const exportToExcel = () => {
    const today = new Date().toLocaleDateString('es-AR');
    
    // Formato solicitado: Primera columna Nombre, segunda columna Fecha actual con P/A
    const data = session.students.map(s => ({
      'Nombre del Alumno': s.name,
      [today]: s.status === AttendanceStatus.PRESENT ? 'P' : 'A'
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Ajustar anchos de columna para mejor visualización
    const wscols = [
      { wch: 30 }, // Nombre
      { wch: 15 }  // Fecha / Estado
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
    XLSX.writeFile(wb, `Asistencia_${session.groupName}_${today.replace(/\//g, '-')}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Registro Finalizado</h2>
        <p className="text-slate-500">{session.groupName} • {session.date}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
          <UsersIcon className="h-5 w-5 mx-auto mb-1 text-indigo-500" />
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
          <p className="text-2xl font-black text-slate-700">{session.students.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl shadow-sm border border-green-100 text-center">
          <CheckCircleIcon className="h-5 w-5 mx-auto mb-1 text-green-500" />
          <p className="text-[10px] font-bold text-green-600 uppercase">Presentes</p>
          <p className="text-2xl font-black text-green-700">{presentCount}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl shadow-sm border border-red-100 text-center">
          <XCircleIcon className="h-5 w-5 mx-auto mb-1 text-red-500" />
          <p className="text-[10px] font-bold text-red-600 uppercase">Ausentes</p>
          <p className="text-2xl font-black text-red-700">{absentCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b">
          <h3 className="font-bold text-slate-700 text-sm">Lista de Control</h3>
        </div>
        <div className="max-h-[40vh] overflow-y-auto">
          {session.students.map((student) => (
            <div key={student.id} className="p-3 border-b last:border-0 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">{student.name}</span>
              <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black ${
                student.status === AttendanceStatus.PRESENT 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
              }`}>
                {student.status === AttendanceStatus.PRESENT ? 'P' : 'A'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={exportToExcel}
          className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          <DocumentArrowDownIcon className="h-6 w-6" />
          DESCARGAR EXCEL (P/A)
        </button>
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-3 w-full bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold py-4 px-6 rounded-2xl transition-all"
        >
          <ArrowPathIcon className="h-6 w-6" />
          TOMAR OTRA LISTA
        </button>
      </div>
    </div>
  );
};

export default SummaryView;
