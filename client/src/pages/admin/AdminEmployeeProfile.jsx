import { useParams } from 'react-router-dom';
import EmployeeProfileView from '@/components/EmployeeProfileView';

export default function AdminEmployeeProfile() {
  const { employeeId } = useParams();
  return <EmployeeProfileView employeeId={employeeId} isAdminView />;
}
