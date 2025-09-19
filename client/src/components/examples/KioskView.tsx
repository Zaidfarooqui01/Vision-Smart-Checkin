import KioskView from '../KioskView';

export default function KioskViewExample() {
  return (
    <KioskView 
      onBack={() => console.log('Back to role selection')} 
    />
  );
}