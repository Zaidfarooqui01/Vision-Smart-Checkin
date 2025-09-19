import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Camera, QrCode, CheckCircle, XCircle, Wifi, WifiOff } from "lucide-react";

interface KioskViewProps {
  onBack: () => void;
}

export default function KioskView({ onBack }: KioskViewProps) {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<string | null>(null);

  // Mock session data
  const sessionInfo = {
    subject: "Artificial Intelligence",
    class: "Section A", 
    faculty: "Prof. Ahmad",
    time: "9:00 AM - 10:00 AM"
  };

  // Mock attendance counters
  const attendanceStats = {
    present: 25,
    late: 3,
    absent: 12,
    total: 40
  };

  // Mock pending students for auto-scroll
  const pendingStudents = [
    "Mohammad Zaid (CS001)",
    "Mohammad Shoaib (CS002)", 
    "Shivam Mishra (CS003)",
    "Shubham Pal (CS004)",
    "Umra Hashmi (CS005)",
  ];

  const handleStartSession = () => {
    setSessionStarted(true);
    console.log('Session started');
  };

  const handleFaceDetection = () => {
    // Simulate face detection
    const mockStudent = "Mohammad Zaid";
    setCurrentStudent(mockStudent);
    setTimeout(() => {
      setCurrentStudent(null);
      console.log(`Marked ${mockStudent} present`);
    }, 2000);
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="absolute top-6 left-6"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Badge className="bg-role-kiosk text-white mb-4" data-testid="badge-role">
              Kiosk Mode
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              VISION Kiosk
            </h1>
            <p className="text-muted-foreground">
              Automated Attendance System
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">Session Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold" data-testid="session-subject">
                  {sessionInfo.subject}
                </p>
                <p className="text-muted-foreground" data-testid="session-details">
                  {sessionInfo.class} • {sessionInfo.faculty}
                </p>
                <p className="text-muted-foreground" data-testid="session-time">
                  {sessionInfo.time}
                </p>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button 
                  size="lg"
                  className="px-12 py-6 text-lg bg-role-kiosk hover:bg-role-kiosk/90"
                  onClick={handleStartSession}
                  data-testid="button-start-session"
                >
                  <Play className="h-6 w-6 mr-3" />
                  Start Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Live Session</h1>
              <p className="text-muted-foreground">{sessionInfo.subject} - {sessionInfo.class}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleOnlineStatus}
              className={isOnline ? "text-green-600" : "text-red-600"}
              data-testid="button-toggle-online"
            >
              {isOnline ? <Wifi className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />}
              {isOnline ? "Online" : "Offline"}
            </Button>
            <Badge className="bg-role-kiosk text-white" data-testid="badge-role">
              Kiosk Active
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Live Camera Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                  <div className="absolute inset-4 border-2 border-role-kiosk rounded-lg"></div>
                  
                  {currentStudent ? (
                    <div className="text-center text-white">
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <div className="bg-black/50 rounded-lg p-4">
                        <p className="text-xl font-bold" data-testid="detected-student">
                          {currentStudent}
                        </p>
                        <p className="text-green-400">✓ Attendance Marked</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg">Position your face in the frame</p>
                      <p className="text-sm text-gray-400">Camera will automatically detect and mark attendance</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4 mt-6">
                  <Button 
                    onClick={handleFaceDetection}
                    className="bg-role-kiosk hover:bg-role-kiosk/90"
                    data-testid="button-simulate-detection"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Simulate Detection
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => console.log('QR fallback activated')}
                    data-testid="button-qr-fallback"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Fallback
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Messages */}
            {!isOnline && (
              <Card className="mt-6 border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <WifiOff className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-yellow-800 font-medium" data-testid="offline-message">
                        No Internet Connection
                      </p>
                      <p className="text-yellow-700 text-sm">
                        Storing attendance offline - Will sync when connection restored
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isOnline && (
              <Card className="mt-6 border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-800 font-medium" data-testid="sync-message">
                      Sync Complete - All data backed up
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Live Stats and Pending */}
          <div className="space-y-6">
            {/* Live Counter */}
            <Card>
              <CardHeader>
                <CardTitle>Live Counter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600" data-testid="count-present">
                      {attendanceStats.present}
                    </p>
                    <p className="text-sm text-muted-foreground">Present</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600" data-testid="count-late">
                      {attendanceStats.late}
                    </p>
                    <p className="text-sm text-muted-foreground">Late</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600" data-testid="count-absent">
                      {attendanceStats.absent}
                    </p>
                    <p className="text-sm text-muted-foreground">Absent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-role-kiosk" data-testid="count-total">
                      {attendanceStats.total}
                    </p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-role-kiosk h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {Math.round(((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100)}% Marked
                </p>
              </CardContent>
            </Card>

            {/* Pending Students Auto-Scroll */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pendingStudents.map((student, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-lg"
                      data-testid={`pending-student-${index}`}
                    >
                      <span className="text-sm">{student}</span>
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
                {pendingStudents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>All students marked!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Controls */}
            <Card>
              <CardContent className="p-4">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => setSessionStarted(false)}
                  data-testid="button-end-session"
                >
                  End Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}