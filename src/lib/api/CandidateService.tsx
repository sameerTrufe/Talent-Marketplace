// src/lib/api/CandidateService.tsx
import apiClient from './apiClient';

// Define TypeScript interfaces for better type safety
export interface Technology {
  id?: number;
  techName: string;
  proficiency?: string;
  skillType?: string;
  yearsOfExperience?: number;
  lastUsedYear?: number;
}

export interface Certification {
  id?: number;
  certName: string;
  issuer: string;
  yearObtained: number;
}

export interface Education {
  id?: number;
  degree: string;
  college: string;
  university: string;
  yearOfPassing: number;
}

export interface WorkExperience {
  id?: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  isCurrent: boolean;
  projectTitle?: string;
  projectRole?: string;
  clientName?: string;
  teamSize?: number;
  technologiesUsed?: string;
  keyAchievements?: string;
  noticePeriodServedDays?: number;
  rehireEligibility: boolean;
}

export interface AwardAchievement {
  id?: number;
  awardName: string;
  awardType: string;
  issuingOrganization: string;
  issueDate: string;
  description: string;
}

export interface CandidateProfile {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  title: string;
  location: string;
  summary?: string;
  city: string;
  country: string;
  region?: string;
  totalExperienceYears: number;
  domainExperience?: string;
  college?: string;
  university?: string;
  profileCompletion?: number;
  status?: string;
  
  // Arrays for related entities
  technologies: Technology[];
  certifications: Certification[];
  educations: Education[];
  workExperiences: WorkExperience[];
  awardsAchievements: AwardAchievement[];
  
  // Availability fields
  availabilityStatus?: string;
  noticePeriodDays?: number;
  earliestStartDate?: string;
  currentCompany?: string;
  currentCompanyTenureMonths?: number;
  lastCompanyTenureMonths?: number;
  isWillingToBuyoutNotice?: boolean;
}

export interface DashboardStats {
  totalApplications: number;
  pending: number;
  shortlisted: number;
  interviews: number;
  rejected?: number;
  accepted?: number;
  profileViews?: number;
  profileCompletion?: number;
}

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  appliedDate: string;
  matchScore: number;
  location: string;
  salary: string;
  jobType: string;
}

export interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  date: string;
  time: string;
  type: string;
  interviewer: string;
  status: string;
}

export interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  jobType: string;
}

// Helper functions - moved outside the object
const getFallbackProfile = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    console.log('CandidateService: Using fallback data from localStorage user:', user);
    return {
      name: user.fullName || user.username || 'Candidate',
      email: user.email,
      title: 'Software Developer',
      location: 'Remote',
      profileCompletion: 60,
      skills: ['JavaScript', 'React', 'Node.js'],
      status: 'Active'
    };
  }
  
  console.log('CandidateService: No user in localStorage, returning empty profile');
  return {
    name: '',
    email: '',
    title: '',
    location: '',
    profileCompletion: 0,
    skills: [],
    status: 'Inactive'
  };
};

const getFallbackStructuredProfile = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return {
      name: user.fullName || user.username || 'Candidate',
      email: user.email,
      phone: '',
      title: 'Software Developer',
      location: 'Remote',
      summary: '',
      city: '',
      country: '',
      region: '',
      totalExperienceYears: 0,
      domainExperience: 'Software Development',
      college: '',
      university: '',
      technologies: [
        { techName: 'JavaScript', skillType: 'PRIMARY', yearsOfExperience: 3 },
        { techName: 'React', skillType: 'PRIMARY', yearsOfExperience: 2 },
        { techName: 'Node.js', skillType: 'SECONDARY', yearsOfExperience: 2 }
      ],
      certifications: [],
      educations: [],
      workExperiences: [],
      awardsAchievements: [],
      availabilityStatus: 'IMMEDIATE',
      noticePeriodDays: 30,
      earliestStartDate: '',
      currentCompany: '',
      currentCompanyTenureMonths: 0,
      lastCompanyTenureMonths: 0,
      isWillingToBuyoutNotice: false
    };
  }
  
  return {
    name: '',
    email: '',
    phone: '',
    title: '',
    location: '',
    summary: '',
    city: '',
    country: '',
    region: '',
    totalExperienceYears: 0,
    domainExperience: '',
    college: '',
    university: '',
    technologies: [],
    certifications: [],
    educations: [],
    workExperiences: [],
    awardsAchievements: [],
    availabilityStatus: '',
    noticePeriodDays: 30,
    earliestStartDate: '',
    currentCompany: '',
    currentCompanyTenureMonths: 0,
    lastCompanyTenureMonths: 0,
    isWillingToBuyoutNotice: false
  };
};

