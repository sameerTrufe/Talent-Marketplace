import React, { useState, useEffect } from 'react';
// Change this to use the correct Sidebar component
import { Sidebar } from "../../Sidebar";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Progress } from '../../../components/ui/progress';
import { 
  Calendar, 
  Briefcase, 
  Award, 
  Bell, 
  FileText, 
  MessageSquare,
  User,
  Settings,
  Eye,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { CandidateService } from '@/lib/api/CandidateService';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SessionManager } from '@/utils/sessionManager';

const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    shortlisted: 0,
    interviews: 0
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);

  useEffect(() => {
    // Initialize session management
    const sessionManager = SessionManager.getInstance();
    
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load profile
      if (CandidateService) {
        const profileData = await CandidateService.getCandidateProfile();
        setProfile(profileData);
        
        // Load stats
        const statsData = await CandidateService.getApplicationStats();
        setStats(statsData);
        
        // Load recent applications
        const applications = await CandidateService.getRecentApplications();
        setRecentApplications(applications);
        
        // Load upcoming interviews
        const interviews = await CandidateService.getUpcomingInterviews();
        setUpcomingInterviews(interviews);
      } else {
        loadMockData();
      }
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    // Mock data for demonstration
    setProfile({
      name: user?.fullName || 'John Doe',
      email: user?.email || 'john@example.com',
      title: 'Senior Appian Developer',
      location: 'Remote',
      profileCompletion: 75,
      skills: ['Appian', 'BPM', 'Java', 'SQL'],
      status: 'Active'
    });
    
    setStats({
      totalApplications: 12,
      pending: 3,
      shortlisted: 5,
      interviews: 2
    });
    
    setRecentApplications([
      {
        id: '1',
        jobTitle: 'Senior Appian Developer',
        company: 'TechCorp Inc',
        status: 'shortlisted',
        appliedDate: '2024-01-15',
        matchScore: 92,
        location: 'Remote',
        salary: '$120k - $140k'
      },
      {
        id: '2',
        jobTitle: 'OutSystems Expert',
        company: 'Global Solutions',
        status: 'reviewing',
        appliedDate: '2024-01-10',
        matchScore: 85,
        location: 'New York, NY',
        salary: '$130k - $150k'
      }
    ]);
    
    setUpcomingInterviews([
      {
        id: '1',
        jobTitle: 'Senior Appian Developer',
        company: 'TechCorp Inc',
        date: '2024-01-25',
        time: '10:00 AM',
        type: 'Technical Round',
        interviewer: 'Jane Smith'
      }
    ]);
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      reviewing: { color: 'bg-blue-100 text-blue-800', icon: Eye },
      shortlisted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: X },
      accepted: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle }
    };
    
    const statusConfig = config[status] || config.pending;
    const Icon = statusConfig.icon;
    
    return (
      <Badge className={`${statusConfig.color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        {/* UPDATE: Your Sidebar doesn't take collapsed/onCollapse props */}
        <Sidebar role="candidate" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-primary">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* UPDATE: Your Sidebar doesn't take collapsed/onCollapse props */}
      <Sidebar role="candidate" />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {profile?.name || 'Candidate'}!</h1>
              <p className="text-muted-foreground">
                Here's what's happening with your job search
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button onClick={() => navigate('/candidate/profile/edit')}>
                Edit Profile
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          {/* Profile Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Profile Summary</CardTitle>
                  <CardDescription>
                    Your profile visibility and completeness
                  </CardDescription>
                </div>
                <Badge variant={profile?.status === 'Active' ? 'default' : 'secondary'}>
                  {profile?.status || 'Active'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{profile?.name}</h3>
                      <p className="text-muted-foreground">{profile?.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile?.location}</span>
                        <DollarSign className="h-4 w-4 ml-2" />
                        <span>Open to offers</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Profile Completion</span>
                      <span className="text-sm font-medium">{profile?.profileCompletion || 75}%</span>
                    </div>
                    <Progress value={profile?.profileCompletion || 75} className="h-2" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Messages
                  </Button>
                  <Button className="w-full" onClick={() => navigate('/candidate/profile/edit')}>
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                    <p className="text-2xl font-bold">{stats.totalApplications}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Shortlisted</p>
                    <p className="text-2xl font-bold">{stats.shortlisted}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Interviews</p>
                    <p className="text-2xl font-bold">{stats.interviews}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>
                      Your latest job applications
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/candidate/applications')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((app: any) => (
                    <div key={app.id} className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{app.jobTitle}</h4>
                          <p className="text-sm text-muted-foreground">{app.company}</p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {app.location}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {app.salary}
                          </span>
                        </div>
                        <span className="text-xs">Applied {app.appliedDate}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">Match Score: {app.matchScore}%</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full ${
                                app.matchScore >= 80 ? 'bg-green-500' :
                                app.matchScore >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${app.matchScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Interviews */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upcoming Interviews</CardTitle>
                    <CardDescription>
                      Scheduled interviews and meetings
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/candidate/interviews')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingInterviews.length > 0 ? (
                    upcomingInterviews.map((interview: any) => (
                      <div key={interview.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{interview.jobTitle}</h4>
                            <p className="text-sm text-muted-foreground">{interview.company}</p>
                          </div>
                          <Badge variant="outline">{interview.type}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{interview.date} at {interview.time}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Interviewer: {interview.interviewer}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="flex-1">
                            Join Meeting
                          </Button>
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No upcoming interviews</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Keep applying to get interview opportunities
                      </p>
                      <Button onClick={() => navigate('/candidate/jobs')}>
                        Browse Jobs
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Jobs */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recommended Jobs</CardTitle>
                  <CardDescription>
                    Jobs matching your profile
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/candidate/jobs')}>
                  Browse All Jobs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Find your next opportunity</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Browse through hundreds of job opportunities tailored to your skills
                </p>
                <Button size="lg" onClick={() => navigate('/candidate/jobs')}>
                  <Award className="h-4 w-4 mr-2" />
                  Explore Job Marketplace
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;