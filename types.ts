
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  PENDING = 'PENDING'
}

export interface Student {
  id: string;
  name: string;
  status: AttendanceStatus;
  lastUpdated?: string;
}

export interface AttendanceSession {
  date: string;
  groupName: string;
  students: Student[];
}
