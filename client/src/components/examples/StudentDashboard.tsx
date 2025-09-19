import StudentDashboard from '../StudentDashboard';

export default function StudentDashboardExample() {
  return (
    <StudentDashboard 
      onBack={() => console.log('Back to role selection')} 
    />
  );
}