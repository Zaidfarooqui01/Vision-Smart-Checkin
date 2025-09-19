import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Students table
export const students = pgTable("students", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  rollNo: varchar("roll_no", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  department: varchar("department", { length: 10 }).notNull(),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Faculty table
export const faculty = pgTable("faculty", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  department: varchar("department", { length: 10 }).notNull(),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  department: varchar("department", { length: 10 }).notNull(),
  credits: integer("credits").default(3),
});

// Sessions table
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  subjectId: uuid("subject_id").references(() => subjects.id),
  facultyId: uuid("faculty_id").references(() => faculty.id),
  section: varchar("section", { length: 10 }).notNull(),
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end").notNull(),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  status: varchar("status", { length: 20 }).default("scheduled"), // scheduled, active, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendance records table
export const attendanceRecords = pgTable("attendance_records", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: uuid("session_id").references(() => sessions.id),
  studentId: uuid("student_id").references(() => students.id),
  status: varchar("status", { length: 20 }).notNull(), // present, absent, late
  markedAt: timestamp("marked_at"),
  markedBy: varchar("marked_by", { length: 50 }), // system, faculty, manual
  method: varchar("method", { length: 20 }), // facial_recognition, qr_code, manual
  isProxy: boolean("is_proxy").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// System logs table for audit trail
export const systemLogs = pgTable("system_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: uuid("entity_id"),
  userId: uuid("user_id"),
  details: text("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertStudentSchema = createInsertSchema(students).omit({ id: true, createdAt: true });
export const insertFacultySchema = createInsertSchema(faculty).omit({ id: true, createdAt: true });
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true });
export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true, createdAt: true });
export const insertAttendanceSchema = createInsertSchema(attendanceRecords).omit({ id: true, createdAt: true });
export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({ id: true, createdAt: true });

// Types
export type Student = typeof students.$inferSelect;
export type Faculty = typeof faculty.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type SystemLog = typeof systemLogs.$inferSelect;

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertFaculty = z.infer<typeof insertFacultySchema>;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
