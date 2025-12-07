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
  Download,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";

const activeContracts = [
  {
    id: 1,
    expert: {
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      role: "Senior Appian Developer",
    },
    project: "Enterprise BPM System",
    startDate: "Jan 15, 2025",
    endDate: "Jul 15, 2025",
    rate: "$95/hour",
    status: "Active",
    hoursWorked: 156,
    totalBilled: "$14,820",
  },
  {
    id: 2,
    expert: {
      name: "Emily Rodriguez",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      role: "Mendix Specialist",
    },
    project: "Mobile App Development",
    startDate: "Feb 1, 2025",
    endDate: "May 1, 2025",
    rate: "$85/hour",
    status: "Active",
    hoursWorked: 84,
    totalBilled: "$7,140",
  },
];

const invoices = [
  {
    id: "INV-2025-001",
    expert: "Sarah Johnson",
    project: "Enterprise BPM System",
    date: "Nov 1, 2025",
    amount: "$3,800",
    status: "Paid",
    dueDate: "Nov 15, 2025",
  },
  {
    id: "INV-2025-002",
    expert: "Emily Rodriguez",
    project: "Mobile App Development",
    date: "Nov 1, 2025",
    amount: "$2,550",
    status: "Paid",
    dueDate: "Nov 15, 2025",
  },
  {
    id: "INV-2025-003",
    expert: "Sarah Johnson",
    project: "Enterprise BPM System",
    date: "Oct 1, 2025",
    amount: "$3,800",
    status: "Paid",
    dueDate: "Oct 15, 2025",
  },
  {
    id: "INV-2025-004",
    expert: "Michael Chen",
    project: "Integration Project",
    date: "Sep 15, 2025",
    amount: "$5,500",
    status: "Paid",
    dueDate: "Sep 30, 2025",
  },
];

export function ContractBilling() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="client" />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1>Contracts & Billing</h1>
              <p className="text-muted-foreground">
                Manage your contracts and view invoices
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
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Active Contracts
                </p>
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-semibold mb-1">2</p>
              <p className="text-xs text-muted-foreground">Ongoing projects</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Total Hours
                </p>
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-semibold mb-1">240</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Monthly Spend
                </p>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-semibold mb-1">$21,960</p>
              <p className="text-xs text-muted-foreground">
                Across all contracts
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Pending Invoices
                </p>
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-2xl font-semibold mb-1">0</p>
              <p className="text-xs text-muted-foreground">All paid</p>
            </Card>
          </div>

          {/* Active Contracts */}
          <Card className="mb-6">
            <div className="p-6 border-b">
              <h2>Active Contracts</h2>
            </div>
            <div className="p-6 space-y-6">
              {activeContracts.map((contract) => (
                <Card key={contract.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={contract.expert.image} />
                        <AvatarFallback>
                          {contract.expert.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="mb-1">{contract.project}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {contract.expert.name} • {contract.expert.role}
                        </p>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {contract.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Contract
                      </Button>
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Start Date
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-semibold">
                          {contract.startDate}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        End Date
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-semibold">
                          {contract.endDate}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rate</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-semibold">{contract.rate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Hours Worked
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-semibold">
                          {contract.hoursWorked} hrs
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Total Billed
                      </p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-semibold">
                          {contract.totalBilled}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Invoices */}
          <Card>
            <div className="p-6 border-b flex items-center justify-between">
              <h2>Invoices</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Expert</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-semibold">
                      {invoice.id}
                    </TableCell>
                    <TableCell>{invoice.expert}</TableCell>
                    <TableCell>{invoice.project}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell className="font-semibold">
                      {invoice.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          invoice.status === "Paid"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
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
