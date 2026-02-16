
import React from 'react';
import { UserGroupIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { UserRole } from '../types';

interface Props {
  onSelect: (role: UserRole) => void;
}

const RoleSelection: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-2">¡Bienvenido!</h2>
        <p className="text-slate-500">Selecciona tu perfil para continuar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button 
          onClick={() => onSelect('preceptor')}
          className="bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-indigo-500 transition-all group active:scale-95 flex flex-col items-center text-center space-y-4"
        >
          <div className="bg-indigo-50 p-6 rounded-2xl group-hover:bg-indigo-100 transition-colors">
            <IdentificationIcon className="h-16 w-16 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Soy Preceptor</h3>
            <p className="text-sm text-slate-500 mt-2">Tomar asistencia a partir de un archivo Excel.</p>
          </div>
        </button>

        <button 
          onClick={() => onSelect('profesor')}
          className="bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-emerald-500 transition-all group active:scale-95 flex flex-col items-center text-center space-y-4"
        >
          <div className="bg-emerald-50 p-6 rounded-2xl group-hover:bg-emerald-100 transition-colors">
            <UserGroupIcon className="h-16 w-16 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Soy Profesor</h3>
            <p className="text-sm text-slate-500 mt-2">Generar rúbricas y reportes de clase del día.</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
