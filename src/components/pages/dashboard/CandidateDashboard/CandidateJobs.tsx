import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock,
  Building
} from 'lucide-react';

const CandidateJobs: React.FC = () => {
  const jobs = [
    {
      id: '1',
      title: 'Senior Appian Developer',
      company: 'TechCorp Inc',
      location: 'Remote',
      salary: '$120k - $140k',
      type: 'Full-time',
      posted: '2 days ago',
      matchScore: 95
    },
    {
      id: '2',
      title: 'OutSystems Expert',
      company: 'Global Solutions',
      location: 'New York, NY',
      salary: '$130k - $150k',
      type: 'Contract',
      posted: '1 week ago',
      matchScore: 88
    },
    {
      id: '3',
      title: 'Mendix Specialist',
      company: 'Innovate Labs',
      location: 'San Francisco, CA',
      salary: '$110k - $130k',
      type: 'Full-time',
      posted: '3 days ago',
      matchScore: 82
    },
    {
      id: '4',
      title: 'Pega Architect',
      company: 'Enterprise Corp',
      location: 'Chicago, IL',
      salary: '$140k - $160k',
      type: 'Full-time',
      posted: '1 day ago',
      matchScore: 78
    },
    {
      id: '5',
      title: 'Low Code Developer',
      company: 'Startup XYZ',
      location: 'Remote',
      salary: '$100k - $120k',
      type: 'Full-time',
      posted: '4 days ago',
      matchScore: 92
    },
    {
      id: '6',
      title: 'BPM Consultant',
      company: 'Consulting Firm',
      location: 'Boston, MA',
      salary: '$115k - $135k',
      type: 'Contract',
      posted: '5 days ago',
      matchScore: 85
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/candidate/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Browse Jobs</h1>
          <p className="text-muted-foreground">Find your next opportunity from hundreds of available jobs</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, skills, or company..."
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <select className="h-10 rounded-md border border-input bg-background px-3">
                  <option value="">All Locations</option>
                  <option value="remote">Remote</option>
                  <option value="new-york">Hybrid</option>
                  <option value="san-francisco">Onsite</option>
                </select>
                <select className="h-10 rounded-md border border-input bg-background px-3">
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="contract">Contract</option> 
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {jobs.length} jobs matching your profile
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Building className="h-3 w-3" />
                      {job.company}
                    </CardDescription>
                  </div>
                  <Badge variant={job.matchScore >= 90 ? "default" : "secondary"}>
                    {job.matchScore}% match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.salary}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.type}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Posted {job.posted}</span>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs">Match Score</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            job.matchScore >= 90 ? 'bg-green-500' :
                            job.matchScore >= 80 ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${job.matchScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" size="sm">
                      Apply Now
                    </Button>
                    <Button variant="outline" size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        <div className="text-center mt-8 hidden">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search filters or check back later for new opportunities.
          </p>
          <Button onClick={() => {}}>Clear Filters</Button>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateJobs;