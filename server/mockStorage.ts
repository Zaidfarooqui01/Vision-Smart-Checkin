import {
  Student, Faculty, Subject, Session, AttendanceRecord, SystemLog,
  InsertStudent, InsertFaculty, InsertSubject, InsertSession, InsertAttendance, InsertSystemLog
} from "@shared/schema";

// In-memory mock data
const mockStudents: Student[] = [];
const mockFaculty: Faculty[] = [];
const mockSubjects: Subject[] = [];
const mockSessions: Session[] = [];
const mockAttendanceRecords: AttendanceRecord[] = [];
const mockSystemLogs: SystemLog[] = [];

export class MockStorage {
  // Students
  async getStudent(id: string): Promise<Student | undefined> {
    return mockStudents.find(s => s.id === id);
  }
  async getStudentByRollNo(rollNo: string): Promise<Student | undefined> {
    return mockStudents.find(s => s.rollNo === rollNo);
  }
  async createStudent(student: InsertStudent): Promise<Student> {
    const newStudent = { ...student, id: crypto.randomUUID(), createdAt: new Date() } as Student;
    mockStudents.push(newStudent);
    return newStudent;
  }
  async getStudentsByDepartment(department: string): Promise<Student[]> {
    return mockStudents.filter(s => s.department === department);
  }

  // Faculty
  async getFaculty(id: string): Promise<Faculty | undefined> {
    return mockFaculty.find(f => f.id === id);
  }
  async getFacultyByEmployeeId(employeeId: string): Promise<Faculty | undefined> {
    return mockFaculty.find(f => f.employeeId === employeeId);
  }
  async createFaculty(facultyData: InsertFaculty): Promise<Faculty> {
    const newFaculty = { ...facultyData, id: crypto.randomUUID(), createdAt: new Date() } as Faculty;
    mockFaculty.push(newFaculty);
    return newFaculty;
  }

  // Subjects
  async getSubject(id: string): Promise<Subject | undefined> {
    return mockSubjects.find(s => s.id === id);
  }
  async getSubjectsByDepartment(department: string): Promise<Subject[]> {
    return mockSubjects.filter(s => s.department === department);
  }
  async createSubject(subject: InsertSubject): Promise<Subject> {
    const newSubject = { ...subject, id: crypto.randomUUID() } as Subject;
    mockSubjects.push(newSubject);
    return newSubject;
  }

  // Sessions
  async getSession(id: string): Promise<Session | undefined> {
    return mockSessions.find(s => s.id === id);
  }
  async createSession(session: InsertSession): Promise<Session> {
    const newSession = { ...session, id: crypto.randomUUID(), createdAt: new Date() } as Session;
    mockSessions.push(newSession);
    return newSession;
  }
  async updateSessionStatus(id: string, status: string, actualStart?: Date, actualEnd?: Date): Promise<void> {
    const session = mockSessions.find(s => s.id === id);
    if (session) {
      session.status = status;
      if (actualStart) session.actualStart = actualStart;
      if (actualEnd) session.actualEnd = actualEnd;
    }
  }
  async getActiveSession(facultyId: string): Promise<Session | undefined> {
    return mockSessions.find(s => s.facultyId === facultyId && s.status === "active");
  }
  async getSessionsByDateRange(startDate: Date, endDate: Date): Promise<Session[]> {
    return mockSessions.filter(s => s.scheduledStart >= startDate && s.scheduledEnd <= endDate);
  }

  // Attendance
  async getAttendanceRecord(sessionId: string, studentId: string): Promise<AttendanceRecord | undefined> {
    return mockAttendanceRecords.find(a => a.sessionId === sessionId && a.studentId === studentId);
  }
  async createAttendanceRecord(attendance: InsertAttendance): Promise<AttendanceRecord> {
    const newAttendance = { ...attendance, id: crypto.randomUUID(), createdAt: new Date() } as AttendanceRecord;
    mockAttendanceRecords.push(newAttendance);
    return newAttendance;
  }
  async updateAttendanceRecord(id: string, status: string, markedAt: Date, method: string): Promise<void> {
    const record = mockAttendanceRecords.find(a => a.id === id);
    if (record) {
      record.status = status;
      record.markedAt = markedAt;
      record.method = method;
    }
  }
  async getSessionAttendance(sessionId: string): Promise<AttendanceRecord[]> {
    return mockAttendanceRecords.filter(a => a.sessionId === sessionId);
  }
  async getStudentAttendanceStats(studentId: string): Promise<{ total: number; present: number; late: number; absent: number }> {
    const records = mockAttendanceRecords.filter(a => a.studentId === studentId);
    return {
      total: records.length,
      present: records.filter(a => a.status === "present").length,
      late: records.filter(a => a.status === "late").length,
      absent: records.filter(a => a.status === "absent").length
    };
  }
  async getAttendanceByDateRange(studentId: string, startDate: Date, endDate: Date): Promise<AttendanceRecord[]> {
    return mockAttendanceRecords.filter(a => a.studentId === studentId && a.markedAt && a.markedAt >= startDate && a.markedAt <= endDate);
  }
  async getDepartmentAttendanceStats(department: string): Promise<{ department: string; total: number; present: number; absent: number }[]> {
  const studentsInDept = mockStudents.filter(s => s.department === department).map(s => s.id).filter((id): id is string => typeof id === 'string');
  const records = mockAttendanceRecords.filter(a => a.studentId && studentsInDept.includes(a.studentId));
    return [{
      department,
      total: records.length,
      present: records.filter(a => a.status === "present").length,
      absent: records.filter(a => a.status === "absent").length
    }];
  }

  // System logs
  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const newLog = { ...log, id: crypto.randomUUID(), createdAt: new Date() } as SystemLog;
    mockSystemLogs.push(newLog);
    return newLog;
  }
  async getSystemLogs(limit: number = 50): Promise<SystemLog[]> {
    return mockSystemLogs.slice(-limit).reverse();
  }

  // Analytics
  async getAttendanceDefaulters(threshold: number = 75): Promise<{ studentId: string; name: string; percentage: number; missedClasses: number }[]> {
    // Dummy data
    return [
      { studentId: "1", name: "Shivam Mishra", percentage: 45, missedClasses: 12 },
      { studentId: "2", name: "Rajesh Kumar", percentage: 52, missedClasses: 10 },
      { studentId: "3", name: "Priya Sharma", percentage: 58, missedClasses: 8 },
    ];
  }
  async getProxyDetectionAlerts(): Promise<{ count: number; recent: AttendanceRecord[] }> {
    const recent = mockAttendanceRecords.filter(a => a.isProxy).slice(-5).reverse();
    return { count: recent.length, recent };
  }
  async getSystemKPIs(): Promise<{ automatedEntries: number; avgMarkingTime: number; proxyFailsCaught: number; systemUptime: number }> {
    return {
      automatedEntries: 87,
      avgMarkingTime: 2.3,
      proxyFailsCaught: 12,
      systemUptime: 99.8
    };
  }
}

export const storage = new MockStorage();
export default storage;
