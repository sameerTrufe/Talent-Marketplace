import React, { useState, useEffect, useCallback } from 'react';  
import { Sidebar } from "../../Sidebar";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
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
  Search,
  Filter,
  Download,
  Plus,
  Calendar,
  Briefcase,
  Check,
  X,
  MoreVertical,
  ArrowRight,
  Loader2,
  MapPin,
  Star,
  Heart,
  Eye,
} from "lucide-react";
import { SkillBadge } from "../../SkillBadge";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';

// --- Types ---
interface Candidate {
  id: string; 
  name: string;
  image: string;
  role: string;
  location: string;
  rating: number;
  reviews: number; 
  skills?: string[];
  experience: string;
  status?: string;
  email?: string;
  matchScore?: number;
  lastUpdated?: string;
}

// --- API Endpoint --- 
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8080/api' 
  : '/api';

const statsCards = [
  {
    title: "Active Candidates",
    value: "1,247",
    change: "+12% from last month",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Open Positions",
    value: "87",
    change: "+8 this week",
    icon: Briefcase,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Interviews Scheduled",
    value: "156",
    change: "+23 this month",
    icon: Calendar,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Placements",
    value: "42",
    change: "+18% this month",
    icon: CheckCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

const quickActions = [
  { title: "Post New Requirement", icon: Plus, color: "text-blue-600", bgColor: "bg-blue-50" },
  { title: "Search Candidates", icon: Search, color: "text-purple-600", bgColor: "bg-purple-50" },
  { title: "Schedule Interview", icon: Calendar, color: "text-green-600", bgColor: "bg-green-50" },
  { title: "Generate Reports", icon: Download, color: "text-orange-600", bgColor: "bg-orange-50" },
];

const HRDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Helper function to normalize candidate data
  const normalizeCandidate = (candidate: any): Candidate => {
    const skills = candidate.technologies || candidate.skills || candidate.technologyList || [];
    
    // Extract experience from various possible fields
    let experience = '';
    if (candidate.experience) {
      experience = candidate.experience;
    } else if (candidate.yearsOfExperience) {
      experience = `${candidate.yearsOfExperience}+ years experience`;
    } else if (candidate.totalExperienceYears) {
      experience = `${candidate.totalExperienceYears}+ years experience`;
    } else {
      experience = 'Experienced Professional';
    }

    return {
      id: candidate.id?.toString() || candidate.candidateId?.toString() || `candidate-${Math.random()}`,
      name: candidate.name || candidate.fullName || 'Unknown Candidate',
      image: candidate.image || candidate.profilePicture || `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80`,
      role: candidate.role || candidate.title || 
            (skills.length > 0 ? `${skills[0]} Developer` : 'Low-Code Expert'),
      location: candidate.location || 
               (candidate.city && candidate.country ? 
                `${candidate.city}, ${candidate.country}` : 
                candidate.region || 'Remote'),
      rating: candidate.rating || candidate.averageRating || 4.0 + Math.random() * 1.0,
      reviews: candidate.reviews || candidate.totalReviews || Math.floor(Math.random() * 100), 
      skills: Array.isArray(skills) ? skills.slice(0, 5) : [],
      experience: experience,
      status: candidate.status || 'Available',
      email: candidate.email,
      matchScore: candidate.matchScore || Math.floor(Math.random() * 20) + 80,
      lastUpdated: candidate.lastUpdated || 'Recently'
    };
  };

  // --- Main Search Function ---
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setShowSearchResults(true);

    try {
      console.log(`Searching for candidates: ${searchTerm}`);
      
      // Use the simple-or-search endpoint
      const response = await fetch(
        `${API_BASE_URL}/candidates/simple-or-search?q=${encodeURIComponent(searchTerm.trim())}&page=0&size=20`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Search response data:', data);
        
        let candidates = [];
        if (data.content && Array.isArray(data.content)) {
          candidates = data.content;
        } else if (Array.isArray(data)) {
          candidates = data;
        }

        const normalizedCandidates = candidates.map(normalizeCandidate);
        setSearchResults(normalizedCandidates);

        if (normalizedCandidates.length === 0) {
          setError("No candidates found. Try a different search term.");
        }
      } else {
        // Fallback to mock data
        console.log('Backend failed, using mock data');
        const mockCandidates = generateMockCandidates(searchTerm);
        setSearchResults(mockCandidates);
        
        if (mockCandidates.length === 0) {
          setError("No candidates found. Try a different search term.");
        }
      }

    } catch (err) {
      console.error("Search error:", err);
      
      // Fallback to mock data
      const mockCandidates = generateMockCandidates(searchTerm);
      setSearchResults(mockCandidates);
      setError("Backend connection failed. Showing mock data.");
      
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock candidates for fallback
  const generateMockCandidates = (searchTerm: string): Candidate[] => {
    const mockNames = [
      'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 
      'Lisa Anderson', 'James Wilson', 'Robert Brown', 'Maria Garcia',
      'John Smith', 'Mark Johnson', 'Rachel Green', 'David Wilson'
    ];
    
    const mockRoles = [
      'Senior Appian Developer', 'OutSystems Expert', 'Mendix Specialist',
      'Pega Architect', 'Power Apps Consultant', 'Low-Code Platform Expert',
      'Java Developer', 'React Developer', 'DevOps Engineer', 'Cloud Architect'
    ];
    
    const mockLocations = [
      'New York, USA', 'San Francisco, USA', 'Austin, USA',
      'London, UK', 'Mumbai, India', 'Singapore', 'Toronto, Canada'
    ];
    
    const mockSkills = [
      'Appian', 'OutSystems', 'Mendix', 'Pega', 'Power Apps',
      'BPM', 'Low-Code', 'Process Automation', 'UI/UX', 'Java',
      'React', 'AWS', 'Azure', 'DevOps', 'Microservices'
    ];
    
    const filteredNames = mockNames.filter(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      searchTerm.toLowerCase().includes(name.toLowerCase())
    );
    
    return Array.from({ length: Math.min(8, filteredNames.length || 6) }, (_, index) => ({
      id: `mock-${index}`,
      name: filteredNames[index % filteredNames.length] || mockNames[index % mockNames.length],
      image: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&${index}`,
      role: mockRoles[index % mockRoles.length],
      location: mockLocations[index % mockLocations.length],
      rating: 4.5 + Math.random() * 0.5,
      reviews: Math.floor(Math.random() * 50) + 10, 
      skills: [mockSkills[index % mockSkills.length], ...mockSkills.slice(0, 2)],
      experience: `${5 + index % 5}+ years experience`,
      status: ['Available', 'Interviewing', 'Notice Period', 'Not Available'][index % 4],
      matchScore: Math.floor(Math.random() * 20) + 80,
      lastUpdated: `${index + 1} hour${index === 0 ? '' : 's'} ago`
    }));
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // --- Clear search ---
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchResults(false);
    setError(null);
    setSelectedTechnologies([]);
  };

  // --- Toggle technology selection ---
  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  // --- Remove technology badge ---
  const removeTechnology = (tech: string) => {
    setSelectedTechnologies(prev => prev.filter(t => t !== tech));
  };

  // --- Render search results ---
  const renderSearchResults = () => {
    if (!showSearchResults) return null;

    if (isLoading) {
      return (
        <div className="text-center mt-8 p-4">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-primary">Searching for candidates...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container mx-auto px-4 mt-8">
          <Card className="p-6 bg-red-50 border-red-300">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">{error}</p>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="text-center mt-8 p-8">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Candidates Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={handleClearSearch}>
              Clear Search
            </Button>
          </div>
        </div>
      );
    }

    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Search Results ({searchResults.length} candidates)
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Using OR logic across all fields
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Search
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((candidate) => (
              <Card key={candidate.id} className="p-6 hover:shadow-lg transition-shadow relative">
                {/* View Profile Button */}
                <div className="absolute top-3 right-3 z-10">
                  <Button 
                    asChild 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
                  >
                    <Link to={`/client/resource/${candidate.id}`} title="View Profile">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="flex gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={candidate.image} alt={candidate.name} />
                    <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{candidate.name}</h3>
                        <p className="text-muted-foreground">{candidate.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {candidate.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {candidate.rating.toFixed(1)} ({candidate.reviews} reviews)
                      </div>
                    </div>
                    
                    {/* Skills section */}
                    <div className="mt-3">
                      {candidate.skills && candidate.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <SkillBadge key={skill} skill={skill} />
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="text-xs text-muted-foreground self-center">
                              +{candidate.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No skills listed</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{candidate.experience}</p>
                        <Badge className={
                          candidate.status === 'Available' ? 'bg-green-100 text-green-800' :
                          candidate.status === 'Interviewing' ? 'bg-blue-100 text-blue-800' :
                          candidate.status === 'Notice Period' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {candidate.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Match Score */}
                    {candidate.matchScore && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Match Score</span>
                          <span className="font-semibold">{candidate.matchScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              candidate.matchScore >= 90 ? 'bg-green-500' :
                              candidate.matchScore >= 80 ? 'bg-blue-500' :
                              candidate.matchScore >= 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${candidate.matchScore}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* View Profile Link */}
                    <div className="mt-4 pt-3 border-t">
                      <Button 
                        asChild 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                      >
                        <Link to={`/client/resource/${candidate.id}`} className="flex items-center justify-center gap-2">
                          <Eye className="h-3 w-3" />
                          View Full Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="hr" />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HR Manager Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome back{user?.name ? `, ${user.name}` : ''}! Manage your recruitment pipeline and candidates
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </Button>
              <Avatar>
                <AvatarImage src={user?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"} />
                <AvatarFallback>{user?.name?.charAt(0) || 'HR'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4">
            <Card className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates by skill, name, or technology..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading || !searchTerm.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Search
                </Button>
                <Button
                  variant={showAdvancedFilters ? "default" : "outline"}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={selectedTechnologies.length > 0 ? "bg-primary text-primary-foreground" : ""}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {selectedTechnologies.length > 0 && (
                    <span className="ml-2 h-2 w-2 bg-white rounded-full"></span>
                  )}
                </Button>
              </div>
              
              {/* Quick search chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {['Appian', 'OutSystems', 'Mendix', 'Java', 'React', 'AWS'].map((skill) => (
                  <button
                    key={skill}
                    onClick={() => {
                      setSearchTerm(skill);
                      handleSearch();
                    }}
                  >
                    <SkillBadge skill={skill} variant="outline" />
                  </button>
                ))}
              </div>
              
              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <Card className="mt-4 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Technology filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Technologies</label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add technology"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (techInput.trim()) {
                                  setSelectedTechnologies(prev => [...new Set([...prev, techInput.trim()])]);
                                  setTechInput('');
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              if (techInput.trim()) {
                                setSelectedTechnologies(prev => [...new Set([...prev, techInput.trim()])]);
                                setTechInput('');
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        
                        {/* Selected technologies as badges */}
                        {selectedTechnologies.length > 0 && (
                          <div className="p-3 bg-muted/20 rounded-md">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {selectedTechnologies.map(tech => (
                                <Badge key={tech} variant="secondary" className="gap-1 px-3 py-1">
                                  {tech}
                                  <X 
                                    className="h-3 w-3 cursor-pointer ml-1" 
                                    onClick={() => removeTechnology(tech)} 
                                  />
                                </Badge>
                              ))}
                            </div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>{selectedTechnologies.length} technologies selected</span>
                              <button
                                type="button"
                                onClick={() => setSelectedTechnologies([])}
                                className="text-red-500 hover:text-red-700"
                              >
                                Clear all
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Experience filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Experience (years)</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Min"
                          type="number"
                          min={0}
                          max={50}
                        />
                        <Input
                          placeholder="Max"
                          type="number"
                          min={0}
                          max={50}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAdvancedFilters(false);
                        setSelectedTechnologies([]);
                      }}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      // Apply filters and search
                      if (selectedTechnologies.length > 0) {
                        setSearchTerm(selectedTechnologies.join(', '));
                      }
                      handleSearch();
                    }}>
                      Apply Filters & Search
                    </Button>
                  </div>
                </Card>
              )}
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Show search results or dashboard content */}
          {showSearchResults ? (
            renderSearchResults()
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.title} className="border shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-2 rounded-full ${stat.bgColor}`}>
                            <Icon className={`h-6 w-6 ${stat.color}`} />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {stat.change.includes('+') ? '▲' : '▼'} {stat.change.split(' ')[0]}
                          </Badge>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.title}
                        className="bg-white border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all text-left"
                        onClick={() => {
                          if (action.title === "Search Candidates") {
                            // Focus on search input
                            const searchInput = document.querySelector('input[placeholder*="Search candidates"]');
                            if (searchInput) {
                              (searchInput as HTMLInputElement).focus();
                            }
                          }
                        }}
                      >
                        <div className={`p-2 rounded-full ${action.bgColor} w-fit mb-3`}>
                          <Icon className={`h-5 w-5 ${action.color}`} />
                        </div>
                        <p className="font-medium text-gray-900">{action.title}</p>
                        <p className="text-sm text-gray-500 mt-1">Click to start</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Actions */}
              <Card className="mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Start Searching for Candidates</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 border rounded-lg">
                      <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Quick Search</h3>
                      <p className="text-sm text-gray-600 mb-4">Find candidates by skills or technologies</p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setSearchTerm("Appian Developer");
                          handleSearch();
                        }}
                      >
                        Search Appian Developers
                      </Button>
                    </div>
                    
                    <div className="text-center p-6 border rounded-lg">
                      <Filter className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Advanced Filters</h3>
                      <p className="text-sm text-gray-600 mb-4">Use multiple filters for precise matches</p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setShowAdvancedFilters(true)}
                      >
                        Open Filters
                      </Button>
                    </div>
                    
                    <div className="text-center p-6 border rounded-lg">
                      <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">View All Candidates</h3>
                      <p className="text-sm text-gray-600 mb-4">Browse through all registered candidates</p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setSearchTerm("");
                          handleSearch();
                        }}
                      >
                        Browse All
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;