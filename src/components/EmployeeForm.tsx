import React, { useState, useEffect } from 'react';
import { X, Save, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Employee, EmployeeFormData } from '../types/Employee';
import { validateEmployeeForm, isFormValid, ValidationResult } from '../utils/validation';

interface EmployeeFormProps {
  employee?: Employee;
  onSave: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

/**
 * Comprehensive employee form component with real-time validation
 * Implements all required form validation per assignment specifications
 */
export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSave,
  onCancel,
  isLoading,
}) => {
  // Form state management
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    phone: '',
    department: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: ValidationResult }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Available departments for selection
  const departments = [
    'Engineering',
    'Marketing', 
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Support',
    'IT',
    'Legal'
  ];

  /**
   * Initialize form data when editing existing employee
   */
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.company.name,
      });
    }
  }, [employee]);

  /**
   * Real-time validation on form data changes
   */
  useEffect(() => {
    if (submitAttempted || Object.keys(touched).length > 0) {
      const newErrors = validateEmployeeForm(formData);
      setErrors(newErrors);
    }
  }, [formData, submitAttempted, touched]);

  /**
   * Handle input changes with immediate validation for touched fields
   */
  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched if it has content or was previously touched
    if (value.trim() || touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  };

  /**
   * Handle input blur events for validation
   */
  const handleInputBlur = (field: keyof EmployeeFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  /**
   * Handle form submission with comprehensive validation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    // Mark all fields as touched for validation display
    const allFields = Object.keys(formData) as (keyof EmployeeFormData)[];
    const allTouched = Object.fromEntries(allFields.map(field => [field, true]));
    setTouched(allTouched);
    
    // Validate entire form
    const newErrors = validateEmployeeForm(formData);
    setErrors(newErrors);
    
    // Only submit if form is valid
    if (isFormValid(newErrors)) {
      try {
        await onSave(formData);
        // Form will be closed by parent component on success
      } catch (error) {
        // Error handling is managed by parent component
        console.error('Form submission error:', error);
      }
    }
  };

  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    if (isLoading) return;
    onCancel();
  };

  /**
   * Check if submit button should be disabled
   */
  const isSubmitDisabled = isLoading || (submitAttempted && !isFormValid(errors));

  /**
   * Get field error message if field is touched and has error
   */
  const getFieldError = (field: keyof EmployeeFormData): string => {
    return (touched[field] || submitAttempted) && !errors[field]?.isValid 
      ? errors[field]?.message || '' 
      : '';
  };

  /**
   * Check if field has error for styling
   */
  const hasFieldError = (field: keyof EmployeeFormData): boolean => {
    return (touched[field] || submitAttempted) && !errors[field]?.isValid;
  };

  /**
   * Check if field is valid and touched for success styling
   */
  const isFieldValid = (field: keyof EmployeeFormData): boolean => {
    return (touched[field] || submitAttempted) && errors[field]?.isValid;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {employee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <p className="text-sm text-gray-600">
                {employee ? 'Update employee information' : 'Fill in the details below'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleInputBlur('name')}
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150 ${
                  hasFieldError('name')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
                    : isFieldValid('name')
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Enter full name (e.g., John Doe)"
                autoComplete="name"
              />
              {/* Field status icon */}
              {isFieldValid('name') && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {hasFieldError('name') && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {getFieldError('name') && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {getFieldError('name')}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleInputBlur('email')}
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150 ${
                  hasFieldError('email')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
                    : isFieldValid('email')
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Enter email address (e.g., john@example.com)"
                autoComplete="email"
              />
              {isFieldValid('email') && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {hasFieldError('email') && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {getFieldError('email') && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {getFieldError('email')}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleInputBlur('phone')}
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150 ${
                  hasFieldError('phone')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
                    : isFieldValid('phone')
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Enter phone number (e.g., +1-555-123-4567)"
                autoComplete="tel"
              />
              {isFieldValid('phone') && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {hasFieldError('phone') && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {getFieldError('phone') && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {getFieldError('phone')}
              </p>
            )}
          </div>

          {/* Department Field */}
          <div>
            <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                onBlur={() => handleInputBlur('department')}
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-150 ${
                  hasFieldError('department')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
                    : isFieldValid('department')
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {isFieldValid('department') && (
                <CheckCircle className="absolute right-8 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
              )}
              {hasFieldError('department') && (
                <AlertCircle className="absolute right-8 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
              )}
            </div>
            {getFieldError('department') && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {getFieldError('department')}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center font-medium shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {employee ? 'Update Employee' : 'Add Employee'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};