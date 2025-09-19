import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Settings, FileText, Upload, Download, AlertTriangle, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  // Mock KPI data
  const kpis = {
    automatedEntries: 87,
    avgMarkingTime: 2.3,
    proxyFailsCaught: 12,
    systemUptime: 99.8
  };

  // Mock department data
  const deptData = [
    { dept: 'CS', total: 450, present: 380, absent: 70 },
    { dept: 'EE', total: 320, present: 290, absent: 30 },
    { dept: 'ME', total: 280, present: 245, absent: 35 },
    { dept: 'CE', total: 200, present: 175, absent: 25 },
  ];

  // Mock cohort heatmap data (problem time slots)
  const cohortData = [
    { time: '8:00 AM', issues: 15 },
    { time: '9:00 AM', issues: 8 },
    { time: '10:00 AM', issues: 5 },
    { time: '11:00 AM', issues: 3 },
    { time: '12:00 PM', issues: 12 },
    { time: '1:00 PM', issues: 20 },
    { time: '2:00 PM', issues: 7 },
    { time: '3:00 PM', issues: 9 },
  ];

  const defaulterDistribution = [
    { range: '0-25%', count: 8, color: '#ef4444' },
    { range: '25-50%', count: 15, color: '#f59e0b' },
    { range: '50-75%', count: 32, color: '#eab308' },
    { range: '75-100%', count: 285, color: '#10b981' },
  ];

  // Mock headcount data
  const headcountData = [
    { building: 'Main Block', present: 234, capacity: 300 },
    { building: 'Lab Block', present: 156, capacity: 200 },
    { building: 'Library', present: 89, capacity: 150 },
    { building: 'Auditorium', present: 45, capacity: 500 },
  ];

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
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">System Administration & Analytics</p>
            </div>
          </div>
          <Badge className="bg-role-admin text-white" data-testid="badge-role">
            Admin View
          </Badge>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="headcount" data-testid="tab-headcount">Headcount</TabsTrigger>
            <TabsTrigger value="tools" data-testid="tab-tools">Tools</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-role-admin" data-testid="kpi-automated">
                        {kpis.automatedEntries}%
                      </p>
                      <p className="text-sm text-muted-foreground">Automated Entries</p>
                    </div>
                    <Activity className="h-8 w-8 text-role-admin" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-role-admin" data-testid="kpi-marking-time">
                        {kpis.avgMarkingTime}s
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Marking Time</p>
                    </div>
                    <Activity className="h-8 w-8 text-role-admin" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-red-600" data-testid="kpi-proxy-fails">
                        {kpis.proxyFailsCaught}
                      </p>
                      <p className="text-sm text-muted-foreground">Proxy Fails Caught</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600" data-testid="kpi-uptime">
                        {kpis.systemUptime}%
                      </p>
                      <p className="text-sm text-muted-foreground">System Uptime</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department-wise Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department-wise Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={deptData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dept" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="present" fill="#10b981" name="Present" />
                      <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Problem Time Slots</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cohortData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="issues" fill="#f59e0b" name="Issues Reported" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Defaulter Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Student Attendance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={defaulterDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        label={({ range, count }) => `${range}: ${count}`}
                      >
                        {defaulterDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-red-800 font-medium" data-testid="text-alert-title">
                        Sync Error Detected
                      </p>
                      <p className="text-red-700 text-sm">
                        3 classes failed to sync attendance data - Manual intervention required
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-resolve-alert">
                    Resolve
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="headcount" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {headcountData.map((building, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg" data-testid={`building-name-${index}`}>
                        {building.building}
                      </h3>
                      <p className="text-3xl font-bold text-role-admin mt-2" data-testid={`building-count-${index}`}>
                        {building.present}
                      </p>
                      <p className="text-muted-foreground">
                        / {building.capacity} capacity
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div 
                          className="bg-role-admin h-2 rounded-full"
                          style={{ width: `${(building.present / building.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            {/* Audit Log Viewer */}
            <Card>
              <CardHeader>
                <CardTitle>Audit Log Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Session Started - CS101 Section A</p>
                      <p className="text-sm text-muted-foreground">By Prof. Smith at 09:00 AM</p>
                    </div>
                    <Badge variant="outline">INFO</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Proxy Detection Alert</p>
                      <p className="text-sm text-muted-foreground">Student ID: CS005 - Manual review required</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">ALERT</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Attendance Exported</p>
                      <p className="text-sm text-muted-foreground">Monthly report generated by Admin</p>
                    </div>
                    <Badge variant="outline">INFO</Badge>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  data-testid="button-view-full-log"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Log
                </Button>
              </CardContent>
            </Card>

            {/* Roster Management */}
            <Card>
              <CardHeader>
                <CardTitle>Roster Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    data-testid="button-import-roster"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Student Roster
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    data-testid="button-export-roster"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Attendance Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Liveness Detection Threshold</p>
                    <p className="text-sm text-muted-foreground">Sensitivity for face detection</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Low</span>
                    <Switch data-testid="switch-liveness-threshold" />
                    <span className="text-sm">High</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Late Arrival Cutoff</p>
                    <p className="text-sm text-muted-foreground">Minutes after class start</p>
                  </div>
                  <select className="border rounded p-2" data-testid="select-late-cutoff">
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Export Schedule</p>
                    <p className="text-sm text-muted-foreground">Automated report generation</p>
                  </div>
                  <select className="border rounded p-2" data-testid="select-export-schedule">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Alert administrators of issues</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-email-notifications" />
                </div>

                <Button 
                  className="w-full mt-6"
                  data-testid="button-save-settings"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}