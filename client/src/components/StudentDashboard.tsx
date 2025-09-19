import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Upload, Download } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface StudentDashboardProps {
  onBack: () => void;
}

export default function StudentDashboard({ onBack }: StudentDashboardProps) {
  // Mock attendance data
  const todayStatus: "present" | "absent" | "late" = "present";
  const subjectPercentage = 78;
  const semesterTotal = 85;
  
  const subjectData = [
    { name: 'Mathematics', value: 85, color: '#10b981' },
    { name: 'Physics', value: 72, color: '#f59e0b' },
    { name: 'Chemistry', value: 90, color: '#8b5cf6' },
    { name: 'Biology', value: 68, color: '#ef4444' },
  ];
  
  const weeklyData = [
    { day: 'Mon', present: 4, absent: 0 },
    { day: 'Tue', present: 3, absent: 1 },
    { day: 'Wed', present: 4, absent: 0 },
    { day: 'Thu', present: 2, absent: 2 },
    { day: 'Fri', present: 3, absent: 1 },
    { day: 'Sat', present: 2, absent: 0 },
    { day: 'Sun', present: 0, absent: 0 },
  ];

  const semesterProgress = [
    { month: 'Aug', percentage: 65 },
    { month: 'Sep', percentage: 72 },
    { month: 'Oct', percentage: 78 },
    { month: 'Nov', percentage: 85 },
    { month: 'Dec', percentage: 82 },
  ];

  const renderStatusIcon = () => {
    if (todayStatus === "present") {
      return <CheckCircle className="h-8 w-8 text-attendance-present" />;
    }
    if (todayStatus === "absent") {
      return <XCircle className="h-8 w-8 text-attendance-absent" />;
    }
    if (todayStatus === "late") {
      return <AlertCircle className="h-8 w-8 text-attendance-late" />;
    }
    return <AlertCircle className="h-8 w-8 text-attendance-pending" />;
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
              <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
              <p className="text-muted-foreground">Today's Attendance Status</p>
            </div>
          </div>
          <Badge className="bg-role-student text-white" data-testid="badge-role">
            Student View
          </Badge>
        </div>

        {/* Today's Status */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {renderStatusIcon()}
                <div>
                  <h2 className="text-2xl font-semibold capitalize" data-testid="text-status">
                    {todayStatus}
                  </h2>
                  <p className="text-muted-foreground">Current Status</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex space-x-6">
                  <div>
                    <p className="text-2xl font-bold text-role-student" data-testid="text-subject-percentage">
                      {subjectPercentage}%
                    </p>
                    <p className="text-sm text-muted-foreground">Subject Average</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-role-student" data-testid="text-semester-total">
                      {semesterTotal}%
                    </p>
                    <p className="text-sm text-muted-foreground">Semester Total</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Subject-wise Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#10b981" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Semester Progress Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Semester Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={semesterProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Heatmap Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {/* Mock calendar heatmap */}
                {Array.from({ length: 31 }, (_, i) => {
                  const attendance = Math.random();
                  let bgColor = "bg-gray-100";
                  if (attendance > 0.8) bgColor = "bg-green-500";
                  else if (attendance > 0.5) bgColor = "bg-yellow-500";
                  else if (attendance > 0.2) bgColor = "bg-red-500";
                  
                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded ${bgColor} flex items-center justify-center text-xs text-white`}
                      data-testid={`calendar-day-${i + 1}`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center space-x-4 mt-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Present</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Late</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Absent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tip Card and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900" data-testid="text-tip-title">
                    Attendance Tip
                  </h3>
                  <p className="text-blue-700 mt-1" data-testid="text-tip-content">
                    Attend 3 more classes to reach 75% attendance requirement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => console.log('Request leave clicked')}
                  data-testid="button-request-leave"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Request Leave (Upload Proof)
                </Button>
                <Button 
                  className="w-full"
                  onClick={() => console.log('Export report clicked')}
                  data-testid="button-export-report"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Self-Report (CSV/PDF)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error States Placeholder */}
        <Card className="mt-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-yellow-800 font-medium" data-testid="text-error-message">
                  Attendance not yet synced for today
                </p>
                <p className="text-yellow-700 text-sm">
                  Data will be updated once faculty marks attendance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}