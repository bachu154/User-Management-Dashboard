import { describe, it, expect } from 'vitest';
import { 
  validateRequired, 
  validateEmail, 
  validatePhone, 
  validateName,
  validateDepartment,
  validateEmployeeForm, 
  isFormValid,
  getFirstErrorMessage
} from '../utils/validation';

describe('Comprehensive Validation Utils Tests', () => {
  describe('validateRequired', () => {
    it('should return valid for non-empty strings', () => {
      const result = validateRequired('John Doe', 'Name');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    it('should return invalid for empty strings', () => {
      const result = validateRequired('', 'Name');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Name is required');
    });

    it('should return invalid for whitespace-only strings', () => {
      const result = validateRequired('   ', 'Email');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Email is required');
    });

    it('should handle null and undefined values', () => {
      const result1 = validateRequired(null as any, 'Field');
      const result2 = validateRequired(undefined as any, 'Field');
      
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should return valid for proper email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'firstname.lastname@company.com'
      ];

      validEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.message).toBe('');
      });
    });

    it('should return invalid for malformed emails', () => {
      const invalidEmails = [
        'testexample.com',
        'test@',
        '@example.com',
        'test..test@example.com',
        'test@example',
        'test @example.com'
      ];

      invalidEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Please enter a valid email address (e.g., name@example.com)');
      });
    });

    it('should return invalid for empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Email is required');
    });
  });

  describe('validatePhone', () => {
    it('should return valid for various phone number formats', () => {
      const validPhones = [
        '1-770-736-8031',
        '1 770 736 8031',
        '(770) 736-8031',
        '+1-770-736-8031',
        '17707368031',
        '1.770.736.8031'
      ];

      validPhones.forEach(phone => {
        const result = validatePhone(phone);
        expect(result.isValid).toBe(true);
        expect(result.message).toBe('');
      });
    });

    it('should return invalid for short phone numbers', () => {
      const result = validatePhone('123456789'); // Only 9 digits
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Phone number must contain at least 10 digits');
    });

    it('should return invalid for phone numbers with invalid characters', () => {
      const result = validatePhone('123-456-abcd');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Please enter a valid phone number');
    });

    it('should return invalid for empty phone', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Phone number is required');
    });
  });

  describe('validateName', () => {
    it('should return valid for proper names', () => {
      const validNames = [
        'John Doe',
        'Mary-Jane Smith',
        "O'Connor",
        'Jean-Luc Picard',
        'Dr. Smith'
      ];

      validNames.forEach(name => {
        const result = validateName(name);
        expect(result.isValid).toBe(true);
        expect(result.message).toBe('');
      });
    });

    it('should return invalid for names that are too short', () => {
      const result = validateName('A');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Name must be at least 2 characters long');
    });

    it('should return invalid for names with invalid characters', () => {
      const result = validateName('John123');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('should return invalid for empty name', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Name is required');
    });
  });

  describe('validateDepartment', () => {
    it('should return valid for valid departments', () => {
      const validDepartments = [
        'Engineering',
        'Marketing',
        'Sales',
        'Human Resources',
        'Finance'
      ];

      validDepartments.forEach(dept => {
        const result = validateDepartment(dept);
        expect(result.isValid).toBe(true);
        expect(result.message).toBe('');
      });
    });

    it('should return invalid for invalid departments', () => {
      const result = validateDepartment('InvalidDepartment');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Please select a valid department');
    });

    it('should return invalid for empty department', () => {
      const result = validateDepartment('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Department is required');
    });
  });

  describe('validateEmployeeForm', () => {
    it('should validate all fields correctly for valid form', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1-770-736-8031',
        department: 'Engineering'
      };

      const errors = validateEmployeeForm(formData);
      
      expect(errors.name.isValid).toBe(true);
      expect(errors.email.isValid).toBe(true);
      expect(errors.phone.isValid).toBe(true);
      expect(errors.department.isValid).toBe(true);
    });

    it('should return errors for invalid form data', () => {
      const formData = {
        name: 'A', // Too short
        email: 'invalid-email',
        phone: '123', // Too short
        department: 'InvalidDept'
      };

      const errors = validateEmployeeForm(formData);
      
      expect(errors.name.isValid).toBe(false);
      expect(errors.email.isValid).toBe(false);
      expect(errors.phone.isValid).toBe(false);
      expect(errors.department.isValid).toBe(false);
    });

    it('should handle missing fields', () => {
      const formData = {};

      const errors = validateEmployeeForm(formData);
      
      expect(errors.name.isValid).toBe(false);
      expect(errors.email.isValid).toBe(false);
      expect(errors.phone.isValid).toBe(false);
      expect(errors.department.isValid).toBe(false);
    });
  });

  describe('isFormValid', () => {
    it('should return true when all validations pass', () => {
      const errors = {
        name: { isValid: true, message: '' },
        email: { isValid: true, message: '' },
        phone: { isValid: true, message: '' },
        department: { isValid: true, message: '' }
      };

      expect(isFormValid(errors)).toBe(true);
    });

    it('should return false when any validation fails', () => {
      const errors = {
        name: { isValid: true, message: '' },
        email: { isValid: false, message: 'Invalid email' },
        phone: { isValid: true, message: '' },
        department: { isValid: true, message: '' }
      };

      expect(isFormValid(errors)).toBe(false);
    });

    it('should return false when multiple validations fail', () => {
      const errors = {
        name: { isValid: false, message: 'Name required' },
        email: { isValid: false, message: 'Invalid email' },
        phone: { isValid: true, message: '' },
        department: { isValid: true, message: '' }
      };

      expect(isFormValid(errors)).toBe(false);
    });
  });

  describe('getFirstErrorMessage', () => {
    it('should return first error message', () => {
      const errors = {
        name: { isValid: false, message: 'Name is required' },
        email: { isValid: false, message: 'Invalid email' },
        phone: { isValid: true, message: '' },
        department: { isValid: true, message: '' }
      };

      const firstError = getFirstErrorMessage(errors);
      expect(firstError).toBe('Name is required');
    });

    it('should return empty string when no errors', () => {
      const errors = {
        name: { isValid: true, message: '' },
        email: { isValid: true, message: '' },
        phone: { isValid: true, message: '' },
        department: { isValid: true, message: '' }
      };

      const firstError = getFirstErrorMessage(errors);
      expect(firstError).toBe('');
    });
  });
});