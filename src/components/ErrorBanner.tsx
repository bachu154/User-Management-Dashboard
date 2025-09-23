import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss: () => void;
  isRetrying?: boolean;
}

/**
 * Error banner component for displaying API errors with retry functionality
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({ 
  message, 
  onRetry, 
  onDismiss, 
  isRetrying = false 
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
        <p className="text-red-800 text-sm font-medium">{message}</p>
      </div>
      <div className="flex items-center ml-4">
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="text-red-600 hover:text-red-700 text-sm font-medium mr-3 px-3 py-1 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        )}
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-600 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};