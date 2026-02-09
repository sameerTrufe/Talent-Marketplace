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
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Define interfaces
interface Technology {
  id: number;
  techName: string;
  skillType?: 'PRIMARY' | 'SECONDARY' | 'TOOL';
  yearsOfExperience?: number;
  lastUsedYear?: number;
}

interface Certification {
  id: number;
  certName: string;
  issuer?: string;
  yearObtained?: number;
}

interface Education {
  id: number;
  degree: string;
  college?: string;
  university?: string;
  yearOfPassing?: number;
}

interface WorkExperience {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  projectTitle?: string;
  projectRole?: string;
  clientName?: string;
  teamSize?: number;
  technologiesUsed?: string;
  keyAchievements?: string;
  noticePeriodServedDays?: number;
  rehireEligibility?: boolean;
  isCurrent?: boolean;
}

interface AwardAchievement {
  id: number;
  awardName: string;
  awardType: string;
  issuingOrganization: string;
  issueDate: string;
  description: string;
}

interface CandidateProfile {
  id: number;
  name: string;
  city: string;
  country: string;
  region: string;
  totalExperienceYears: number;
  domainExperience: string;
  college: string;
  university: string;
  technologies: Technology[];
  certifications: Certification[];
  educations: Education[];
  workExperiences: WorkExperience[];
  awardsAchievements: AwardAchievement[];
  
  availabilityStatus?: string;
  noticePeriodDays?: number;
  earliestStartDate?: string;
  currentCompany?: string;
  currentCompanyTenureMonths?: number;
  lastCompanyTenureMonths?: number;
  isWillingToBuyoutNotice?: boolean;
  
  // Frontend computed fields
  location?: string;
  role?: string;
  experience?: string;
  rating?: number;
  reviews?: number;
  rate?: string;
  image?: string;
  availability?: string;
}

// Static data
const staticPortfolio = [
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
];

const staticReviews = [
  {
    client: "John Smith",
    company: "Tech Solutions Inc",
    rating: 5,
    date: "2 weeks ago",
    comment: "Sarah is an exceptional Appian developer. She delivered our project on time and exceeded expectations. Highly recommend!",
  },
  {
    client: "Maria Garcia",
    company: "Global Enterprises",
    rating: 5,
    date: "1 month ago",
    comment: "Outstanding work! Great communication and technical expertise. Will definitely hire again.",
  },
];

const staticCertifications = [
  { id: 1, certName: "Appian Certified Senior Developer", issuer: "Appian", yearObtained: 2023 },
  { id: 2, certName: "Appian Certified Lead Developer", issuer: "Appian", yearObtained: 2022 },
  { id: 3, certName: "BPM Professional Certification", issuer: "ABPMP", yearObtained: 2021 },
];

// Check if running in development
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8080/api' 
  : '/api';

console.log('API Base URL:', API_BASE_URL, 'Development:', isDevelopment);

