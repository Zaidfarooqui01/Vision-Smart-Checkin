import RoleSelection from '../RoleSelection';

export default function RoleSelectionExample() {
  return (
    <RoleSelection 
      onRoleSelect={(role) => console.log(`Selected role: ${role}`)} 
    />
  );
}