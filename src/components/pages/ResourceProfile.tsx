import { Sidebar } from "../Sidebar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { SkillBadge } from "../SkillBadge";
import {
  MapPin,
  Star,
  Briefcase,
  Calendar,
  DollarSign,
  MessageSquare,
  Phone,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";

const portfolio = [
  {
    title: "Enterprise BPM System",
    client: "Fortune 500 Company",
    description: "Developed end-to-end BPM solution using Appian",
    duration: "6 months",
    technologies: ["Appian", "BPM", "Integration"],
  },
  {
    title: "Process Automation Platform",
    client: "Healthcare Provider",
    description: "Automated 50+ business processes with Appian",
    duration: "8 months",
    technologies: ["Appian", "Process Mining", "Analytics"],
  },
  {
    title: "Document Management System",
    client: "Financial Institution",
    description: "Built secure document management with workflow automation",
    duration: "4 months",
    technologies: ["Appian", "Document Management", "Security"],
  },
];

const reviews = [
  {
    client: "John Smith",
    company: "Tech Solutions Inc",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Sarah is an exceptional Appian developer. She delivered our project on time and exceeded expectations. Highly recommend!",
  },
  {
    client: "Maria Garcia",
    company: "Global Enterprises",
    rating: 5,
    date: "1 month ago",
    comment:
      "Outstanding work! Great communication and technical expertise. Will definitely hire again.",
  },
  {
    client: "Robert Chen",
    company: "Innovation Labs",
    rating: 4,
    date: "2 months ago",
    comment:
      "Very professional and knowledgeable. Completed the project successfully with minor adjustments needed.",
  },
];

const certifications = [
  { name: "Appian Certified Senior Developer", issuer: "Appian", year: "2023" },
  { name: "Appian Certified Lead Developer", issuer: "Appian", year: "2022" },
  { name: "BPM Professional Certification", issuer: "ABPMP", year: "2021" },
];

export function ResourceProfile() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="client" />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <Button variant="ghost">← Back to Browse</Button>
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

        <div className="p-6 max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="mb-2">Sarah Johnson</h1>
                    <p className="text-muted-foreground mb-3">
                      Senior Appian Developer
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <SkillBadge skill="Appian" />
                      <SkillBadge skill="BPM" />
                      <SkillBadge skill="Process Mining" />
                      <SkillBadge skill="Integration" />
                      <SkillBadge skill="Analytics" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Schedule Call
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>New York, USA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9 (47 reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>8+ years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Available Now</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <Button size="lg" className="w-full md:w-auto">
                Hire Sarah - $95/hour
              </Button>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="rate">Rate & Availability</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 p-6">
                  <h3 className="mb-4">About</h3>
                  <p className="text-muted-foreground mb-6">
                    Senior Appian Developer with 8+ years of experience in
                    building enterprise-grade BPM solutions. Specialized in
                    process automation, integration, and analytics. Successfully
                    delivered 50+ projects for Fortune 500 companies across
                    various industries including healthcare, finance, and
                    manufacturing.
                  </p>
                  <h3 className="mb-4">Expertise</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        Business Process Management (BPM) and automation
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Appian application development and architecture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>System integration and API development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Process mining and optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Requirements gathering and solution design</span>
                    </li>
                  </ul>
                </Card>

                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="mb-4">Certifications</h3>
                    <div className="space-y-4">
                      {certifications.map((cert, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Award className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{cert.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {cert.issuer} • {cert.year}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="mb-4">Languages</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>English</span>
                        <span className="text-muted-foreground">Native</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spanish</span>
                        <span className="text-muted-foreground">
                          Professional
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              <div className="space-y-6">
                {portfolio.map((project, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="mb-1">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.client}
                        </p>
                      </div>
                      <Badge variant="outline">{project.duration}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <SkillBadge key={tech} skill={tech} variant="secondary" />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rate">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="mb-6">Rate Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <span>Hourly Rate</span>
                      </div>
                      <span className="font-semibold">$95/hour</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <span>Part-Time (20 hrs/week)</span>
                      <span className="font-semibold">$7,600/month</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span>Full-Time</span>
                      <span className="font-semibold">$15,200/month</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      * Rates are negotiable based on project scope and
                      duration. Long-term contracts may qualify for discounts.
                    </p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="mb-6">Availability</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">
                          Available Now
                        </p>
                        <p className="text-sm text-green-700">
                          Can start immediately
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Typical response time: Within 2 hours</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Timezone: EST (UTC-5)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>Preferred engagement: Part-time or Full-time</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card className="p-6 text-center">
                  <p className="text-4xl font-semibold mb-2">4.9</p>
                  <div className="flex justify-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on 47 reviews
                  </p>
                </Card>
                <Card className="p-6 text-center">
                  <p className="text-4xl font-semibold mb-2">100%</p>
                  <p className="text-sm text-muted-foreground">
                    Job Success Rate
                  </p>
                </Card>
                <Card className="p-6 text-center">
                  <p className="text-4xl font-semibold mb-2">50+</p>
                  <p className="text-sm text-muted-foreground">
                    Completed Projects
                  </p>
                </Card>
              </div>

              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {review.client
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{review.client}</p>
                          <p className="text-sm text-muted-foreground">
                            {review.company}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.date}
                      </p>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
