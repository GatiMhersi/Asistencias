
/**
 * Estos esquemas son para ser utilizados en tu servidor Node.js/Express.
 */

const mongoose = require('mongoose');

// Esquema de Alumno
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: true }
});

// Esquema de Curso
const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  students: [StudentSchema]
});

// Esquema de Registro de Asistencia
const AttendanceRecordSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  courseName: String,
  date: { type: String, required: true }, // Formato DD/MM/YYYY
  records: [{
    studentName: String,
    status: { type: String, enum: ['P', 'A'] }
  }]
});

// Esquema de Rúbrica Docente
const RubricSchema = new mongoose.Schema({
  date: { type: String, required: true },
  topic: String,
  comprehension: String,
  difficultStudents: String,
  description: String
});

module.exports = {
  Course: mongoose.model('Course', CourseSchema),
  Attendance: mongoose.model('Attendance', AttendanceRecordSchema),
  Rubric: mongoose.model('Rubric', RubricSchema)
};
    