/**
 * Comprehensive validation utilities for employee form fields
 * Implements all required validation rules per assignment specifications
 */

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validate required field - ensures non-empty values
 */
export const validateRequired = (value: string, fieldName: string = 'This field'): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  const isValid = trimmedValue.length > 0;
  
  return {
    isValid,
    message: isValid ? '' : `${fieldName} is required`
  };
};

/**
 * Validate email format using comprehensive regex
 * Supports most common email formats
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!email?.trim()) {
    return { isValid: false, message: 'Email is required' };
  }
  
  const isValid = emailRegex.test(email.trim());
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid email address (e.g., name@example.com)'
  };
};

/**
 * Validate phone number format
 * Accepts various international formats
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone?.trim()) {
    return { isValid: false, message: 'Phone number is required' };
  }

  // Remove all non-digit characters for length check
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Must have at least 10 digits
  if (digitsOnly.length < 10) {
    return { isValid: false, message: 'Phone number must contain at least 10 digits' };
  }

  // Allow common phone number formats
  const phoneRegex = /^[\+]?[\d\s\-\(\)\.\+]+$/;
  const isValid = phoneRegex.test(phone.trim());
  
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid phone number'
  };
};

/**
 * Validate name field with specific requirements
 */
export const validateName = (name: string): ValidationResult => {
  if (!name?.trim()) {
    return { isValid: false, message: 'Name is required' };
  }

  const trimmedName = name.trim();
  
  // Must be at least 2 characters
  if (trimmedName.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }

  // Should contain only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  const isValid = nameRegex.test(trimmedName);
  
  return {
    isValid,
    message: isValid ? '' : 'Name can only contain letters, spaces, hyphens, and apostrophes'
  };
};

/**
 * Validate department selection
 */
export const validateDepartment = (department: string): ValidationResult => {
  if (!department?.trim()) {
    return { isValid: false, message: 'Department is required' };
  }

  const validDepartments = [
    'Engineering', 'Marketing', 'Sales', 'Human Resources', 
    'Finance', 'Operations', 'Customer Support', 'IT', 'Legal'
  ];
  
  const isValid = validDepartments.includes(department);
  
  return {
    isValid,
    message: isValid ? '' : 'Please select a valid department'
  };
};

/**
 * Validate entire employee form with comprehensive checks
 */
export const validateEmployeeForm = (formData: { [key: string]: string }): { [key: string]: ValidationResult } => {
  const errors: { [key: string]: ValidationResult } = {};
  
  // Validate each field with specific rules
  errors.name = validateName(formData.name || '');
  errors.email = validateEmail(formData.email || '');
  errors.phone = validatePhone(formData.phone || '');
  errors.department = validateDepartment(formData.department || '');
  
  return errors;
};

/**
 * Check if entire form is valid
 */
export const isFormValid = (errors: { [key: string]: ValidationResult }): boolean => {
  return Object.values(errors).every(error => error.isValid);
};

/**
 * Get first error message from validation results
 */
export const getFirstErrorMessage = (errors: { [key: string]: ValidationResult }): string => {
  const firstError = Object.values(errors).find(error => !error.isValid);
  return firstError?.message || '';
};