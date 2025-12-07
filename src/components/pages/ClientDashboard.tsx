import { Sidebar } from "../Sidebar";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router";
import {
  Users,
  FileText,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const statsCards = [
  {
    title: "Active Requirements",
    value: "3",
    change: "+1 this week",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    title: "Shortlisted Experts",
    value: "12",
    change: "+4 this week",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Active Contracts",
    value: "2",
    change: "Ongoing",
    icon: CheckCircle,
    color: "text-purple-600",
  },
  {
    title: "Total Spent",
    value: "$24,500",
    change: "+12% this month",
    icon: DollarSign,
    color: "text-orange-600",
  },
];

const recentRequirements = [
  {
    id: 1,
    title: "Senior Appian Developer for BPM Project",
    status: "Active",
    applicants: 8,
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "OutSystems Expert - E-commerce Platform",
    status: "In Review",
    applicants: 12,
    posted: "5 days ago",
  },
  {
    id: 3,
    title: "Mendix Developer - Part Time",
    status: "Active",
    applicants: 5,
    posted: "1 week ago",
  },
];

const recentActivity = [
  {
    type: "application",
    message: "Sarah Johnson applied to Appian Developer position",
    time: "2 hours ago",
    icon: Users,
  },
  {
    type: "message",
    message: "New message from Michael Chen",
    time: "5 hours ago",
    icon: MessageSquare,
  },
  {
    type: "contract",
    message: "Contract signed with Emily Rodriguez",
    time: "1 day ago",
    icon: CheckCircle,
  },
  {
    type: "alert",
    message: "Interview scheduled for tomorrow at 2 PM",
    time: "1 day ago",
    icon: Clock,
  },
];

export function ClientDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="client" />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1>Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's your overview
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Quick Action */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2">Need to hire talent?</h3>
                <p className="text-muted-foreground mb-4">
                  Post your requirement and get matched with certified experts
                </p>
                <Button asChild>
                  <Link to="/client/post-requirement">
                    Post Requirement
                  </Link>
                </Button>
              </div>
              <TrendingUp className="h-24 w-24 text-primary opacity-20" />
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-semibold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Requirements */}
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3>Recent Requirements</h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/client/requirements">View All</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {recentRequirements.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{req.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            req.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {req.status}
                        </span>
                        <span>{req.applicants} applicants</span>
                        <span>{req.posted}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm mb-1">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
