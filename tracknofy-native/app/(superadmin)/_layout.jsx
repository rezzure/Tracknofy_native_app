import React from 'react';
import { AuthProvider } from '../../contexts/AuthContext';

export default function SuperAdminLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
