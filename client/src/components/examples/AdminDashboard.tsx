import AdminDashboard from '../AdminDashboard';

export default function AdminDashboardExample() {
  return (
    <AdminDashboard 
      onBack={() => console.log('Back to role selection')} 
    />
  );
}