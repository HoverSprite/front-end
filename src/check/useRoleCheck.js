import { useAuth } from './AuthContext';
import { hasRole, hasAnyRole } from './roleUtils';

export const useRoleCheck = () => {
  const { user } = useAuth();

  return {
    hasRole: (role) => hasRole(user, role),
    hasAnyRole: (roles) => hasAnyRole(user, roles),
  };
};