export function ResourceProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    console.log('ResourceProfile mounted with ID:', id);
    if (id) {
      fetchCandidateProfile(id);
    } else {
      console.error('No candidate ID provided');
      setError('No candidate ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchCandidateProfile = async (candidateId: string) => {
    console.log('Starting fetch for candidate:', candidateId);
    
    // For demo/testing without backend
    if (isDevelopment && import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      console.log('Using mock data');
      setTimeout(() => {
        const mockCandidate: CandidateProfile = {
          id: parseInt(candidateId),
          name: 'John Doe',
          city: 'San Francisco',
          country: 'USA',
          region: 'North America',
          totalExperienceYears: 8,
          domainExperience: 'Low-Code Platform Development',
          college: 'Stanford University',
          university: 'Stanford',
          technologies: [
            { id: 1, techName: 'Appian', skillType: 'PRIMARY', yearsOfExperience: 5, lastUsedYear: 2024 },
            { id: 2, techName: 'Java', skillType: 'PRIMARY', yearsOfExperience: 8, lastUsedYear: 2024 },
            { id: 3, techName: 'Spring Boot', skillType: 'SECONDARY', yearsOfExperience: 4, lastUsedYear: 2023 },
            { id: 4, techName: 'AWS', skillType: 'TOOL', yearsOfExperience: 3, lastUsedYear: 2024 },
            { id: 5, techName: 'Docker', skillType: 'TOOL', yearsOfExperience: 2, lastUsedYear: 2024 },
          ],
          certifications: staticCertifications,
          educations: [
            { id: 1, degree: 'Bachelor of Computer Science', college: 'Stanford University', university: 'Stanford', yearOfPassing: 2015 },
            { id: 2, degree: 'Master of Software Engineering', college: 'MIT', university: 'Massachusetts Institute of Technology', yearOfPassing: 2017 },
          ],
          workExperiences: [
            {
              id: 1,
              company: 'Tech Solutions Inc',
              role: 'Lead Appian Developer',
              startDate: '2021-01-01',
              endDate: '2024-01-01',
              responsibilities: 'Led a team of 5 developers in building enterprise BPM solutions',
              projectTitle: 'Enterprise Process Automation',
              projectRole: 'Lead Developer',
              clientName: 'Global Bank Corp',
              teamSize: 12,
              technologiesUsed: 'Appian, Java, Oracle DB',
              keyAchievements: 'Reduced processing time by 70%',
              noticePeriodServedDays: 60,
              rehireEligibility: true,
              isCurrent: false,
            },
            {
              id: 2,
              company: 'Innovate Tech',
              role: 'Senior Developer',
              startDate: '2018-01-01',
              endDate: '2020-12-31',
              responsibilities: 'Developed and maintained Appian applications',
              projectTitle: 'Customer Portal',
              projectRole: 'Developer',
              clientName: 'Retail Chain',
              teamSize: 8,
              technologiesUsed: 'Appian, SQL Server, REST APIs',
              keyAchievements: 'Improved customer satisfaction by 40%',
              noticePeriodServedDays: 45,
              rehireEligibility: true,
              isCurrent: false,
            },
          ],
          awardsAchievements: [
            {
              id: 1,
              awardName: 'Innovation Award',
              awardType: 'PROFESSIONAL',
              issuingOrganization: 'Tech Solutions Inc',
              issueDate: '2023-06-15',
              description: 'Awarded for developing an innovative process automation solution',
            },
          ],
          availabilityStatus: 'AVAILABLE_NOW',
          noticePeriodDays: 30,
          earliestStartDate: '2024-02-01',
          currentCompany: 'Tech Solutions Inc',
          currentCompanyTenureMonths: 36,
          lastCompanyTenureMonths: 24,
          isWillingToBuyoutNotice: true,
          location: 'San Francisco, USA',
          role: 'Lead Appian Developer',
          experience: '8+ years experience',
          rating: 4.8,
          reviews: 47,
          rate: '$125/hour',
          image: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80&${candidateId}`,
          availability: 'Available Now',
        };
        
        setCandidate(mockCandidate);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      setLoading(true);
      console.log(`Fetching candidate from: ${API_BASE_URL}/candidates/${candidateId}`);
      
      const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // Try fallback to mock data if backend is not available
        if (isDevelopment) {
          console.log('Backend not available, falling back to mock data');
          throw new Error('Backend connection failed. Using demo data.');
        }
        
        throw new Error(`Failed to fetch candidate: ${response.status}`);
      }

      const data = await response.json();
      console.log('Candidate data received:', data);
      
      // Transform the API response
      const transformedCandidate: CandidateProfile = {
        id: data.id || parseInt(candidateId),
        name: data.name || 'Unknown Candidate',
        city: data.city || '',
        country: data.country || '',
        region: data.region || '',
        totalExperienceYears: data.totalExperienceYears || 0,
        domainExperience: data.domainExperience || '',
        college: data.college || '',
        university: data.university || '',
        technologies: data.technologies || [],
        certifications: data.certifications || [],
        educations: data.educations || [],
        workExperiences: data.workExperiences || [],
        awardsAchievements: data.awardsAchievements || [],
        
        availabilityStatus: data.availabilityStatus,
        noticePeriodDays: data.noticePeriodDays,
        earliestStartDate: data.earliestStartDate,
        currentCompany: data.currentCompany,
        currentCompanyTenureMonths: data.currentCompanyTenureMonths,
        lastCompanyTenureMonths: data.lastCompanyTenureMonths,
        isWillingToBuyoutNotice: data.isWillingToBuyoutNotice,
        
        location: data.location || (data.city && data.country ? `${data.city}, ${data.country}` : data.region || 'Remote'),
        role: data.role || (data.technologies && data.technologies.length > 0 ? 
              `${data.technologies[0]?.techName} Expert` : 'Low-Code Expert'),
        experience: data.experience || (data.totalExperienceYears ? 
                  `${data.totalExperienceYears}+ years experience` : 'Experienced Professional'),
        rating: data.rating || 4.0 + Math.random() * 1.0,
        reviews: data.reviews || Math.floor(Math.random() * 100),
        rate: data.rate || `$${Math.min((data.totalExperienceYears || 5) * 10 + 50, 200)}/hour`,
        image: data.image || `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80&${data.id || candidateId}`,
        availability: data.availability || 'Available Now',
      };
      
      console.log('Transformed candidate:', transformedCandidate);
      setCandidate(transformedCandidate);
      setError(null);
      
    } catch (err) {
      console.error("Error fetching candidate profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load candidate profile");
      
      // Create a basic mock candidate for demo purposes
      const mockCandidate: CandidateProfile = {
        id: parseInt(candidateId),
        name: `Candidate ${candidateId}`,
        city: 'Unknown',
        country: 'Unknown',
        region: 'Unknown',
        totalExperienceYears: 5,
        domainExperience: 'Software Development',
        college: 'Example College',
        university: 'Example University',
        technologies: [
          { id: 1, techName: 'Appian', skillType: 'PRIMARY' },
          { id: 2, techName: 'Java', skillType: 'SECONDARY' },
          { id: 3, techName: 'SQL', skillType: 'TOOL' },
        ],
        certifications: [],
        educations: [],
        workExperiences: [],
        awardsAchievements: [],
        location: 'Remote',
        role: 'Software Developer',
        experience: '5+ years experience',
        rating: 4.5,
        reviews: 25,
        rate: '$85/hour',
        image: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80`,
        availability: 'Available Now',
      };
      
      setCandidate(mockCandidate);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    console.log('Navigating back');
    navigate('/candidates'); // Navigate to candidates list instead of -1
  };

  const handleMessage = () => {
    console.log('Message button clicked');
    // Implement message functionality
  };

  const handleScheduleCall = () => {
    console.log('Schedule call button clicked');
    // Implement schedule call functionality
  };

  const handleHire = () => {
    console.log('Hire button clicked');
    // Implement hire functionality
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role="client" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-primary">Loading candidate profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !candidate) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role="client" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <div className="text-red-500 mb-4">Error</div>
            <p className="mb-4">{error}</p>
            <Button onClick={handleBack}>Go Back to Candidates</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role="client" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <p className="mb-4">Candidate not found</p>
            <Button onClick={handleBack}>Go Back to Candidates</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="client" />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <Button variant="ghost" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Candidates
            </Button>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleMessage}>
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
          {/* Error Banner - Only show if we have an error but still showing candidate */}
          {error && candidate && (
            <div className="mb-6 p-4 bg-yellow-50 border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">{error}</p>
            </div>
          )}

          {/* Profile Header */}
          <Card className="p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={candidate.image} />
                <AvatarFallback>
                  {candidate.name?.split(' ').map(n => n[0]).join('') || 'C'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{candidate.name}</h1>
                    <p className="text-muted-foreground mb-3">
                      {candidate.role}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {candidate.technologies?.slice(0, 5).map((tech, index) => (
                        <SkillBadge key={index} skill={tech} />
                      ))}
                      {(!candidate.technologies || candidate.technologies.length === 0) && (
                        <p className="text-sm text-muted-foreground">No technologies listed</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleMessage}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" onClick={handleScheduleCall}>
                      <Phone className="h-4 w-4 mr-2" />
                      Schedule Call
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{candidate.rating?.toFixed(1)} ({candidate.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">{candidate.availability}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <Button size="lg" className="w-full md:w-auto" onClick={handleHire}>
                {candidate.availability ? `${candidate.name} is available for hire` : `${candidate.name} is not available`} - Hire {candidate.name?.split(' ')[0]}
              </Button>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="rate">Rate & Availability</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 p-6">
                  <h3 className="mb-4">About</h3>
                  <p className="text-muted-foreground mb-6">
                    {candidate.domainExperience ? 
                      `Expert in ${candidate.domainExperience} with ${candidate.totalExperienceYears}+ years of experience.` :
                      `Experienced professional with ${candidate.totalExperienceYears}+ years in the industry.`
                    }
                    {candidate.college && ` Educated at ${candidate.college}${candidate.university ? `, ${candidate.university}` : ''}.`}
                  </p>
                  
                  <h3 className="mb-4">Expertise</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {candidate.technologies?.map((tech, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{tech.techName} development and implementation</span>
                      </li>
                    ))}
                    {candidate.domainExperience && (
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{candidate.domainExperience}</span>
                      </li>
                    )}
                    {(!candidate.technologies || candidate.technologies.length === 0) && !candidate.domainExperience && (
                      <p className="text-muted-foreground">Expertise details not provided</p>
                    )}
                  </ul>
                </Card>

                {/* Availability Section */}
                <Card className="p-6 mb-6">
                  <h3 className="mb-4">Availability & Notice Period</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <p className="font-semibold">
                        {candidate.availabilityStatus ? 
                          candidate.availabilityStatus.replace('_', ' ') : 
                          'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Notice Period</p>
                      <p className="font-semibold">
                        {candidate.noticePeriodDays ? `${candidate.noticePeriodDays} days` : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Earliest Start</p>
                      <p className="font-semibold">
                        {candidate.earliestStartDate || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current Company</p>
                      <p className="font-semibold">
                        {candidate.currentCompany || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current Tenure</p>
                      <p className="font-semibold">
                        {candidate.currentCompanyTenureMonths ? 
                          `${candidate.currentCompanyTenureMonths} months` : 
                          'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Buyout Notice</p>
                      <p className="font-semibold">
                        {candidate.isWillingToBuyoutNotice ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Technologies by Skill Type */}
                <Card className="p-6 mb-6">
                  <h3 className="mb-4">Technical Expertise</h3>
                  
                  {candidate.technologies && candidate.technologies.length > 0 ? (
                    <>
                      {/* Primary Technologies */}
                      {candidate.technologies.filter(t => t.skillType === 'PRIMARY').length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Primary Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {candidate.technologies
                              .filter(t => t.skillType === 'PRIMARY')
                              .map((tech, index) => (
                                <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                  {tech.techName} 
                                  {tech.yearsOfExperience && ` (${tech.yearsOfExperience} yrs)`}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Secondary Technologies */}
                      {candidate.technologies.filter(t => t.skillType === 'SECONDARY').length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Secondary Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {candidate.technologies
                              .filter(t => t.skillType === 'SECONDARY')
                              .map((tech, index) => (
                                <div key={index} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                                  {tech.techName}
                                  {tech.yearsOfExperience && ` (${tech.yearsOfExperience} yrs)`}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Tools */}
                      {candidate.technologies.filter(t => t.skillType === 'TOOL').length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Tools & Platforms</h4>
                          <div className="flex flex-wrap gap-2">
                            {candidate.technologies
                              .filter(t => t.skillType === 'TOOL')
                              .map((tech, index) => (
                                <div key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
                                  {tech.techName}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">No technologies listed</p>
                  )}
                </Card>

                {/* Awards Section */}
                {candidate.awardsAchievements && candidate.awardsAchievements.length > 0 && (
                  <Card className="p-6 mb-6">
                    <h3 className="mb-4">Awards & Achievements</h3>
                    <div className="space-y-4">
                      {candidate.awardsAchievements.map((award, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4 py-2">
                          <p className="font-semibold">{award.awardName}</p>
                          <p className="text-sm text-muted-foreground">
                            {award.issuingOrganization} • {award.issueDate}
                          </p>
                          <p className="text-sm mt-1">{award.description}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="mb-4">Certifications</h3>
                    <div className="space-y-4">
                      {candidate.certifications && candidate.certifications.length > 0 ? (
                        candidate.certifications.map((cert, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Award className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{cert.certName}</p>
                              <p className="text-xs text-muted-foreground">
                                {cert.issuer || 'Professional'} • {cert.yearObtained || 'Recent'}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="space-y-4">
                          {staticCertifications.map((cert, index) => (
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
                          <p className="text-xs text-muted-foreground italic">
                            * Sample certifications shown
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="mb-4">Education</h3>
                    <div className="space-y-3">
                      {candidate.educations && candidate.educations.length > 0 ? (
                        candidate.educations.map((edu, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{edu.degree}</p>
                              {edu.college && (
                                <p className="text-xs text-muted-foreground">{edu.college}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          {candidate.college && (
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{candidate.college}</p>
                                {candidate.university && (
                                  <p className="text-xs text-muted-foreground">{candidate.university}</p>
                                )}
                              </div>
                            </div>
                          )}
                          {!candidate.college && (
                            <p className="text-sm text-muted-foreground">Education details not provided</p>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="experience">
              <div className="space-y-6">
                {/* Work Experience */}
                <Card className="p-6">
                  <h3 className="mb-4">Work Experience</h3>
                  {candidate.workExperiences && candidate.workExperiences.length > 0 ? (
                    <div className="space-y-4">
                      {candidate.workExperiences.map((exp, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4 py-3">
                          <p className="font-semibold">{exp.role} at {exp.company}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {exp.startDate} - {exp.endDate}
                          </p>
                          <p className="text-sm mt-2">{exp.responsibilities}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-l-2 border-primary pl-4 py-3">
                        <p className="font-semibold">Senior Developer at TechCorp</p>
                        <p className="text-sm text-muted-foreground mt-1">Full-time • 3 years</p>
                      </div>
                      <div className="border-l-2 border-primary pl-4 py-3">
                        <p className="font-semibold">Lead Developer at Solutions Inc</p>
                        <p className="text-sm text-muted-foreground mt-1">Full-time • 4 years</p>
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        * Sample work experience shown
                      </p>
                    </div>
                  )}
                </Card>

                {/* Portfolio */}
                <Card className="p-6">
                  <h3 className="mb-4">Portfolio & Projects</h3>
                  <div className="space-y-6">
                    {staticPortfolio.map((project, index) => (
                      <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="mb-1">{project.title}</h4>
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
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground italic">
                      * Sample portfolio projects shown
                    </p>
                  </div>
                </Card>
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
                      <span className="font-semibold">{candidate.rate || '$85/hour'}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <span>Part-Time (20 hrs/week)</span>
                      <span className="font-semibold">
                        {candidate.rate ? 
                          `$${parseInt(candidate.rate.replace(/[^0-9]/g, '')) * 20 * 4}` : 
                          '$6,800'
                        }/month
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span>Full-Time</span>
                      <span className="font-semibold">
                        {candidate.rate ? 
                          `$${parseInt(candidate.rate.replace(/[^0-9]/g, '')) * 40 * 4}` : 
                          '$13,600'
                        }/month
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      * Rates are negotiable based on project scope and duration. 
                      Long-term contracts may qualify for discounts.
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
                          {candidate.availability || 'Available Now'}
                        </p>
                        <p className="text-sm text-green-700">
                          Can start within 1-2 weeks
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
                        <span>Timezone: Based on {candidate.city || 'client'} timezone</span>
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
                  <p className="text-4xl font-semibold mb-2">{candidate.rating?.toFixed(1) || '4.9'}</p>
                  <div className="flex justify-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(candidate.rating || 4.9) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {candidate.reviews || 47} reviews
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
                {staticReviews.map((review, index) => (
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
                <p className="text-xs text-muted-foreground italic text-center">
                  * Sample reviews shown
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}