export const CandidateService = {
  // Profile endpoints
  // For dashboard - returns basic info
  getCandidateProfile: async () => {
    try {
      console.log('CandidateService: Fetching candidate profile...');
      const response = await apiClient.get('/api/candidate/me/profile');
      console.log('CandidateService: Profile response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('CandidateService: Error fetching candidate profile:', error);
      // Return fallback data
      return getFallbackProfile();
    }
  },

  // Get candidate profile for edit (with all relations)
  getCandidateProfileForEdit: async () => {
    try {
      console.log('CandidateService: Fetching candidate profile for edit...');
      const response = await apiClient.get('/api/candidate/me/profile/edit');
      console.log('CandidateService: Edit profile response:', {
        data: response.data,
        hasTechnologies: response.data.technologies?.length > 0,
        hasWorkExperiences: response.data.workExperiences?.length > 0,
        currentCompany: response.data.currentCompany
      });
      return response.data;
    } catch (error: any) {
      console.error('CandidateService: Error fetching candidate profile for edit:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      
      // Return fallback structured data
      return getFallbackStructuredProfile();
    }
  },

  updateCandidateProfile: async (profileData: any) => {
    try {
      console.log('CandidateService: Updating candidate profile:', {
        name: profileData.name,
        technologiesCount: profileData.technologies?.length,
        workExperiencesCount: profileData.workExperiences?.length,
        currentCompany: profileData.currentCompany,
        currentCompanyTenureMonths: profileData.currentCompanyTenureMonths,
        lastCompanyTenureMonths: profileData.lastCompanyTenureMonths,
        noticePeriodDays: profileData.noticePeriodDays,
        hasCurrentExperience: profileData.workExperiences?.some((exp: any) => exp.isCurrent)
      });
      
      // Validate work experiences - ensure only one is current
      const currentWorkExperiences = profileData.workExperiences?.filter((exp: any) => exp.isCurrent) || [];
      if (currentWorkExperiences.length > 1) {
        console.warn('Multiple current work experiences detected, fixing...');
        // Keep only the first one as current
        profileData.workExperiences = profileData.workExperiences.map((exp: any, index: number) => ({
          ...exp,
          isCurrent: index === profileData.workExperiences.findIndex((e: any) => e.isCurrent)
        }));
      }
      
      const response = await apiClient.put('/api/candidate/me/profile', profileData);
      console.log('CandidateService: Profile update successful:', {
        status: response.status,
        data: response.data
      });
      return response.data;
    } catch (error: any) {
      console.error('CandidateService: Error updating candidate profile:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      throw error;
    }
  },

  // Helper methods for location parsing
  extractCity: (location: string): string => {
    if (!location) return '';
    const parts = location.split(',').map(p => p.trim());
    return parts[0] || '';
  },

  extractCountry: (location: string): string => {
    if (!location) return '';
    const parts = location.split(',').map(p => p.trim());
    return parts[parts.length - 1] || '';
  },

  // Calculate tenure in months
  calculateTenureMonths: (startDate: string, endDate: string | null): number => {
    if (!startDate) return 0;
    
    try {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date();
      
      if (isNaN(start.getTime())) return 0;
      if (endDate && isNaN(end.getTime())) return 0;
      
      const yearsDiff = end.getFullYear() - start.getFullYear();
      const monthsDiff = end.getMonth() - start.getMonth();
      
      return Math.max(0, (yearsDiff * 12) + monthsDiff);
    } catch (error) {
      console.error('Error calculating tenure:', error);
      return 0;
    }
  },

  // Dashboard endpoints
  getApplicationStats: async (): Promise<DashboardStats> => {
    try {
      console.log('CandidateService: Fetching application stats...');
      const response = await apiClient.get('/api/candidate/me/dashboard/stats');
      console.log('CandidateService: Stats response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('CandidateService: Error fetching application stats:', error);
      
      // Return mock data if backend not ready
      console.log('CandidateService: Using mock stats data');
      return {
        totalApplications: 12,
        pending: 3,
        shortlisted: 5,
        interviews: 2,
        rejected: 1,
        accepted: 1,
        profileViews: 156,
        profileCompletion: 85
      };
    }
  },

  getRecentApplications: async (): Promise<Application[]> => {
    try {
      console.log('CandidateService: Fetching recent applications...');
      const response = await apiClient.get('/api/candidate/me/applications/recent');
      console.log('CandidateService: Recent applications response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('CandidateService: Error fetching recent applications:', error);
      
      // Return mock data if backend not ready
      console.log('CandidateService: Using mock recent applications');
      return [
        {
          id: '1',
          jobTitle: 'Senior Appian Developer',
          company: 'TechCorp Inc',
          status: 'shortlisted',
          appliedDate: '2024-01-15',
          matchScore: 92,
          location: 'Remote',
          salary: '$120k - $140k',
          jobType: 'Full-time'
        },
        {
          id: '2',
          jobTitle: 'OutSystems Expert',
          company: 'Global Solutions',
          status: 'reviewing',
          appliedDate: '2024-01-10',
          matchScore: 85,
          location: 'New York, NY',
          salary: '$130k - $150k',
          jobType: 'Contract'
        }
      ];
    }
  },

  getAllApplications: async (): Promise<Application[]> => {
    try {
      console.log('CandidateService: Fetching all applications...');
      const response = await apiClient.get('/api/candidate/me/applications');
      console.log('CandidateService: All applications response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('CandidateService: Error fetching all applications:', error);
      
      // Return mock data if backend not ready
      console.log('CandidateService: Using mock all applications');
      const mockData: Application[] = [];
      for (let i = 1; i <= 8; i++) {
        const statuses: Array<'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'> = 
          ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'];
        mockData.push({
          id: String(i),
          jobTitle: `Job Title ${i}`,
          company: `Company ${i}`,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          appliedDate: `2024-01-${String(i).padStart(2, '0')}`,
          matchScore: 60 + (i * 5),
          location: i % 2 === 0 ? 'Remote' : 'Office',
          salary: `$${100 + i * 5}k - $${120 + i * 5}k`,
          jobType: i % 3 === 0 ? 'Contract' : 'Full-time'
        });
      }
      return mockData;
    }
  },

  getUpcomingInterviews: async (): Promise<Interview[]> => {
    try {
      console.log('CandidateService: Fetching upcoming interviews...');
      const response = await apiClient.get('/api/candidate/me/interviews/upcoming');
      console.log('CandidateService: Upcoming interviews response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('CandidateService: Error fetching upcoming interviews:', error);
      
      // Return mock data if backend not ready
      console.log('CandidateService: Using mock interviews data');
      return [
        {
          id: '1',
          jobTitle: 'Senior Appian Developer',
          company: 'TechCorp Inc',
          date: '2024-01-25',
          time: '10:00 AM',
          type: 'Technical Round',
          interviewer: 'Jane Smith',
          status: 'scheduled'
        },
        {
          id: '2',
          jobTitle: 'OutSystems Expert',
          company: 'Global Solutions',
          date: '2024-01-28',
          time: '2:00 PM',
          type: 'HR Round',
          interviewer: 'John Doe',
          status: 'scheduled'
        }
      ];
    }
  },

  // Get recommended jobs
  getRecommendedJobs: async (): Promise<RecommendedJob[]> => {
    try {
      console.log('CandidateService: Fetching recommended jobs...');
      const response = await apiClient.get('/api/candidate/jobs/recommended');
      console.log('CandidateService: Recommended jobs response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('CandidateService: Error fetching recommended jobs:', error);
      
      // Return mock data if backend not ready
      console.log('CandidateService: Using mock recommended jobs');
      const mockJobs: RecommendedJob[] = [];
      for (let i = 1; i <= 6; i++) {
        mockJobs.push({
          id: String(i + 100),
          title: `Recommended Job ${i}`,
          company: `Company ${i}`,
          location: i % 2 === 0 ? 'Remote' : 'New York, NY',
          salary: `$${110 + i * 5}k - $${130 + i * 5}k`,
          matchScore: 70 + (i * 5),
          jobType: i % 3 === 0 ? 'Contract' : 'Full-time'
        });
      }
      return mockJobs;
    }
  },

  // Application management
  applyToJob: async (jobId: string): Promise<any> => {
    try {
      console.log('CandidateService: Applying to job:', jobId);
      const response = await apiClient.post('/api/candidate/me/applications', { jobId });
      console.log('CandidateService: Application successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('CandidateService: Error applying to job:', error);
      throw error;
    }
  },

  withdrawApplication: async (applicationId: string): Promise<any> => {
    try {
      console.log('CandidateService: Withdrawing application:', applicationId);
      const response = await apiClient.delete(`/api/candidate/me/applications/${applicationId}`);
      console.log('CandidateService: Application withdrawn:', response.data);
      return response.data;
    } catch (error) {
      console.error('CandidateService: Error withdrawing application:', error);
      throw error;
    }
  },

  // Advanced search functionality
  searchCandidates: async (params: any): Promise<any> => {
    try {
      console.log('CandidateService: Searching candidates with params:', params);
      const response = await apiClient.get('/api/candidates/search', { params });
      console.log('CandidateService: Search results:', response.data);
      return response.data;
    } catch (error) {
      console.error('CandidateService: Error searching candidates:', error);
      throw error;
    }
  },

  // Get candidate by ID (for public view)
  getCandidateById: async (id: number): Promise<CandidateProfile> => {
    try {
      console.log('CandidateService: Fetching candidate by ID:', id);
      const response = await apiClient.get(`/api/candidates/${id}`);
      console.log('CandidateService: Candidate data:', response.data);
      return response.data;
    } catch (error) {
      console.error('CandidateService: Error fetching candidate by ID:', error);
      throw error;
    }
  },

  // Upload resume
  uploadResume: async (file: File): Promise<any> => {
    try {
      console.log('CandidateService: Uploading resume...');
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await apiClient.post('/api/candidate/me/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('CandidateService: Resume upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('CandidateService: Error uploading resume:', error);
      throw error;
    }
  },

  // Update profile picture
  updateProfilePicture: async (file: File): Promise<any> => {
    try {
      console.log('CandidateService: Updating profile picture...');
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await apiClient.post('/api/candidate/me/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('CandidateService: Profile picture update successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('CandidateService: Error updating profile picture:', error);
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (): Promise<any> => {
    try {
      console.log('CandidateService: Deleting account...');
      const response = await apiClient.delete('/api/candidate/me/account');
      console.log('CandidateService: Account deletion successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('CandidateService: Error deleting account:', error);
      throw error;
    }
  }
};