
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { AttendanceStatus, Student, AttendanceSession, UserRole } from './types';
import AttendanceView from './components/AttendanceView';
import SummaryView from './components/SummaryView';
import RoleSelection from './components/RoleSelection';
import TeacherRubric from './components/TeacherRubric';
import { 
  AcademicCapIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [view, setView] = useState<'upload' | 'taking' | 'summary' | 'rubric'>('upload');
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<any>(ws);

      const students: Student[] = data.map((row, index) => {
        const nameKey = Object.keys(row).find(key => 
          key.toLowerCase().includes('nombre') || 
          key.toLowerCase().includes('alumno') ||
          key.toLowerCase().includes('apellido')
        ) || Object.keys(row)[0];

        return {
          id: String(index),
          name: row[nameKey] || `Alumno ${index + 1}`,
          status: AttendanceStatus.PENDING
        };
      });

      setSession({
        date: new Date().toLocaleDateString('es-AR'),
        groupName: file.name.replace(/\.[^/.]+$/, ""),
        students
      });
      setLoading(false);
      setView('taking');
    };
    reader.readAsBinaryString(file);
  };

  const updateStudentStatus = (id: string, status: AttendanceStatus) => {
    if (!session) return;
    const newStudents = session.students.map(s => 
      s.id === id ? { ...s, status, lastUpdated: new Date().toISOString() } : s
    );
    setSession({ ...session, students: newStudents });
  };

  const finalizeAttendance = () => {
    setView('summary');
  };

  const reset = () => {
    setSession(null);
    setView('upload');
    if (role === 'preceptor') {
       // stay in preceptor upload
    }
  };

  const handleBackToRoles = () => {
    setRole(null);
    setView('upload');
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <header className="bg-indigo-700 text-white shadow-lg p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {role && (
            <button 
              onClick={handleBackToRoles}
              className="p-1 hover:bg-indigo-600 rounded-lg transition-colors mr-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <AcademicCapIcon className="h-8 w-8" />
          <h1 className="text-xl font-bold tracking-tight">Gestión Escolar</h1>
        </div>
        {role && (
          <div className="text-xs bg-indigo-600 px-3 py-1 rounded-full border border-indigo-400 font-semibold uppercase tracking-wider">
            {role}
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {!role ? (
          <RoleSelection onSelect={setRole} />
        ) : role === 'preceptor' ? (
          <>
            {view === 'upload' && (
               <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-100 max-w-md w-full">
                  <h2 className="text-2xl font-bold mb-2">Preceptoría</h2>
                  <p className="text-slate-500 mb-8">Sube el Excel de alumnos para tomar asistencia.</p>
                  <label className="block w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-95">
                    Cargar Excel Alumnos
                    <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            )}
            {view === 'taking' && session && (
              <AttendanceView 
                students={session.students} 
                onUpdate={updateStudentStatus} 
                onFinalize={finalizeAttendance}
                loading={loading}
              />
            )}
            {view === 'summary' && session && (
              <SummaryView session={session} onReset={reset} />
            )}
          </>
        ) : (
          <TeacherRubric onBack={handleBackToRoles} />
        )}
      </main>

      {loading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-400 border-t-transparent mb-4"></div>
          <p className="font-semibold text-lg">Cargando datos...</p>
        </div>
      )}
    </div>
  );
};

export default App;
