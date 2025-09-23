/**
 * Employee interface representing the structure of employee data
 * Compatible with JSONPlaceholder user API and assignment requirements
 */
export interface Employee {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

/**
 * Employee form data interface for create/update operations
 */
export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
}

/**
 * Sort configuration interface with proper typing
 */
export interface SortConfig {
  key: 'id' | 'name' | 'email' | 'phone' | 'department';
  direction: 'asc' | 'desc';
}

/**
 * API error interface for comprehensive error handling
 */
export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Pagination configuration interface
 */
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}