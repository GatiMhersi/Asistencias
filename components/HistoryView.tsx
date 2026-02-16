
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { ClockIcon, CalendarDaysIcon, UserIcon } from '@heroicons/react/24/outline';

const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await apiService.getHistory();
    setHistory(data.reverse()); // Los más recientes primero
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
        <ClockIcon className="h-6 w-6 text-indigo-500" /> Historial de Asistencia
      </h3>

      {history.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-slate-100">
          <CalendarDaysIcon className="h-12 w-12 text-slate-200 mx-auto mb-2" />
          <p className="text-slate-400">Aún no hay registros de asistencia guardados.</p>
        </div>
      ) : (
        history.map((item) => (
          <div key={item._id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                <CalendarDaysIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Fecha: {item.date}</p>
                <h4 className="text-lg font-black text-slate-800">{item.courseName}</h4>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1 bg-green-50 px-4 py-2 rounded-2xl border border-green-100 text-center">
                <p className="text-[10px] font-bold text-green-600 uppercase">Pres.</p>
                <p className="text-lg font-black text-green-700">{item.presentCount}</p>
              </div>
              <div className="flex-1 bg-red-50 px-4 py-2 rounded-2xl border border-red-100 text-center">
                <p className="text-[10px] font-bold text-red-600 uppercase">Aus.</p>
                <p className="text-lg font-black text-red-700">{item.absentCount}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryView;
