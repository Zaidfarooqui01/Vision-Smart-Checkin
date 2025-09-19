import { 
  type Student, 
  type Faculty, 
  type Subject, 
  type Session, 
  type AttendanceRecord,
  type SystemLog,
  type InsertStudent, 
  type InsertFaculty, 
  type InsertSubject, 
  type InsertSession, 
  type InsertAttendance,
  type InsertSystemLog,
  students,
  faculty,
  subjects,
  sessions,
  attendanceRecords,
  systemLogs
} from "@shared/schema";


export interface IStorage {
  // Students
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByRollNo(rollNo: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  getStudentsByDepartment(department: string): Promise<Student[]>;

  // Faculty
  getFaculty(id: string): Promise<Faculty | undefined>;
  getFacultyByEmployeeId(employeeId: string): Promise<Faculty | undefined>;
  createFaculty(faculty: InsertFaculty): Promise<Faculty>;

  // Subjects
  getSubject(id: string): Promise<Subject | undefined>;
  getSubjectsByDepartment(department: string): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Sessions
  getSession(id: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSessionStatus(id: string, status: string, actualStart?: Date, actualEnd?: Date): Promise<void>;
  getActiveSession(facultyId: string): Promise<Session | undefined>;
  getSessionsByDateRange(startDate: Date, endDate: Date): Promise<Session[]>;

  // Attendance
  getAttendanceRecord(sessionId: string, studentId: string): Promise<AttendanceRecord | undefined>;
  createAttendanceRecord(attendance: InsertAttendance): Promise<AttendanceRecord>;
  updateAttendanceRecord(id: string, status: string, markedAt: Date, method: string): Promise<void>;
  getSessionAttendance(sessionId: string): Promise<AttendanceRecord[]>;
  getStudentAttendanceStats(studentId: string): Promise<{ total: number; present: number; late: number; absent: number }>;
  getAttendanceByDateRange(studentId: string, startDate: Date, endDate: Date): Promise<AttendanceRecord[]>;
  getDepartmentAttendanceStats(department: string): Promise<{ department: string; total: number; present: number; absent: number }[]>;

  // System logs
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  getSystemLogs(limit?: number): Promise<SystemLog[]>;

  // Analytics
  getAttendanceDefaulters(threshold: number): Promise<{ studentId: string; name: string; percentage: number; missedClasses: number }[]>;
  getProxyDetectionAlerts(): Promise<{ count: number; recent: AttendanceRecord[] }>;
  getSystemKPIs(): Promise<{ automatedEntries: number; avgMarkingTime: number; proxyFailsCaught: number; systemUptime: number }>;
}

// Use the mock storage for local development

export { storage } from "./mockStorage";
