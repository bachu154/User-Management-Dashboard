import React from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, Mail, Phone } from 'lucide-react';
import { Employee, SortConfig } from '../types/Employee';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  sortConfig: SortConfig | null;
  onSort: (key: SortConfig['key']) => void;
  loading?: boolean;
}

/**
 * Enhanced employee table component with comprehensive sorting and accessibility
 * Implements all required table functionality per assignment specifications
 */
export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onEdit,
  onDelete,
  sortConfig,
  onSort,
  loading = false,
}) => {
  /**
   * Generate appropriate sort icon based on current sort state
   */
  const getSortIcon = (column: SortConfig['key']) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  /**
   * Table column configuration with sorting capabilities
   */
  const columns = [
    { 
      key: 'id' as const, 
      label: 'ID', 
      sortable: true,
      className: 'w-16 text-center'
    },
    { 
      key: 'name' as const, 
      label: 'Name', 
      sortable: true,
      className: 'min-w-[200px]'
    },
    { 
      key: 'email' as const, 
      label: 'Email', 
      sortable: true,
      className: 'min-w-[250px]'
    },
    { 
      key: 'phone' as const, 
      label: 'Phone', 
      sortable: true,
      className: 'min-w-[150px]'
    },
    { 
      key: 'department' as const, 
      label: 'Department', 
      sortable: true,
      className: 'min-w-[120px]'
    },
  ];

  /**
   * Handle sort column click with proper event handling
   */
  const handleSort = (key: SortConfig['key']) => {
    if (loading) return;
    onSort(key);
  };

  /**
   * Handle delete with confirmation
   */
  const handleDelete = (employee: Employee, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      onDelete(employee);
    }
  };

  /**
   * Handle edit action
   */
  const handleEdit = (employee: Employee, event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit(employee);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    column.className || ''
                  } ${
                    column.sortable 
                      ? 'cursor-pointer hover:bg-gray-100 select-none group transition-colors duration-150' 
                      : ''
                  }`}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                  role={column.sortable ? 'button' : undefined}
                  tabIndex={column.sortable ? 0 : undefined}
                  onKeyDown={column.sortable ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort(column.key);
                    }
                  } : undefined}
                  aria-sort={
                    sortConfig?.key === column.key 
                      ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                  }
                >
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="ml-2 flex-shrink-0">
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th scope="col" className="relative px-6 py-4 w-24">
                <span className="sr-only">Actions</span>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : employees.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="text-gray-500">
                    <div className="mx-auto w-24 h-24 mb-4 text-gray-300">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">No employees found</p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search criteria or add a new employee to get started.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Employee data rows
              employees.map((employee, index) => (
                <tr 
                  key={employee.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  {/* ID Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      {employee.id}
                    </span>
                  </td>

                  {/* Name Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{employee.username}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Email Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <a 
                        href={`mailto:${employee.email}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {employee.email}
                      </a>
                    </div>
                  </td>

                  {/* Phone Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <a 
                        href={`tel:${employee.phone}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {employee.phone}
                      </a>
                    </div>
                  </td>

                  {/* Department Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {employee.company.name}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={(e) => handleEdit(employee, e)}
                        className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label={`Edit ${employee.name}`}
                        title="Edit Employee"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(employee, e)}
                        className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label={`Delete ${employee.name}`}
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};