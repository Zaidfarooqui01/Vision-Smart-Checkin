import FacultyView from '../FacultyView';

export default function FacultyViewExample() {
  return (
    <FacultyView 
      onBack={() => console.log('Back to role selection')} 
    />
  );
}