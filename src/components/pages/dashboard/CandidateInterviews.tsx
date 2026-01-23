import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  User, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const CandidateInterviews: React.FC = () => {
  const upcomingInterviews = [
    {
      id: '1',
      jobTitle: 'Senior Appian Developer',
      company: 'TechCorp Inc',
      date: '2024-01-25',
      time: '10:00 AM - 11:00 AM',
      type: 'Technical Round',
      interviewer: 'Jane Smith',
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      location: 'Virtual'
    },
    {
      id: '2',
      jobTitle: 'OutSystems Expert',
      company: 'Global Solutions',
      date: '2024-01-28',
      time: '2:00 PM - 3:00 PM',
      type: 'HR Round',
      interviewer: 'John Doe',
      status: 'scheduled',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join',
      location: 'Virtual'
    }
  ];

  const pastInterviews = [
    {
      id: '3',
      jobTitle: 'Mendix Specialist',
      company: 'Innovate Labs',
      date: '2024-01-18',
      time: '11:00 AM',
      type: 'Technical Round',
      interviewer: 'Sarah Johnson',
      status: 'completed',
      feedback: 'Positive',
      notes: 'Technical skills were excellent. Next round scheduled.'
    },
    {
      id: '4',
      jobTitle: 'Pega Architect',
      company: 'Enterprise Corp',
      date: '2024-01-12',
      time: '3:00 PM',
      type: 'Managerial Round',
      interviewer: 'Michael Chen',
      status: 'cancelled',
      reason: 'Position filled internally'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-0">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-0">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 border-0">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-0">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

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
          <h1 className="text-3xl font-bold">My Interviews</h1>
          <p className="text-muted-foreground">Manage and track your interview schedule</p>
        </div>

        {/* Upcoming Interviews */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Upcoming Interviews</h2>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>
          </div>

          {upcomingInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingInterviews.map((interview) => (
                <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{interview.jobTitle}</CardTitle>
                        <CardDescription>{interview.company}</CardDescription>
                      </div>
                      {getStatusBadge(interview.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{interview.date} at {interview.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Interviewer: {interview.interviewer}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{interview.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{interview.type}</span>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <Button className="flex-1" asChild>
                          <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </a>
                        </Button>
                        <Button variant="outline">Reschedule</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming interviews</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any scheduled interviews. Keep applying to get interview opportunities.
                </p>
                <Button asChild>
                  <Link to="/candidate/jobs">Browse Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Interviews */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Past Interviews</h2>
          
          {pastInterviews.length > 0 ? (
            <div className="space-y-4">
              {pastInterviews.map((interview) => (
                <Card key={interview.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{interview.jobTitle}</h3>
                            <p className="text-sm text-muted-foreground">{interview.company}</p>
                          </div>
                          {getStatusBadge(interview.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{interview.date} - {interview.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{interview.interviewer}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Video className="h-3 w-3" />
                            <span>{interview.type}</span>
                          </div>
                        </div>

                        {interview.feedback && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium mb-1">Feedback:</p>
                            <p className="text-sm text-muted-foreground">{interview.feedback}</p>
                            {interview.notes && (
                              <p className="text-sm text-muted-foreground mt-1">{interview.notes}</p>
                            )}
                          </div>
                        )}

                        {interview.reason && (
                          <div className="mt-3 p-3 bg-red-50 rounded-lg">
                            <p className="text-sm font-medium mb-1 text-red-700">Cancellation Reason:</p>
                            <p className="text-sm text-red-600">{interview.reason}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {interview.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            Feedback
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No past interviews found.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Interview Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Preparation Tips</CardTitle>
            <CardDescription>Get ready for your next interview</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Research the company and role thoroughly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Prepare examples of your past work using the STAR method</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Test your audio and video equipment before the interview</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Prepare questions to ask the interviewer</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Dress professionally, even for virtual interviews</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateInterviews;