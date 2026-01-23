// components/common/SessionExpiryWarning.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { SessionManager } from '@/utils/sessionManager';

export const SessionExpiryWarning: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    const sessionManager = SessionManager.getInstance();
    
    // Show warning 5 minutes before session expires
    const warningInterval = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity) {
        const timeSinceActivity = Date.now() - parseInt(lastActivity);
        const timeUntilExpiry = (30 * 60 * 1000) - timeSinceActivity;
        
        if (timeUntilExpiry <= 5 * 60 * 1000 && timeUntilExpiry > 0) {
          setShowWarning(true);
          setTimeLeft(Math.floor(timeUntilExpiry / 1000));
        } else {
          setShowWarning(false);
        }
      }
    }, 1000);

    return () => clearInterval(warningInterval);
  }, []);

  const extendSession = async () => {
    try {
      // Make an API call to extend session
      await fetch('http://localhost:8080/api/auth/ping', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h3 className="text-lg font-semibold mb-2">Session About to Expire</h3>
        <p className="text-gray-600 mb-4">
          Your session will expire in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}. 
          Please extend your session to continue.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowWarning(false)}>
            Dismiss
          </Button>
          <Button onClick={extendSession}>
            Extend Session
          </Button>
        </div>
      </div>
    </div>
  );
};