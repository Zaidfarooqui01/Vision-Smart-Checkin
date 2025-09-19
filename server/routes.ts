import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertSessionSchema, insertAttendanceSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Student Dashboard APIs
  app.get("/api/student/:studentId/attendance-stats", async (req, res) => {
    try {
      const { studentId } = req.params;
      const stats = await storage.getStudentAttendanceStats(studentId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching student attendance stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/student/:studentId/attendance-history", async (req, res) => {
    try {
      const { studentId } = req.params;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const end = endDate ? new Date(endDate as string) : new Date();
      
      const history = await storage.getAttendanceByDateRange(studentId, start, end);
      res.json(history);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Faculty Session Management APIs
  app.get("/api/faculty/:facultyId/active-session", async (req, res) => {
    try {
      const { facultyId } = req.params;
      const session = await storage.getActiveSession(facultyId);
      res.json(session);
    } catch (error) {
      console.error("Error fetching active session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/session/:sessionId/start", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.updateSessionStatus(sessionId, "active", new Date());
      res.json({ success: true });
    } catch (error) {
      console.error("Error starting session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/session/:sessionId/end", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.updateSessionStatus(sessionId, "completed", undefined, new Date());
      res.json({ success: true });
    } catch (error) {
      console.error("Error ending session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/session/:sessionId/attendance", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const attendance = await storage.getSessionAttendance(sessionId);
      res.json(attendance);
    } catch (error) {
      console.error("Error fetching session attendance:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/attendance/mark", async (req, res) => {
    try {
      const validatedData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendanceRecord({
        ...validatedData,
        markedAt: new Date()
      });
      res.json(attendance);
    } catch (error) {
      console.error("Error marking attendance:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin Analytics APIs
  app.get("/api/admin/kpis", async (req, res) => {
    try {
      const kpis = await storage.getSystemKPIs();
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching KPIs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/defaulters", async (req, res) => {
    try {
      const { threshold = 75 } = req.query;
      const defaulters = await storage.getAttendanceDefaulters(Number(threshold));
      res.json(defaulters);
    } catch (error) {
      console.error("Error fetching defaulters:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/department/:department/stats", async (req, res) => {
    try {
      const { department } = req.params;
      const stats = await storage.getDepartmentAttendanceStats(department);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching department stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/proxy-alerts", async (req, res) => {
    try {
      const alerts = await storage.getProxyDetectionAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching proxy alerts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/system-logs", async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const logs = await storage.getSystemLogs(Number(limit));
      res.json(logs);
    } catch (error) {
      console.error("Error fetching system logs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Kiosk APIs
  app.post("/api/kiosk/detect-student", async (req, res) => {
    try {
      const { sessionId, studentIdentifier, method = "facial_recognition" } = req.body;
      
      // In a real implementation, this would integrate with facial recognition or QR scanning
      // For now, we'll simulate the detection process
      
      // Mock: Find student by roll number or face ID
      const student = await storage.getStudentByRollNo(studentIdentifier);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Check if already marked
      const existingRecord = await storage.getAttendanceRecord(sessionId, student.id);
      if (existingRecord) {
        return res.json({ 
          success: false, 
          message: "Student already marked",
          student: student.name,
          status: existingRecord.status
        });
      }

      // Create attendance record
      const attendance = await storage.createAttendanceRecord({
        sessionId,
        studentId: student.id,
        status: "present",
        markedAt: new Date(),
        markedBy: "system",
        method
      });

      res.json({ 
        success: true, 
        student: student.name,
        attendance 
      });
    } catch (error) {
      console.error("Error in kiosk detection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Data seeding for demo (remove in production)
  app.post("/api/seed-data", async (req, res) => {
    try {
      // Create sample students
      const students = [
        { rollNo: "CS001", name: "Mohammad Zaid", department: "CS" },
        { rollNo: "CS002", name: "Mohammad Shoaib", department: "CS" },
        { rollNo: "CS003", name: "Shivam Mishra", department: "CS" },
        { rollNo: "CS004", name: "Shubham Pal", department: "CS" },
        { rollNo: "CS005", name: "Umra Hashmi", department: "CS" },
        { rollNo: "CS006", name: "Arshad Khan", department: "CS" },
      ];

      for (const studentData of students) {
        try {
          await storage.createStudent(studentData);
        } catch (err) {
          // Student might already exist, skip
          console.log(`Student ${studentData.rollNo} already exists`);
        }
      }

      res.json({ success: true, message: "Sample data seeded" });
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
