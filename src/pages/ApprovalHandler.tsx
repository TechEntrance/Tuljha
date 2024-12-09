import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { db } from '../db';
import { CheckCircle, XCircle } from 'lucide-react';
import { decode } from '../utils/token';

function ApprovalHandler() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleApproval = async () => {
      try {
        if (!token) {
          throw new Error('Invalid token');
        }

        // Decode and parse the token
        const decodedData = decode(token);
        const { userId, email, timestamp } = JSON.parse(decodedData);

        // Check if token is expired (24 hours)
        const tokenAge = Date.now() - timestamp;
        if (tokenAge > 24 * 60 * 60 * 1000) {
          throw new Error('Approval link has expired');
        }

        const user = await db.users.where('email').equals(email).first();

        if (!user || user.id !== Number(userId)) {
          throw new Error('Invalid user');
        }

        const isApprove = window.location.pathname.includes('/approve/');
        
        await db.users.update(user.id!, {
          status: isApprove ? 'approved' : 'rejected'
        });

        toast.success(`User ${isApprove ? 'approved' : 'rejected'} successfully`);
        setTimeout(() => navigate('/login'), 2000);
      } catch (error) {
        console.error('Approval error:', error);
        setError(error instanceof Error ? error.message : 'Invalid or expired approval link');
      } finally {
        setProcessing(false);
      }
    };

    handleApproval();
  }, [token, navigate]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <XCircle className="h-16 w-16 text-red-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{error}</h2>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          User {window.location.pathname.includes('/approve/') ? 'approved' : 'rejected'} successfully
        </h2>
        <p className="text-gray-600 dark:text-gray-300">Redirecting to login page...</p>
      </div>
    </div>
  );
}

export default ApprovalHandler;