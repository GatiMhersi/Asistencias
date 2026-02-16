
import React, { useState, useEffect } from 'react';
import { UserRole, Course, AttendanceSession, AttendanceStatus } from './types';
import RoleSelection from './components/RoleSelection';
import TeacherRubric from './components/TeacherRubric';
import AttendanceView from './components/AttendanceView';
import SummaryView from './components/SummaryView';
import StudentAdmin from './components/StudentAdmin';
import HistoryView from './components/HistoryView';
import { apiService } from './services/apiService';
import { 
  AcademicCapIcon, 
  ArrowLeftIcon,
  HomeIcon,
  ClockIcon,
  UserGroupIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [view, setView] = useState<'home' | 'admin' | 'taking' | 'history' | 'summary'>('home');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [attendanceSession, setAttendanceSession] = useState<AttendanceSession | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const data = await apiService.getCourses();
    setCourses(data);
  };

  // Fixed: Use AttendanceStatus.PENDING instead of legacy status 2 and remove 'as any'
  const handleStartAttendance = (course: Course) => {
    setSelectedCourse(course);
    setAttendanceSession({
      date: new Date().toLocaleDateString('es-AR'),
      groupName: course.name,
      students: course.students.map(s => ({ ...s, status: AttendanceStatus.PENDING }))
    });
    setView('taking');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0 font-sans">
      <header className="bg-slate-900 text-white shadow-xl p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {role && (
            <button onClick={() => { setRole(null); setView('home'); }} className="p-2 hover:bg-slate-800 rounded-full transition-all">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <AcademicCapIcon className="h-8 w-8 text-indigo-400" />
          <h1 className="text-xl font-bold">Escuela Digital</h1>
        </div>
        {role && (
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500 px-3 py-1 rounded-full">
            Modo {role}
          </span>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {!role ? (
          <RoleSelection onSelect={setRole} />
        ) : role === 'preceptor' ? (
          <div className="space-y-6">
            {/* Sub-navegación Preceptor */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => setView('home')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${view === 'home' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 shadow-sm border'}`}
              >
                <HomeIcon className="h-4 w-4" /> Mis Cursos
              </button>
              <button 
                onClick={() => setView('admin')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${view === 'admin' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 shadow-sm border'}`}
              >
                <UserGroupIcon className="h-4 w-4" /> Gestión Alumnos
              </button>
              <button 
                onClick={() => setView('history')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${view === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 shadow-sm border'}`}
              >
                <ClockIcon className="h-4 w-4" /> Historial
              </button>
            </div>

            {view === 'home' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {courses.length === 0 ? (
                  <div className="col-span-full bg-white p-12 rounded-3xl text-center border-2 border-dashed border-slate-200">
                    <UserGroupIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-400">No hay cursos registrados</h3>
                    <button onClick={() => setView('admin')} className="mt-4 text-indigo-600 font-bold hover:underline">Ir a Gestión para crear uno</button>
                  </div>
                ) : (
                  courses.map(course => (
                    <div key={course._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md transition-all">
                      <div>
                        <h3 className="text-xl font-black text-slate-800">{course.name}</h3>
                        <p className="text-sm text-slate-500">{course.students.length} alumnos registrados</p>
                      </div>
                      <button 
                        onClick={() => handleStartAttendance(course)}
                        className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
                      >
                        <PlusCircleIcon className="h-6 w-6" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {view === 'admin' && <StudentAdmin onUpdate={loadCourses} />}
            {view === 'history' && <HistoryView />}
            {view === 'taking' && attendanceSession && (
              <AttendanceView 
                students={attendanceSession.students} 
                onUpdate={(id, status) => {
                  const newStudents = attendanceSession.students.map(s => s.id === id ? { ...s, status } : s);
                  setAttendanceSession({ ...attendanceSession, students: newStudents });
                }} 
                onFinalize={() => setView('summary')}
                loading={false}
              />
            )}
            {view === 'summary' && attendanceSession && (
              <SummaryView 
                session={attendanceSession} 
                onReset={() => { setView('home'); setAttendanceSession(null); }} 
              />
            )}
          </div>
        ) : (
          <TeacherRubric onBack={() => setRole(null)} />
        )}
      </main>
    </div>
  );
};

export default App;
