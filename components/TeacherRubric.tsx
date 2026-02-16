
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { DocumentArrowDownIcon, PencilSquareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { RubricData } from '../types';

interface Props {
  onBack: () => void;
}

const TeacherRubric: React.FC<Props> = ({ onBack }) => {
  const [formData, setFormData] = useState<RubricData>({
    topic: '',
    comprehension: 'Media',
    difficultStudents: '',
    description: '',
    date: new Date().toLocaleDateString('es-AR')
  });

  const [submitted, setSubmitted] = useState(false);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 30;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('Rúbrica Docente Diaria', margin, y);
    y += 15;

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha: ${formData.date}`, margin, y);
    y += 20;

    // Questions and Answers
    const questions = [
      { q: '1. Tema de la clase:', a: formData.topic },
      { q: '2. Nivel de comprensión general:', a: formData.comprehension },
      { q: '3. Alumnos con mayor dificultad:', a: formData.difficultStudents || 'Ninguno reportado' },
      { q: '4. Descripción del tema dado:', a: formData.description }
    ];

    questions.forEach(item => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(item.q, margin, y);
      y += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      // Split text to fit page width
      const lines = doc.splitTextToSize(item.a, 170);
      doc.text(lines, margin, y);
      y += (lines.length * 7) + 10;

      if (y > 270) {
        doc.addPage();
        y = 30;
      }
    });

    doc.save(`Rubrica_${formData.date.replace(/\//g, '-')}.pdf`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center space-y-4">
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircleIcon className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Rúbrica Generada</h2>
          <p className="text-slate-500">Los datos han sido procesados correctamente. Ahora puedes exportar el reporte en PDF.</p>
          
          <div className="pt-6 flex flex-col gap-4">
            <button 
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all"
            >
              <DocumentArrowDownIcon className="h-6 w-6" />
              DESCARGAR PDF
            </button>
            <button 
              onClick={() => {
                setSubmitted(false);
                setFormData({ ...formData, topic: '', description: '', difficultStudents: '' });
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Crear otra rúbrica
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-2">
        <PencilSquareIcon className="h-8 w-8 text-emerald-600" />
        <h2 className="text-2xl font-black text-slate-800">Nueva Rúbrica Docente</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl shadow-xl space-y-8 border border-slate-100">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">1. ¿Qué tema se dio hoy?</span>
            <input 
              required
              type="text"
              className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 focus:ring-emerald-500 focus:border-emerald-500 p-3"
              placeholder="Ej: Ecuaciones de segundo grado"
              value={formData.topic}
              onChange={e => setFormData({...formData, topic: e.target.value})}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">2. ¿Qué tanto lo comprendieron los alumnos?</span>
            <select 
              className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 focus:ring-emerald-500 focus:border-emerald-500 p-3"
              value={formData.comprehension}
              onChange={e => setFormData({...formData, comprehension: e.target.value})}
            >
              <option>Excelente</option>
              <option>Buena</option>
              <option>Media</option>
              <option>Baja / Con dificultades</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">3. ¿Con qué alumnos hubo más dificultad?</span>
            <textarea 
              className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 focus:ring-emerald-500 focus:border-emerald-500 p-3"
              rows={2}
              placeholder="Nombres de alumnos o 'Ninguno'..."
              value={formData.difficultStudents}
              onChange={e => setFormData({...formData, difficultStudents: e.target.value})}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">4. Descripción detallada del tema</span>
            <textarea 
              required
              className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 focus:ring-emerald-500 focus:border-emerald-500 p-3"
              rows={4}
              placeholder="Describe lo desarrollado en clase..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </label>
        </div>

        <button 
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          GENERAR RÚBRICA
        </button>
      </form>
    </div>
  );
};

export default TeacherRubric;
