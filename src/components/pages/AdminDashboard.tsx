import { Sidebar } from "../Sidebar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  UserCheck,
  MessageSquare,
} from "lucide-react";

const statsCards = [
  {
    title: "Total Users",
    value: "1,247",
    change: "+12% from last month",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Requirements",
    value: "87",
    change: "+8 this week",
    icon: FileText,
    color: "text-purple-600",
  },
  {
    title: "Active Contracts",
    value: "156",
    change: "+23 this month",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Platform Revenue",
    value: "$124,580",
    change: "+18% this month",
    icon: DollarSign,
    color: "text-orange-600",
  },
];

const recentUsers = [
  {
    name: "John Smith",
    email: "john@techcorp.com",
    role: "Client",
    joined: "2 hours ago",
    status: "Active",
  },
  {
    name: "Lisa Brown",
    email: "lisa@example.com",
    role: "Expert",
    joined: "5 hours ago",
    status: "Pending Verification",
  },
  {
    name: "Mark Johnson",
    email: "mark@startup.io",
    role: "Client",
    joined: "1 day ago",
    status: "Active",
  },
  {
    name: "Rachel Green",
    email: "rachel@dev.com",
    role: "Expert",
    joined: "1 day ago",
    status: "Active",
  },
];

const recentRequirements = [
  {
    id: "REQ-1245",
    title: "Senior Appian Developer",
    client: "TechCorp Inc",
    posted: "2 hours ago",
    status: "Open",
    applicants: 3,
  },
  {
    id: "REQ-1244",
    title: "OutSystems Expert",
    client: "Global Solutions",
    posted: "1 day ago",
    status: "Open",
    applicants: 8,
  },
  {
    id: "REQ-1243",
    title: "Mendix Developer",
    client: "Innovation Labs",
    posted: "2 days ago",
    status: "In Review",
    applicants: 12,
  },
];

const platformActivity = [
  {
    type: "user",
    message: "New client registration: TechStart Inc",
    time: "10 minutes ago",
    icon: Users,
  },
  {
    type: "requirement",
    message: "New requirement posted: Senior Pega Developer",
    time: "1 hour ago",
    icon: FileText,
  },
  {
    type: "contract",
    message: "Contract signed: REQ-1240",
    time: "2 hours ago",
    icon: CheckCircle,
  },
  {
    type: "payment",
    message: "Payment processed: $3,800",
    time: "3 hours ago",
    icon: DollarSign,
  },
  {
    type: "verification",
    message: "Expert verified: Sarah Johnson",
    time: "5 hours ago",
    icon: UserCheck,
  },
];

export function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1>Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Platform overview and management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Support
              </Button>
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
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

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* User Growth Chart Placeholder */}
            <Card className="lg:col-span-2 p-6">
              <h3 className="mb-6">User Growth</h3>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Chart placeholder - User growth over time
                  </p>
                </div>
              </div>
            </Card>

            {/* Platform Activity */}
            <Card className="p-6">
              <h3 className="mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {platformActivity.map((activity, index) => {
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

          {/* Recent Users */}
          <Card className="mb-6">
            <div className="p-6 border-b flex items-center justify-between">
              <h2>Recent Users</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.joined}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Recent Requirements */}
          <Card>
            <div className="p-6 border-b flex items-center justify-between">
              <h2>Recent Requirements</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequirements.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-semibold">{req.id}</TableCell>
                    <TableCell>{req.title}</TableCell>
                    <TableCell>{req.client}</TableCell>
                    <TableCell>{req.posted}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          req.status === "Open"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{req.applicants}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
