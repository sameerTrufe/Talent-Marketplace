import { Sidebar } from "../Sidebar";
import { Button } from "../ui/button";
import { FilterBar } from "../FilterBar";
import { ExpertCard } from "../ExpertCard";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessageSquare, SlidersHorizontal } from "lucide-react";

const experts = [
  {
    id: "1",
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    role: "Senior Appian Developer",
    location: "New York, USA",
    rating: 4.9,
    reviews: 47,
    rate: "$95",
    skills: ["Appian", "BPM", "Process Mining"],
    experience: "8+ years experience",
    availability: "Available Now",
  },
  {
    id: "2",
    name: "Michael Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    role: "OutSystems Expert",
    location: "San Francisco, USA",
    rating: 5.0,
    reviews: 63,
    rate: "$110",
    skills: ["OutSystems", "Mobile Apps", "Integration"],
    experience: "10+ years experience",
    availability: "Available in 2 weeks",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    role: "Mendix Specialist",
    location: "Austin, USA",
    rating: 4.8,
    reviews: 52,
    rate: "$85",
    skills: ["Mendix", "Low-Code", "Microservices"],
    experience: "6+ years experience",
    availability: "Available Now",
  },
  {
    id: "4",
    name: "David Park",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    role: "Pega Certified Lead",
    location: "Seattle, USA",
    rating: 4.9,
    reviews: 38,
    rate: "$120",
    skills: ["Pega", "CRM", "Decisioning"],
    experience: "9+ years experience",
    availability: "Available in 1 week",
  },
  {
    id: "5",
    name: "Rachel Kim",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    role: "Power Apps Developer",
    location: "Chicago, USA",
    rating: 4.7,
    reviews: 45,
    rate: "$75",
    skills: ["Power Apps", "Power Automate", "SharePoint"],
    experience: "5+ years experience",
    availability: "Available Now",
  },
  {
    id: "6",
    name: "James Wilson",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    role: "OutSystems Architect",
    location: "Boston, USA",
    rating: 5.0,
    reviews: 71,
    rate: "$130",
    skills: ["OutSystems", "Architecture", "Cloud"],
    experience: "12+ years experience",
    availability: "Available in 1 month",
  },
];

export function BrowseResources() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="client" />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1>Browse Resources</h1>
              <p className="text-muted-foreground">
                Find certified low-code experts for your projects
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
          {/* Filters */}
          <div className="mb-6">
            <FilterBar />
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{experts.length}</span> results
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option>Relevance</option>
                <option>Rating</option>
                <option>Rate: Low to High</option>
                <option>Rate: High to Low</option>
                <option>Experience</option>
              </select>
            </div>
          </div>

          {/* Expert Cards Grid */}
          <div className="grid gap-6">
            {experts.map((expert) => (
              <ExpertCard key={expert.id} {...expert} showActions={true} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="default">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
