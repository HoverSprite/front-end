export const ROLES = {
    ADMIN: 'ADMIN',
    RECEPTIONIST: 'RECEPTIONIST',
    FARMER: 'FARMER',
    SPRAYER: 'SPRAYER',
  };
  
  export const hasRole = (user, role) => {
    return user && user.role === role;
  };
  
  export const hasAnyRole = (user, roles) => {
    return user && roles.includes(user.role);
  };