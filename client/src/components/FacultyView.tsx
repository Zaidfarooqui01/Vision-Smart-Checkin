import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Download
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface FacultyViewProps {
  onBack: () => void;
}

export default function FacultyView({ onBack }: FacultyViewProps) {
  const [sessionActive, setSessionActive] = useState(false);
  const [markedCount, setMarkedCount] = useState(32);
  const totalStudents = 40;

  // Mock student data
  const students = [
    { id: 1, name: "Alice Johnson", rollNo: "CS001", status: "present", time: "09:00 AM" },
    { id: 2, name: "Bob Smith", rollNo: "CS002", status: "late", time: "09:15 AM" },
    { id: 3, name: "Charlie Brown", rollNo: "CS003", status: "absent", time: "-" },
    { id: 4, name: "Diana Prince", rollNo: "CS004", status: "present", time: "09:02 AM" },
    { id: 5, name: "Eve Wilson", rollNo: "CS005", status: "pending", time: "-" },
    { id: 6, name: "Frank Miller", rollNo: "CS006", status: "present", time: "08:58 AM" },
  ];

  const pendingStudents = students.filter(s => s.status === "pending");
  
  const punctualityData = [
    { week: 'Week 1', onTime: 85, late: 12, absent: 3 },
    { week: 'Week 2', onTime: 78, late: 18, absent: 4 },
    { week: 'Week 3', onTime: 82, late: 15, absent: 3 },
    { week: 'Week 4', onTime: 88, late: 10, absent: 2 },
  ];

  const defaulterList = [
    { name: "Charlie Brown", percentage: 45, missedClasses: 12 },
    { name: "David Lee", percentage: 52, missedClasses: 10 },
    { name: "Grace Kim", percentage: 58, missedClasses: 8 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-attendance-present" />;
      case "late":
        return <Clock className="h-4 w-4 text-attendance-late" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-attendance-absent" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-attendance-pending" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      present: "bg-attendance-present text-white",
      late: "bg-attendance-late text-white", 
      absent: "bg-attendance-absent text-white",
      pending: "bg-attendance-pending text-white"
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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
              <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
              <p className="text-muted-foreground">Mathematics - Section A - Period 2 (9:00-10:00 AM)</p>
            </div>
          </div>
          <Badge className="bg-role-faculty text-white" data-testid="badge-role">
            Faculty View
          </Badge>
        </div>

        <Tabs defaultValue="session" className="space-y-6">
          <TabsList>
            <TabsTrigger value="session" data-testid="tab-session">Live Session</TabsTrigger>
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="session" className="space-y-6">
            {/* Session Control */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Session Control</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setSessionActive(!sessionActive)}
                      className={sessionActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                      data-testid="button-session-toggle"
                    >
                      {sessionActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {sessionActive ? "End Session" : "Start Session"}
                    </Button>
                    <Button variant="outline" size="icon" data-testid="button-more-actions">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-role-faculty" data-testid="text-marked-count">
                      {markedCount}/{totalStudents}
                    </p>
                    <p className="text-muted-foreground">Marked Present</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-attendance-pending" data-testid="text-pending-count">
                      {pendingStudents.length}
                    </p>
                    <p className="text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600" data-testid="text-completion">
                      {Math.round((markedCount / totalStudents) * 100)}%
                    </p>
                    <p className="text-muted-foreground">Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students.map((student) => (
                      <div 
                        key={student.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover-elevate"
                        data-testid={`student-item-${student.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(student.status)}
                          <div>
                            <p className="font-medium" data-testid={`student-name-${student.id}`}>
                              {student.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(student.status)}
                          <p className="text-xs text-muted-foreground mt-1">{student.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    Pending ({pendingStudents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingStudents.map((student) => (
                      <div 
                        key={student.id} 
                        className="flex items-center justify-between p-3 border rounded-lg"
                        data-testid={`pending-student-${student.id}`}
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => console.log(`Mark ${student.name} present`)}
                            data-testid={`button-mark-present-${student.id}`}
                          >
                            Present
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => console.log(`Mark ${student.name} absent`)}
                            data-testid={`button-mark-absent-${student.id}`}
                          >
                            Absent
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <p className="text-orange-800" data-testid="text-offline-notice">
                      Camera not responding - Continue with manual marking
                    </p>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-sync-later">
                    Sync Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Defaulter List */}
            <Card>
              <CardHeader>
                <CardTitle>Students Below 75% Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {defaulterList.map((student, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 border rounded-lg"
                      data-testid={`defaulter-${index}`}
                    >
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Missed {student.missedClasses} classes
                        </p>
                      </div>
                      <Badge 
                        className="bg-red-100 text-red-800"
                        data-testid={`defaulter-percentage-${index}`}
                      >
                        {student.percentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Punctuality Trends */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Punctuality Trends</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => console.log('Export clicked')}
                    data-testid="button-export-analytics"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={punctualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="onTime" fill="#10b981" name="On Time" />
                    <Bar dataKey="late" fill="#f59e0b" name="Late" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}