// src/lib/api/CandidateService.tsx
import apiClient from './apiClient';

export const CandidateService = {
  // Profile endpoints
  getCandidateProfile: async () => {
    try {
      console.log('CandidateService: Fetching candidate profile...');
      const response = await apiClient.get('/api/candidate/me/profile');
      console.log('CandidateService: Profile response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('CandidateService: Error fetching candidate profile:', error);
      
      // Return fallback data if backend not ready
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
    }
  },

  updateCandidateProfile: async (profileData: any) => {
    try {
      console.log('CandidateService: Updating candidate profile:', profileData);
      const response = await apiClient.put('/api/candidate/me/profile', profileData);
      console.log('CandidateService: Profile update successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('CandidateService: Error updating candidate profile:', error);
      throw error;
    }
  },

  // Dashboard endpoints
  getApplicationStats: async () => {
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

  getRecentApplications: async () => {
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

  getAllApplications: async () => {
    try {
      console.log('CandidateService: Fetching all applications...');
      const response = await apiClient.get('/api/candidate/me/applications');
      console.log('CandidateService: All applications response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('CandidateService: Error fetching all applications:', error);
      
      // Return mock data if backend not ready
      console.log('CandidateService: Using mock all applications');
      const mockData = [];
      for (let i = 1; i <= 8; i++) {
        mockData.push({
          id: String(i),
          jobTitle: `Job Title ${i}`,
          company: `Company ${i}`,
          status: ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'][Math.floor(Math.random() * 5)],
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

  getUpcomingInterviews: async () => {
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
  getRecommendedJobs: async () => {
    try {
      console.log('CandidateService: Fetching recommended jobs...');
      const response = await apiClient.get('/api/candidate/jobs/recommended');
      console.log('CandidateService: Recommended jobs response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('CandidateService: Error fetching recommended jobs:', error);
      
      // Return mock data if backend not ready
      console.log('CandidateService: Using mock recommended jobs');
      const mockJobs = [];
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
  applyToJob: async (jobId: string) => {
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

  withdrawApplication: async (applicationId: string) => {
    try {
      console.log('CandidateService: Withdrawing application:', applicationId);
      const response = await apiClient.delete(`/api/candidate/me/applications/${applicationId}`);
      console.log('CandidateService: Application withdrawn:', response.data);
      return response.data;
    } catch (error) {
      console.error('CandidateService: Error withdrawing application:', error);
      throw error;
    }
  }
};