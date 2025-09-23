import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { apiService } from '../services/api';

// Mock the API service
vi.mock('../services/api', () => ({
  apiService: {
    getEmployees: vi.fn(),
    createEmployee: vi.fn(),
    updateEmployee: vi.fn(),
    deleteEmployee: vi.fn(),
  },
}));

const mockEmployees = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: { lat: '-37.3159', lng: '81.1496' }
    },
    company: {
      name: 'Engineering',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    phone: '010-692-6593 x09125',
    website: 'anastasia.net',
    address: {
      street: 'Victor Plains',
      suite: 'Suite 879',
      city: 'Wisokyburgh',
      zipcode: '90566-7771',
      geo: { lat: '-43.9509', lng: '-34.4618' }
    },
    company: {
      name: 'Marketing',
      catchPhrase: 'Proactive didactic contingency',
      bs: 'synergize scalable supply-chains'
    }
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'Nathan@yesenia.net',
    phone: '1-463-123-4447',
    website: 'ramiro.info',
    address: {
      street: 'Douglas Extension',
      suite: 'Suite 847',
      city: 'McKenziehaven',
      zipcode: '59590-4157',
      geo: { lat: '-68.6102', lng: '-47.0653' }
    },
    company: {
      name: 'Sales',
      catchPhrase: 'Face to face bifurcated interface',
      bs: 'e-enable strategic applications'
    }
  }
];

describe('Employee Directory App - Complete Functionality Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response by default
    vi.mocked(apiService.getEmployees).mockResolvedValue(mockEmployees);
  });

  describe('JSONPlaceholder API Integration', () => {
    it('should load employees from JSONPlaceholder API on mount', async () => {
      render(<App />);

      // Check that loading state is shown initially
      expect(screen.getByText(/Loading employees from JSONPlaceholder API/)).toBeInTheDocument();

      // Wait for employees to load
      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });

      // Verify API was called
      expect(apiService.getEmployees).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors with retry functionality', async () => {
      // Mock API error
      const apiError = { message: 'Failed to fetch from JSONPlaceholder API', status: 500 };
      vi.mocked(apiService.getEmployees).mockRejectedValue(apiError);

      render(<App />);

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch from JSONPlaceholder API/)).toBeInTheDocument();
      });

      // Check that retry button is present
      expect(screen.getByText('Retry')).toBeInTheDocument();

      // Test retry functionality
      vi.mocked(apiService.getEmployees).mockResolvedValue(mockEmployees);
      
      await user.click(screen.getByText('Retry'));
      
      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });
    });
  });

  describe('Advanced Sorting Functionality', () => {
    beforeEach(async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });
    });

    it('should sort employees by ID in ascending order', async () => {
      const idHeader = screen.getByText('ID');
      await user.click(idHeader);

      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1); // Skip header row
      
      // Should be sorted by ID ascending (1, 2, 3)
      expect(dataRows[0]).toHaveTextContent('1');
      expect(dataRows[1]).toHaveTextContent('2');
      expect(dataRows[2]).toHaveTextContent('3');
    });

    it('should sort employees by name with ascending/descending toggle', async () => {
      const nameHeader = screen.getByText('Name');
      
      // First click - ascending sort
      await user.click(nameHeader);
      
      let rows = screen.getAllByRole('row');
      let dataRows = rows.slice(1);
      
      // Should be sorted alphabetically: Clementine, Ervin, Leanne
      expect(dataRows[0]).toHaveTextContent('Clementine Bauch');
      expect(dataRows[1]).toHaveTextContent('Ervin Howell');
      expect(dataRows[2]).toHaveTextContent('Leanne Graham');

      // Second click - descending sort
      await user.click(nameHeader);
      
      rows = screen.getAllByRole('row');
      dataRows = rows.slice(1);
      
      // Should be sorted reverse alphabetically: Leanne, Ervin, Clementine
      expect(dataRows[0]).toHaveTextContent('Leanne Graham');
      expect(dataRows[1]).toHaveTextContent('Ervin Howell');
      expect(dataRows[2]).toHaveTextContent('Clementine Bauch');

      // Third click - remove sort (back to original order)
      await user.click(nameHeader);
      
      rows = screen.getAllByRole('row');
      dataRows = rows.slice(1);
      
      // Should be back to original order
      expect(dataRows[0]).toHaveTextContent('Leanne Graham');
      expect(dataRows[1]).toHaveTextContent('Ervin Howell');
      expect(dataRows[2]).toHaveTextContent('Clementine Bauch');
    });

    it('should sort employees by email', async () => {
      const emailHeader = screen.getByText('Email');
      await user.click(emailHeader);

      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1);
      
      // Should be sorted by email alphabetically
      expect(dataRows[0]).toHaveTextContent('Nathan@yesenia.net');
      expect(dataRows[1]).toHaveTextContent('Shanna@melissa.tv');
      expect(dataRows[2]).toHaveTextContent('Sincere@april.biz');
    });

    it('should sort employees by department', async () => {
      const departmentHeader = screen.getByText('Department');
      await user.click(departmentHeader);

      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1);
      
      // Should be sorted by department alphabetically: Engineering, Marketing, Sales
      expect(dataRows[0]).toHaveTextContent('Engineering');
      expect(dataRows[1]).toHaveTextContent('Marketing');
      expect(dataRows[2]).toHaveTextContent('Sales');
    });
  });

  describe('Pagination with Page Size Options', () => {
    beforeEach(async () => {
      // Create more employees to test pagination
      const manyEmployees = Array.from({ length: 25 }, (_, i) => ({
        ...mockEmployees[0],
        id: i + 1,
        name: `Employee ${i + 1}`,
        email: `employee${i + 1}@example.com`
      }));
      
      vi.mocked(apiService.getEmployees).mockResolvedValue(manyEmployees);
      
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText('Employee 1')).toBeInTheDocument();
      });
    });

    it('should display pagination controls with default page size of 10', async () => {
      // Should show pagination controls
      expect(screen.getByText('Showing 1 to 10 of 25 results')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
      
      // Should show page navigation
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should change page size to 25 and show all employees', async () => {
      const pageSizeSelect = screen.getByDisplayValue('10');
      await user.selectOptions(pageSizeSelect, '25');

      await waitFor(() => {
        expect(screen.getByText('Showing 1 to 25 of 25 results')).toBeInTheDocument();
      });

      // Should show all employees on one page
      expect(screen.getByText('Employee 1')).toBeInTheDocument();
      expect(screen.getByText('Employee 25')).toBeInTheDocument();
    });

    it('should navigate between pages', async () => {
      // Go to page 2
      const page2Button = screen.getByText('2');
      await user.click(page2Button);

      await waitFor(() => {
        expect(screen.getByText('Showing 11 to 20 of 25 results')).toBeInTheDocument();
      });

      // Should show employees 11-20
      expect(screen.getByText('Employee 11')).toBeInTheDocument();
      expect(screen.getByText('Employee 20')).toBeInTheDocument();
      expect(screen.queryByText('Employee 1')).not.toBeInTheDocument();
    });

    it('should have all required page size options (10, 25, 50, 100)', async () => {
      const pageSizeSelect = screen.getByDisplayValue('10');
      
      // Check all required options are present
      expect(screen.getByRole('option', { name: '10' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '25' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '50' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '100' })).toBeInTheDocument();
    });
  });

  describe('Comprehensive Form Validation', () => {
    beforeEach(async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });
    });

    it('should show validation errors for empty required fields', async () => {
      // Open add employee form
      await user.click(screen.getByText('Add Employee'));
      
      // Try to submit empty form
      const submitButton = screen.getByText('Add Employee');
      await user.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Phone number is required')).toBeInTheDocument();
        expect(screen.getByText('Department is required')).toBeInTheDocument();
      });

      // Submit button should be disabled
      expect(submitButton).toBeDisabled();
    });

    it('should validate email format', async () => {
      await user.click(screen.getByText('Add Employee'));
      
      const emailInput = screen.getByLabelText(/Email Address/);
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument();
      });
    });

    it('should validate phone number format', async () => {
      await user.click(screen.getByText('Add Employee'));
      
      const phoneInput = screen.getByLabelText(/Phone Number/);
      await user.type(phoneInput, '123'); // Too short
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/Phone number must contain at least 10 digits/)).toBeInTheDocument();
      });
    });

    it('should enable submit button when all fields are valid', async () => {
      vi.mocked(apiService.createEmployee).mockResolvedValue({
        ...mockEmployees[0],
        id: 4,
        name: 'John Doe',
        email: 'john@example.com'
      });

      await user.click(screen.getByText('Add Employee'));
      
      // Fill in valid data
      await user.type(screen.getByLabelText(/Full Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
      await user.type(screen.getByLabelText(/Phone Number/), '1-555-123-4567');
      await user.selectOptions(screen.getByLabelText(/Department/), 'Engineering');

      // Submit button should be enabled
      const submitButton = screen.getByText('Add Employee');
      expect(submitButton).not.toBeDisabled();

      // Should be able to submit
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(apiService.createEmployee).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1-555-123-4567',
          department: 'Engineering'
        });
      });
    });
  });

  describe('Search and Filter Functionality', () => {
    beforeEach(async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });
    });

    it('should filter employees by search term', async () => {
      const searchInput = screen.getByPlaceholderText(/Search employees/);
      await user.type(searchInput, 'Leanne');

      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
        expect(screen.queryByText('Ervin Howell')).not.toBeInTheDocument();
        expect(screen.queryByText('Clementine Bauch')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Showing 1 of 1 employees matching "Leanne"')).toBeInTheDocument();
    });

    it('should filter employees by department', async () => {
      const departmentFilter = screen.getByDisplayValue('All Departments');
      await user.selectOptions(departmentFilter, 'Engineering');

      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
        expect(screen.queryByText('Ervin Howell')).not.toBeInTheDocument();
        expect(screen.queryByText('Clementine Bauch')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Showing 1 of 1 employees in Engineering')).toBeInTheDocument();
    });

    it('should clear all filters when clicking Clear Filters', async () => {
      // Apply search filter
      const searchInput = screen.getByPlaceholderText(/Search employees/);
      await user.type(searchInput, 'Leanne');

      // Apply department filter
      const departmentFilter = screen.getByDisplayValue('All Departments');
      await user.selectOptions(departmentFilter, 'Engineering');

      // Clear filters button should appear
      const clearButton = screen.getByText('Clear Filters');
      await user.click(clearButton);

      // All employees should be visible again
      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
        expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
        expect(screen.getByText('Clementine Bauch')).toBeInTheDocument();
      });

      // Search input should be cleared
      expect(searchInput).toHaveValue('');
      expect(departmentFilter).toHaveValue('');
    });
  });

  describe('CRUD Operations', () => {
    beforeEach(async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });
    });

    it('should delete employee with confirmation', async () => {
      // Mock window.confirm
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      vi.mocked(apiService.deleteEmployee).mockResolvedValue();

      // Find and click delete button for first employee
      const deleteButtons = screen.getAllByLabelText(/Delete/);
      await user.click(deleteButtons[0]);

      // Should show confirmation dialog
      expect(confirmSpy).toHaveBeenCalledWith(
        expect.stringContaining('Are you sure you want to delete Leanne Graham?')
      );

      // Should call API and remove from UI
      await waitFor(() => {
        expect(apiService.deleteEmployee).toHaveBeenCalledWith(1);
        expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
      });

      confirmSpy.mockRestore();
    });

    it('should not delete employee if confirmation is cancelled', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const deleteButtons = screen.getAllByLabelText(/Delete/);
      await user.click(deleteButtons[0]);

      // Should not call API or remove from UI
      expect(apiService.deleteEmployee).not.toHaveBeenCalled();
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();

      confirmSpy.mockRestore();
    });
  });
});