import { Employee, EmployeeFormData, ApiError } from '../types/Employee';

/**
 * API service class for handling JSONPlaceholder API requests
 * Implements all CRUD operations with proper error handling and retry mechanisms
 */
class ApiService {
  private baseUrl = 'https://jsonplaceholder.typicode.com';
  private retryAttempts = 3;
  private retryDelay = 1000;

  /**
   * Generic fetch wrapper with comprehensive error handling and retry logic
   */
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
          continue;
        }
      }
    }

    console.error(`API request failed after ${this.retryAttempts} attempts:`, lastError);
    throw {
      message: lastError.message || 'Network error occurred',
      status: 'status' in lastError ? (lastError as any).status : 500,
    } as ApiError;
  }

  /**
   * Utility method for implementing retry delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch all employees from JSONPlaceholder API
   * Maps company.name to department for consistency
   */
  async getEmployees(): Promise<Employee[]> {
    const employees = await this.request<Employee[]>('/users');
    
    // Ensure consistent data structure
    return employees.map(employee => ({
      ...employee,
      company: {
        ...employee.company,
        name: employee.company.name || 'General'
      }
    }));
  }

  /**
   * Create a new employee using JSONPlaceholder API
   * Simulates persistence with proper response handling
   */
  async createEmployee(employeeData: EmployeeFormData): Promise<Employee> {
    const newEmployee = {
      name: employeeData.name,
      username: employeeData.name.toLowerCase().replace(/\s+/g, '.'),
      email: employeeData.email,
      phone: employeeData.phone,
      website: 'example.com',
      address: {
        street: 'Main Street',
        suite: 'Suite 100',
        city: 'Anytown',
        zipcode: '12345-6789',
        geo: {
          lat: '0.0000',
          lng: '0.0000'
        }
      },
      company: {
        name: employeeData.department,
        catchPhrase: 'Innovative solutions for modern business',
        bs: 'synergistic value-added solutions'
      }
    };

    const response = await this.request<Employee>('/users', {
      method: 'POST',
      body: JSON.stringify(newEmployee),
    });

    // JSONPlaceholder returns id: 11 for new posts, simulate proper ID
    return {
      ...response,
      ...newEmployee,
      id: response.id || Date.now() // Fallback ID generation
    };
  }

  /**
   * Update an existing employee using JSONPlaceholder API
   * Handles partial updates and maintains data integrity
   */
  async updateEmployee(id: number, employeeData: EmployeeFormData): Promise<Employee> {
    const updatedEmployee = {
      id,
      name: employeeData.name,
      username: employeeData.name.toLowerCase().replace(/\s+/g, '.'),
      email: employeeData.email,
      phone: employeeData.phone,
      website: 'example.com',
      address: {
        street: 'Main Street',
        suite: 'Suite 100',
        city: 'Anytown',
        zipcode: '12345-6789',
        geo: {
          lat: '0.0000',
          lng: '0.0000'
        }
      },
      company: {
        name: employeeData.department,
        catchPhrase: 'Updated company information',
        bs: 'updated business solutions'
      }
    };

    return this.request<Employee>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedEmployee),
    });
  }

  /**
   * Delete an employee using JSONPlaceholder API
   * Returns success confirmation
   */
  async deleteEmployee(id: number): Promise<void> {
    await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get a single employee by ID
   * Used for detailed views and validation
   */
  async getEmployee(id: number): Promise<Employee> {
    return this.request<Employee>(`/users/${id}`);
  }
}

export const apiService = new ApiService();