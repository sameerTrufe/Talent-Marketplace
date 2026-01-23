import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'ADMIN' | 'HR_MANAGER' | 'CANDIDATE';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_VERIFICATION';
  mobileNumber?: string;
  lastLogin?: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'admin1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          userType: 'ADMIN',
          status: 'ACTIVE',
          mobileNumber: '+1234567890',
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          username: 'hrmanager1',
          email: 'hr@example.com',
          firstName: 'HR',
          lastName: 'Manager',
          userType: 'HR_MANAGER',
          status: 'ACTIVE',
          mobileNumber: '+1234567891',
          lastLogin: '2024-01-14T14:20:00Z',
          createdAt: '2024-01-02T00:00:00Z'
        },
        {
          id: 3,
          username: 'candidate1',
          email: 'candidate@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userType: 'CANDIDATE',
          status: 'PENDING_VERIFICATION',
          mobileNumber: '+1234567892',
          lastLogin: null,
          createdAt: '2024-01-03T00:00:00Z'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = userTypeFilter === 'ALL' || user.userType === userTypeFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleStatusChange = async (userId: number, status: 'ACTIVE' | 'INACTIVE') => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
      toast.success('User status updated');
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleResendVerification = async (userId: number) => {
    try {
      toast.success('Verification email sent');
    } catch (error) {
      toast.error('Failed to send verification email');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getUserTypeBadge = (type: string) => {
    const variants: Record<string, { bg: string; text: string; label: string }> = {
      ADMIN: { bg: 'bg-red-100', text: 'text-red-800', label: 'Admin' },
      HR_MANAGER: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'HR Manager' },
      CANDIDATE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Candidate' }
    };
    
    const { bg, text, label } = variants[type] || { bg: 'bg-gray-100', text: 'text-gray-800', label: type };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
      ACTIVE: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Active', 
        icon: <CheckCircle className="h-3 w-3 mr-1" /> 
      },
      INACTIVE: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800', 
        label: 'Inactive', 
        icon: <XCircle className="h-3 w-3 mr-1" /> 
      },
      PENDING_VERIFICATION: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Pending', 
        icon: <RefreshCw className="h-3 w-3 mr-1" /> 
      }
    };
    
    const { bg, text, label, icon } = variants[status] || { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800', 
      label: status, 
      icon: null 
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}>
        {icon}
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-gray-600">
          Manage all users, HR Managers, and candidates in the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold mt-1">{users.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">HR Managers</p>
              <p className="text-2xl font-bold mt-1">
                {users.filter(u => u.userType === 'HR_MANAGER').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Candidates</p>
              <p className="text-2xl font-bold mt-1">
                {users.filter(u => u.userType === 'CANDIDATE').length}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-full">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Verification</p>
              <p className="text-2xl font-bold mt-1">
                {users.filter(u => u.status === 'PENDING_VERIFICATION').length}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-full">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="border rounded-lg">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">All Users</h2>
              <p className="text-gray-500">
                View and manage user accounts
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Add HR Manager
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search users..."
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                className="border rounded-md px-3 py-2"
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="ADMIN">Admin</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="CANDIDATE">Candidate</option>
              </select>
              <select 
                className="border rounded-md px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING_VERIFICATION">Pending</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Contact</th>
                    <th className="text-left py-3 px-4">Last Login</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            @{user.username}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getUserTypeBadge(user.userType)}</td>
                      <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.mobileNumber && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3" />
                              {user.mobileNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {user.lastLogin ? (
                          new Date(user.lastLogin).toLocaleDateString()
                        ) : (
                          <span className="text-gray-500">Never</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;