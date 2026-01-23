import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, CheckCircle, Clock, FileCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CandidateAssessments: React.FC = () => {
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
          <h1 className="text-3xl font-bold">My Assessments</h1>
          <p className="text-muted-foreground">Complete assessments to showcase your skills</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Technical Assessment Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Technical Skills</CardTitle>
                <Award className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>Appian Development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Completed
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Score</span>
                  <span className="text-sm font-bold">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Date</span>
                  <span className="text-sm">Jan 15, 2024</span>
                </div>
                <Button className="w-full">View Results</Button>
              </div>
            </CardContent>
          </Card>

          {/* Behavioral Assessment Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Behavioral</CardTitle>
                <FileCheck className="h-5 w-5 text-blue-500" />
              </div>
              <CardDescription>Communication Skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    <Clock className="mr-1 h-3 w-3" />
                    In Progress
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-bold">60%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deadline</span>
                  <span className="text-sm">Jan 30, 2024</span>
                </div>
                <Button className="w-full" variant="default">
                  Continue Assessment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Assessment Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Problem Solving</CardTitle>
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <CardDescription>Algorithmic Thinking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    Scheduled
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Duration</span>
                  <span className="text-sm">60 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Schedule</span>
                  <span className="text-sm">Feb 5, 2024</span>
                </div>
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment History */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Assessment History</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Java Fundamentals</h3>
                      <p className="text-sm text-muted-foreground">Completed on Jan 10, 2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">95%</p>
                    <p className="text-sm text-muted-foreground">Excellent</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">SQL Database</h3>
                      <p className="text-sm text-muted-foreground">Completed on Jan 5, 2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">88%</p>
                    <p className="text-sm text-muted-foreground">Good</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State (if no assessments) */}
        <div className="mt-8 text-center hidden">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Award className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No assessments yet</h3>
          <p className="text-muted-foreground mb-6">
            Complete assessments to showcase your skills to employers
          </p>
          <Button asChild>
            <Link to="/candidate/dashboard">Browse Available Assessments</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidateAssessments;