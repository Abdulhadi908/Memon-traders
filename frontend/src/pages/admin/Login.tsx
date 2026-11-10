import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Password system removed - Direct URL access granted
    navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-sm text-stone-400">Opening Admin Dashboard...</p>
      </div>
    </div>
  );
}
