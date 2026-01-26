import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  Download,
  CheckCircle,
  Clock,
  X,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { CandidateService } from '@/lib/api/CandidateService';
import { toast } from 'sonner';

const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const apps = await CandidateService.getAllApplications();
      setApplications(apps || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockApplications = [
      {
        id: '1',
        jobTitle: 'Senior Appian Developer',
        company: 'TechCorp Inc',
        status: 'shortlisted',
        appliedDate: '2024-01-15',
        lastUpdate: '2024-01-20',
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
        lastUpdate: '2024-01-12',
        matchScore: 85,
        location: 'New York, NY',
        salary: '$130k - $150k',
        jobType: 'Contract'
      },
      {
        id: '3',
        jobTitle: 'Mendix Specialist',
        company: 'Innovate Labs',
        status: 'pending',
        appliedDate: '2024-01-18',
        lastUpdate: '2024-01-18',
        matchScore: 78,
        location: 'San Francisco, CA',
        salary: '$110k - $130k',
        jobType: 'Full-time'
      },
      {
        id: '4',
        jobTitle: 'Pega Architect',
        company: 'Enterprise Corp',
        status: 'rejected',
        appliedDate: '2024-01-05',
        lastUpdate: '2024-01-08',
        matchScore: 65,
        location: 'Chicago, IL',
        salary: '$140k - $160k',
        jobType: 'Full-time'
      },
      {
        id: '5',
        jobTitle: 'Low Code Developer',
        company: 'Startup XYZ',
        status: 'accepted',
        appliedDate: '2024-01-02',
        lastUpdate: '2024-01-10',
        matchScore: 95,
        location: 'Remote',
        salary: '$100k - $120k',
        jobType: 'Full-time'
      }
    ];
    setApplications(mockApplications);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      reviewing: { color: 'bg-blue-100 text-blue-800', icon: Eye },
      shortlisted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: X },
      accepted: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredApplications = applications.filter((app: any) => {
    const matchesSearch = searchTerm === '' || 
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-primary">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/candidate/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">My Applications</h1>
              <p className="text-muted-foreground">
                Track all your job applications
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/candidate/jobs">
              Browse Jobs
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="h-10 rounded-md border border-input bg-background px-3"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Applications Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
        </div>

        {/* Applications Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app: any) => (
                <TableRow key={app.id} className="hover:bg-accent/50">
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{app.jobTitle}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{app.jobType}</span>
                        <DollarSign className="h-3 w-3 ml-2" />
                        <span>{app.salary}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{app.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{app.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>{app.appliedDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            app.matchScore >= 80 ? 'bg-green-500' :
                            app.matchScore >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${app.matchScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        app.matchScore >= 80 ? 'text-green-700' :
                        app.matchScore >= 60 ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {app.matchScore}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        asChild
                      >
                        <Link to={`/client/resource/${app.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      {app.status === 'shortlisted' && (
                        <Button 
                          variant="default" 
                          size="sm"
                          asChild
                        >
                          <Link to={`/candidate/interviews/schedule?job=${app.id}`}>
                            Schedule Interview
                          </Link>
                        </Button>
                      )}
                      {(app.status === 'rejected' || app.status === 'accepted') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => CandidateService.withdrawApplication(app.id)}
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredApplications.length === 0 && (
            <div className="text-center p-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No applications found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'You haven\'t applied to any jobs yet'}
              </p>
              <Button asChild>
                <Link to="/candidate/jobs">Browse Available Jobs</Link>
              </Button>
            </div>
          )}
        </Card>

        {/* Export Options */}
        <div className="mt-6 flex justify-end">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsList;