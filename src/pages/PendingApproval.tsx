import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <Clock className="h-16 w-16 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Pending Approval
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Your account is pending approval from the administrator. You'll receive an email once your account is approved.
        </p>
        <div className="mt-5">
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PendingApproval;