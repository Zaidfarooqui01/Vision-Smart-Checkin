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
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and, desc, count, sql, gte, lte } from "drizzle-orm";

const connection = neon(process.env.DATABASE_URL!);
const db = drizzle(connection);

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

export class DatabaseStorage implements IStorage {
  // Students
  async getStudent(id: string): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
    return result[0];
  }

  async getStudentByRollNo(rollNo: string): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.rollNo, rollNo)).limit(1);
    return result[0];
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const result = await db.insert(students).values(student).returning();
    return result[0];
  }

  async getStudentsByDepartment(department: string): Promise<Student[]> {
    return await db.select().from(students).where(eq(students.department, department));
  }

  // Faculty
  async getFaculty(id: string): Promise<Faculty | undefined> {
    const result = await db.select().from(faculty).where(eq(faculty.id, id)).limit(1);
    return result[0];
  }

  async getFacultyByEmployeeId(employeeId: string): Promise<Faculty | undefined> {
    const result = await db.select().from(faculty).where(eq(faculty.employeeId, employeeId)).limit(1);
    return result[0];
  }

  async createFaculty(facultyData: InsertFaculty): Promise<Faculty> {
    const result = await db.insert(faculty).values(facultyData).returning();
    return result[0];
  }

  // Subjects
  async getSubject(id: string): Promise<Subject | undefined> {
    const result = await db.select().from(subjects).where(eq(subjects.id, id)).limit(1);
    return result[0];
  }

  async getSubjectsByDepartment(department: string): Promise<Subject[]> {
    return await db.select().from(subjects).where(eq(subjects.department, department));
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const result = await db.insert(subjects).values(subject).returning();
    return result[0];
  }

  // Sessions
  async getSession(id: string): Promise<Session | undefined> {
    const result = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
    return result[0];
  }

  async createSession(session: InsertSession): Promise<Session> {
    const result = await db.insert(sessions).values(session).returning();
    return result[0];
  }

  async updateSessionStatus(id: string, status: string, actualStart?: Date, actualEnd?: Date): Promise<void> {
    const updateData: any = { status };
    if (actualStart) updateData.actualStart = actualStart;
    if (actualEnd) updateData.actualEnd = actualEnd;
    
    await db.update(sessions).set(updateData).where(eq(sessions.id, id));
  }

  async getActiveSession(facultyId: string): Promise<Session | undefined> {
    const result = await db.select().from(sessions)
      .where(and(eq(sessions.facultyId, facultyId), eq(sessions.status, "active")))
      .limit(1);
    return result[0];
  }

  async getSessionsByDateRange(startDate: Date, endDate: Date): Promise<Session[]> {
    return await db.select().from(sessions)
      .where(and(gte(sessions.scheduledStart, startDate), lte(sessions.scheduledEnd, endDate)))
      .orderBy(desc(sessions.scheduledStart));
  }

  // Attendance
  async getAttendanceRecord(sessionId: string, studentId: string): Promise<AttendanceRecord | undefined> {
    const result = await db.select().from(attendanceRecords)
      .where(and(eq(attendanceRecords.sessionId, sessionId), eq(attendanceRecords.studentId, studentId)))
      .limit(1);
    return result[0];
  }

  async createAttendanceRecord(attendance: InsertAttendance): Promise<AttendanceRecord> {
    const result = await db.insert(attendanceRecords).values(attendance).returning();
    return result[0];
  }

  async updateAttendanceRecord(id: string, status: string, markedAt: Date, method: string): Promise<void> {
    await db.update(attendanceRecords)
      .set({ status, markedAt, method })
      .where(eq(attendanceRecords.id, id));
  }

  async getSessionAttendance(sessionId: string): Promise<AttendanceRecord[]> {
    return await db.select().from(attendanceRecords)
      .where(eq(attendanceRecords.sessionId, sessionId));
  }

  async getStudentAttendanceStats(studentId: string): Promise<{ total: number; present: number; late: number; absent: number }> {
    const totalResult = await db.select({ count: count() }).from(attendanceRecords)
      .where(eq(attendanceRecords.studentId, studentId));
    
    const presentResult = await db.select({ count: count() }).from(attendanceRecords)
      .where(and(eq(attendanceRecords.studentId, studentId), eq(attendanceRecords.status, "present")));
    
    const lateResult = await db.select({ count: count() }).from(attendanceRecords)
      .where(and(eq(attendanceRecords.studentId, studentId), eq(attendanceRecords.status, "late")));
    
    const absentResult = await db.select({ count: count() }).from(attendanceRecords)
      .where(and(eq(attendanceRecords.studentId, studentId), eq(attendanceRecords.status, "absent")));

    return {
      total: totalResult[0].count,
      present: presentResult[0].count,
      late: lateResult[0].count,
      absent: absentResult[0].count
    };
  }

  async getAttendanceByDateRange(studentId: string, startDate: Date, endDate: Date): Promise<AttendanceRecord[]> {
    return await db.select().from(attendanceRecords)
      .innerJoin(sessions, eq(attendanceRecords.sessionId, sessions.id))
      .where(and(
        eq(attendanceRecords.studentId, studentId),
        gte(sessions.scheduledStart, startDate),
        lte(sessions.scheduledEnd, endDate)
      ));
  }

  async getDepartmentAttendanceStats(department: string): Promise<{ department: string; total: number; present: number; absent: number }[]> {
    // This is a simplified version - in production you'd want more sophisticated analytics
    const result = await db.select({
      department: students.department,
      total: count(),
      present: sql<number>`SUM(CASE WHEN ${attendanceRecords.status} = 'present' THEN 1 ELSE 0 END)`,
      absent: sql<number>`SUM(CASE WHEN ${attendanceRecords.status} = 'absent' THEN 1 ELSE 0 END)`
    })
    .from(attendanceRecords)
    .innerJoin(students, eq(attendanceRecords.studentId, students.id))
    .where(eq(students.department, department))
    .groupBy(students.department);

    return result;
  }

  // System logs
  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const result = await db.insert(systemLogs).values(log).returning();
    return result[0];
  }

  async getSystemLogs(limit: number = 50): Promise<SystemLog[]> {
    return await db.select().from(systemLogs)
      .orderBy(desc(systemLogs.createdAt))
      .limit(limit);
  }

  // Analytics
  async getAttendanceDefaulters(threshold: number = 75): Promise<{ studentId: string; name: string; percentage: number; missedClasses: number }[]> {
    // Mock implementation - would need complex SQL for real calculation
    return [
      { studentId: "1", name: "Charlie Brown", percentage: 45, missedClasses: 12 },
      { studentId: "2", name: "David Lee", percentage: 52, missedClasses: 10 },
      { studentId: "3", name: "Grace Kim", percentage: 58, missedClasses: 8 },
    ];
  }

  async getProxyDetectionAlerts(): Promise<{ count: number; recent: AttendanceRecord[] }> {
    const recentAlerts = await db.select().from(attendanceRecords)
      .where(eq(attendanceRecords.isProxy, true))
      .orderBy(desc(attendanceRecords.createdAt))
      .limit(5);

    const countResult = await db.select({ count: count() }).from(attendanceRecords)
      .where(eq(attendanceRecords.isProxy, true));

    return {
      count: countResult[0].count,
      recent: recentAlerts
    };
  }

  async getSystemKPIs(): Promise<{ automatedEntries: number; avgMarkingTime: number; proxyFailsCaught: number; systemUptime: number }> {
    // Mock KPIs - in production these would be calculated from real data
    return {
      automatedEntries: 87,
      avgMarkingTime: 2.3,
      proxyFailsCaught: 12,
      systemUptime: 99.8
    };
  }
}

export const storage = new DatabaseStorage();
