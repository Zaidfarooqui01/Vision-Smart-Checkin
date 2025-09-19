import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserCheck, Users, Shield, Monitor } from "lucide-react";

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
}

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const roles = [
    {
      id: "student",
      title: "Student",
      icon: UserCheck,
      description: "View your attendance status and analytics",
      color: "role-student",
    },
    {
      id: "faculty", 
      title: "Faculty",
      icon: Users,
      description: "Manage sessions and track student attendance",
      color: "role-faculty",
    },
    {
      id: "admin",
      title: "Admin", 
      icon: Shield,
      description: "System administration and comprehensive analytics",
      color: "role-admin",
    },
    {
      id: "kiosk",
      title: "Kiosk",
      icon: Monitor,
      description: "Live attendance marking interface",
      color: "role-kiosk",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            VISION
          </h1>
          <p className="text-xl text-muted-foreground">
            Smart Attendance & Analytics System
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card 
                key={role.id}
                className="p-6 hover-elevate cursor-pointer transition-all duration-200"
                onClick={() => onRoleSelect(role.id)}
                data-testid={`button-role-${role.id}`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-lg bg-${role.color}/10`}>
                    <Icon className={`h-8 w-8 text-${role.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {role.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: `hsl(var(--${role.color}))`, color: 'white' }}
                    data-testid={`button-select-${role.id}`}
                  >
                    Enter as {role.title}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}