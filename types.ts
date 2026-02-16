
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  PENDING = 'PENDING'
}

export interface Student {
  id: string;
  name: string;
  status: AttendanceStatus;
}

export interface Course {
  _id: string;
  name: string;
  students: { id: string; name: string }[];
}

export interface AttendanceHistory {
  _id: string;
  date: string;
  courseName: string;
  presentCount: number;
  absentCount: number;
}

export type UserRole = 'preceptor' | 'profesor' | null;

export interface RubricData {
  topic: string;
  comprehension: string;
  difficultStudents: string;
  description: string;
  date: string;
}

// Added missing AttendanceSession interface
export interface AttendanceSession {
  date: string;
  groupName: string;
  students: Student[];
}
