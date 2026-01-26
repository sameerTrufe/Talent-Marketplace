import React, { useState, useEffect, useCallback } from 'react';  
import { Sidebar } from "../../../Sidebar";
import { Button } from "../../../ui/button";
import { Card } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Badge } from "../../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
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
import { SkillBadge } from "../../../SkillBadge";
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

// --- Filter Options Interface ---
interface FilterOptions {
  technologies: string[];
  locations: string[];
  regions: string[];
  experienceRange: [number, number];
}

const HRDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // --- Search Stats ---
  const [searchStats, setSearchStats] = useState<{
    totalResults: number;
    currentPage: number;
    totalPages: number;
  } | null>(null);

  // --- Advanced Filters State ---
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [domainExperience, setDomainExperience] = useState("");
  const [minExperience, setMinExperience] = useState<number | "">("");
  const [maxExperience, setMaxExperience] = useState<number | "">("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [searchType, setSearchType] = useState<"AND" | "OR">("OR");
  const [techInput, setTechInput] = useState("");

  // --- Filter Options State ---
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    technologies: [],
    locations: [],
    regions: [],
    experienceRange: [0, 20]
  });
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);

  // --- Load filter options on component mount ---
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    setIsLoadingFilters(true);
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/filter-options`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFilterOptions({
          technologies: data.technologies || [],
          locations: data.locations || [],
          regions: data.regions || [],
          experienceRange: data.experienceRange || [0, 20]
        });
      }
    } catch (err) {
      console.error("Failed to load filter options:", err);
    } finally {
      setIsLoadingFilters(false);
    }
  };

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

  // --- Helper function to check if advanced filters are active ---
  const hasActiveAdvancedFilters = useCallback(() => {
    return selectedTechnologies.length > 0 ||
           domainExperience.trim() !== "" ||
           minExperience !== "" ||
           maxExperience !== "" ||
           region.trim() !== "" ||
           city.trim() !== "" ||
           country.trim() !== "";
  }, [selectedTechnologies, domainExperience, minExperience, maxExperience, region, city, country]);

  // --- Main Search Function (OR Logic) - Same as LandingPage ---
  const handleMainSearch = async () => {
    if (!searchTerm.trim() && !hasActiveAdvancedFilters()) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      console.log(`Searching (OR logic) for: ${searchTerm}`);
      
      // Use the simple-or-search endpoint for OR logic across all fields
      const response = await fetch(
        `${API_BASE_URL}/candidates/simple-or-search?q=${encodeURIComponent(searchTerm.trim())}&page=0&size=50`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        }
      );

      console.log('Response status:', response.status);

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

        // Update search stats
        setSearchStats({
          totalResults: data.totalElements || normalizedCandidates.length,
          currentPage: data.number || 0,
          totalPages: data.totalPages || 1
        });

        if (normalizedCandidates.length === 0) {
          setError("No candidates found. Try a different search term.");
        }
      } else {
        // Fallback to mock data
        console.log('Backend failed, using mock data');
        const mockCandidates = generateMockCandidates(searchTerm);
        setSearchResults(mockCandidates);
        setSearchStats({
          totalResults: mockCandidates.length,
          currentPage: 0,
          totalPages: 1
        });
        
        if (mockCandidates.length === 0) {
          setError("No candidates found. Try a different search term.");
        }
      }

    } catch (err) {
      console.error("Search error:", err);
      
      // Fallback to mock data
      const mockCandidates = generateMockCandidates(searchTerm);
      setSearchResults(mockCandidates);
      setSearchStats({
        totalResults: mockCandidates.length,
        currentPage: 0,
        totalPages: 1
      });
      setError("Backend connection failed. Showing mock data.");
      
    } finally {
      setIsLoading(false);
    }
  };

  // --- Advanced Search Function ---
  const handleSearch = async (useAdvancedFilters = false) => {
    // Check if we should use comma-separated AND search
    const shouldUseCommaAndSearch = 
      (searchTerm.includes(',') && searchTerm.trim().length >= 2) || 
      (selectedTechnologies.length > 1);
    
    if (shouldUseCommaAndSearch) {
      // Use the new AND logic for comma-separated search
      await handleCommaAndSearch();
      return;
    }

    const shouldUseAdvancedFilters = useAdvancedFilters || hasActiveAdvancedFilters();

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Build search parameters
      const params = new URLSearchParams();
      
      // Add search term if provided
      if (searchTerm.trim()) {
        params.append("q", searchTerm.trim());
      }

      // Add advanced filters if active
      if (shouldUseAdvancedFilters) {
        if (selectedTechnologies.length > 0) {
          params.append("technologies", selectedTechnologies.join(','));
        }
        if (domainExperience.trim()) {
          params.append("domainExperience", domainExperience.trim());
        }
        if (minExperience !== '') {
          params.append("minExperience", minExperience.toString());
        }
        if (maxExperience !== '') {
          params.append("maxExperience", maxExperience.toString());
        }
        if (region.trim()) {
          params.append("region", region.trim());
        }
        if (city.trim()) {
          params.append("city", city.trim());
        }
        if (country.trim()) {
          params.append("country", country.trim());
        }
      }

      // If no search criteria at all, show all candidates
      if (params.toString() === '') {
        // You might want to fetch all candidates here
        setSearchResults([]);
        setSearchStats({
          totalResults: 0,
          currentPage: 0,
          totalPages: 1
        });
        setIsLoading(false);
        setError("Please enter search criteria");
        return;
      }

      // Build URL
      const searchUrl = `${API_BASE_URL}/candidates/search?${params.toString()}&page=0&size=12`;
      
      console.log("Making search request to:", searchUrl);

      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      const data = await response.json();
      
      // Handle response - adjust based on response structure
      let candidates = [];
      let totalResults = 0;
      let currentPage = 0;
      let totalPages = 0;
      
      if (data.results && Array.isArray(data.results.content)) {
        // New structure with metadata
        candidates = data.results.content;
        totalResults = data.metadata?.totalResults || data.results.totalElements || 0;
        currentPage = data.metadata?.currentPage || data.results.number || 0;
        totalPages = data.metadata?.totalPages || data.results.totalPages || 0;
      } else if (data.content && Array.isArray(data.content)) {
        // Old Spring Data Page structure
        candidates = data.content;
        totalResults = data.totalElements || 0;
        currentPage = data.number || 0;
        totalPages = data.totalPages || 0;
      } else if (Array.isArray(data)) {
        // Array response
        candidates = data;
        totalResults = data.length;
        currentPage = 0;
        totalPages = 1;
      }
      
      const normalizedCandidates = candidates.map(normalizeCandidate);
      setSearchResults(normalizedCandidates);
      setSearchStats({
        totalResults,
        currentPage,
        totalPages
      });

    } catch (err) {
      console.error("Search error:", err);
      
      // Fallback to mock data
      const mockCandidates = generateMockCandidates(searchTerm);
      setSearchResults(mockCandidates);
      setSearchStats({
        totalResults: mockCandidates.length,
        currentPage: 0,
        totalPages: 1
      });
      
      if (import.meta.env.DEV) {
        setError("Development mode: Showing mock data. " + (err instanceof Error ? err.message : ''));
      } else {
        setError("Search failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Comma-separated AND Search Function ---
  const handleCommaAndSearch = async () => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Build search request object
      const searchRequest: any = {
        searchTerm: searchTerm.trim(),
        page: 0,
        size: 12,
        searchType: "AND"
      };

      // Add technologies if selected
      if (selectedTechnologies.length > 0) {
        searchRequest.technologies = selectedTechnologies.join(',');
      }

      // Add other filters
      if (domainExperience.trim()) {
        searchRequest.domainExperience = domainExperience.trim();
      }
      if (city.trim()) {
        searchRequest.city = city.trim();
      }
      if (country.trim()) {
        searchRequest.country = country.trim();
      }
      if (region.trim()) {
        searchRequest.region = region.trim();
      }
      if (minExperience !== '') {
        searchRequest.minExperience = Number(minExperience);
      }
      if (maxExperience !== '') {
        searchRequest.maxExperience = Number(maxExperience);
      }

      // Use the new comma-separated AND search endpoint
      const response = await fetch(`${API_BASE_URL}/candidates/search/comma-and`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(searchRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Search failed: ${response.status} - ${errorText}`);
      }

      const searchResponse = await response.json();
      
      // Handle response according to your SearchResponseDTO structure
      const candidates = searchResponse.results?.content || [];
      const normalizedCandidates = candidates.map(normalizeCandidate);
      
      setSearchResults(normalizedCandidates);
      setSearchStats({
        totalResults: searchResponse.metadata?.totalResults || 
                      searchResponse.results?.totalElements || 0,
        currentPage: searchResponse.metadata?.currentPage || 
                     searchResponse.results?.number || 0,
        totalPages: searchResponse.metadata?.totalPages || 
                    searchResponse.results?.totalPages || 0
      });

      console.log("AND Search Results:", normalizedCandidates.length, "candidates found");

    } catch (err) {
      console.error("Comma AND search error:", err);
      
      // Final fallback to mock data with correct AND logic filtering
      const mockCandidates = generateMockCandidates(searchTerm);
      
      // Filter mock data to simulate AND logic
      const filteredMockCandidates = mockCandidates.filter(candidate => {
        if (selectedTechnologies.length > 0) {
          // Check if candidate has ALL selected technologies (case-insensitive)
          return selectedTechnologies.every(tech => 
            candidate.skills?.some(skill => 
              skill.toLowerCase().includes(tech.toLowerCase()) ||
              tech.toLowerCase().includes(skill.toLowerCase())
            )
          );
        }
        // If no technologies selected but search term has comma, filter by terms
        if (searchTerm.includes(',')) {
          const searchTerms = searchTerm.split(',').map(term => term.trim().toLowerCase());
          return searchTerms.every(term => 
            candidate.name.toLowerCase().includes(term) ||
            candidate.role.toLowerCase().includes(term) ||
            candidate.skills?.some(skill => skill.toLowerCase().includes(term)) ||
            candidate.experience.toLowerCase().includes(term)
          );
        }
        return true;
      });
      
      setSearchResults(filteredMockCandidates);
      setSearchStats({
        totalResults: filteredMockCandidates.length,
        currentPage: 0,
        totalPages: 1
      });
      
      setError("Backend search failed, showing filtered mock data. Error: " + (err instanceof Error ? err.message : 'Unknown error'));
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
      handleMainSearch();
    }
  };

  // --- Clear all search ---
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
    setSearchStats(null);
    clearAdvancedFilters();
  };

  // --- Clear advanced filters ---
  const clearAdvancedFilters = () => {
    setSelectedTechnologies([]);
    setTechInput("");
    setDomainExperience("");
    setMinExperience("");
    setMaxExperience("");
    setRegion("");
    setCity("");
    setCountry("");
    setSearchType("OR");
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

  // --- Search hint ---
  const getSearchHint = () => {
    if (searchTerm.includes(',') && searchTerm.trim().length >= 2) {
      return "ⓘ Using AND logic for comma-separated terms (all terms must match)";
    }
    if (selectedTechnologies.length > 1) {
      return "ⓘ Using AND logic for multiple technologies (all must match)";
    }
    if (searchTerm.length > 0 && searchTerm.length < 3 && !hasActiveAdvancedFilters()) {
      return "ⓘ Enter at least 3 characters for text search, or use filters";
    }
    if (searchTerm.length >= 3 && !hasActiveAdvancedFilters()) {
      return "ⓘ Using OR logic - searching across all fields";
    }
    return null;
  };

  // --- Render active filters display ---
  const renderActiveFilters = () => {
    const hasActiveFilters = hasActiveAdvancedFilters();

    if (!hasActiveFilters) return null;

    return (
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Active Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAdvancedFilters}
            className="h-6 text-xs"
          >
            Clear All
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedTechnologies.map(tech => (
            <Badge key={tech} variant="secondary" className="gap-1">
              {tech}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTechnology(tech)} />
            </Badge>
          ))}
          {domainExperience && (
            <Badge variant="secondary" className="gap-1">
              Domain: {domainExperience}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setDomainExperience("")} />
            </Badge>
          )}
          {(minExperience !== "" || maxExperience !== "") && (
            <Badge variant="secondary" className="gap-1">
              Experience: {minExperience !== "" ? `≥${minExperience}` : ""}
              {minExperience !== "" && maxExperience !== "" && " - "}
              {maxExperience !== "" ? `≤${maxExperience}` : ""} years
              <X className="h-3 w-3 cursor-pointer" onClick={() => {
                setMinExperience("");
                setMaxExperience("");
              }} />
            </Badge>
          )}
          {region && (
            <Badge variant="secondary" className="gap-1">
              Region: {region}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setRegion("")} />
            </Badge>
          )}
          {city && (
            <Badge variant="secondary" className="gap-1">
              City: {city}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setCity("")} />
            </Badge>
          )}
          {country && (
            <Badge variant="secondary" className="gap-1">
              Country: {country}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setCountry("")} />
            </Badge>
          )}
          <Badge variant="outline">
            Search Type: {searchType}
          </Badge>
        </div>
      </div>
    );
  };

  // --- Render advanced filters panel ---
  const renderAdvancedFilters = () => {
    if (!showAdvancedFilters) return null;

    return (
      <Card className="mt-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Technology filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Technologies (AND logic for multiple)</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology (comma-separated or press Enter)"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      if (techInput.trim()) {
                        const values = techInput.split(',').map(v => v.trim()).filter(v => v);
                        setSelectedTechnologies(prev => [...new Set([...prev, ...values])]);
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
                      const values = techInput.split(',').map(v => v.trim()).filter(v => v);
                      setSelectedTechnologies(prev => [...new Set([...prev, ...values])]);
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
                    <span>{selectedTechnologies.length} technologies selected (AND logic)</span>
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
              
              {/* Quick select popular technologies */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Quick select:</p>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.technologies.slice(0, 8).map(tech => (
                    <SkillBadge
                      key={tech}
                      skill={tech}
                      variant={selectedTechnologies.includes(tech) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTechnology(tech)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Domain experience */}
          <div>
            <label className="block text-sm font-medium mb-2">Domain Experience (comma-separated)</label>
            <Input
              placeholder="e.g., Appian, BPM, Low-Code"
              value={domainExperience}
              onChange={(e) => setDomainExperience(e.target.value)}
            />
          </div>

          {/* Experience range */}
          <div>
            <label className="block text-sm font-medium mb-2">Experience (years)</label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value ? Number(e.target.value) : "")}
                min={0}
                max={50}
              />
              <Input
                placeholder="Max"
                type="number"
                value={maxExperience}
                onChange={(e) => setMaxExperience(e.target.value ? Number(e.target.value) : "")}
                min={0}
                max={50}
              />
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium mb-2">Region (comma-separated)</label>
            <Input
              placeholder="e.g., APAC, EMEA, NA"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-2">City (comma-separated)</label>
            <Input
              placeholder="e.g., Sydney, Bangalore, London"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium mb-2">Country (comma-separated)</label>
            <Input
              placeholder="e.g., India, USA, UK"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>

        {/* Search type and actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Match:</span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={searchType === "OR" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("OR")}
              >
                Any Criteria (OR)
              </Button>
              <Button
                type="button"
                variant={searchType === "AND" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("AND")}
              >
                All Criteria (AND)
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAdvancedFilters(false);
                clearAdvancedFilters();
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => handleSearch(true)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // --- Render search results ---
  const renderSearchResults = () => {
    if (!hasSearched) return null;

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
        <div className="container mx-auto px-4 max-w-6xl">
          <Card className="p-6 bg-red-50 border-red-300 mt-8">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">{error}</p>
                {searchTerm.length < 3 && !hasActiveAdvancedFilters() && (
                  <p className="text-sm mt-1">Minimum 3 characters required for text search</p>
                )}
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
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Search Results ({searchStats?.totalResults || searchResults.length} candidates)
              </h2>
              {searchTerm.includes(',') && (
                <p className="text-sm text-muted-foreground mt-1">
                  Using AND logic for comma-separated terms
                </p>
              )}
              {selectedTechnologies.length > 1 && !searchTerm.includes(',') && (
                <p className="text-sm text-muted-foreground mt-1">
                  Using AND logic for multiple technologies
                </p>
              )}
              {!hasActiveAdvancedFilters() && !searchTerm.includes(',') && selectedTechnologies.length <= 1 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Using OR logic across all fields
                </p>
              )}
            </div>
            {hasSearched && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Search
              </Button>
            )}
          </div>
          
          {/* Active filters display */}
          {renderActiveFilters()}
        
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
          
          {/* Enhanced Search Bar - Same as LandingPage */}
          <div className="mt-4">
            <Card className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by skill, certification, or name..."
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
                  onClick={handleMainSearch}
                  disabled={isLoading || (!searchTerm.trim() && !hasActiveAdvancedFilters())}
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
                  className={hasActiveAdvancedFilters() ? "bg-primary text-primary-foreground" : ""}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {hasActiveAdvancedFilters() && (
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
                      handleMainSearch();
                    }}
                  >
                    <SkillBadge skill={skill} variant="outline" />
                  </button>
                ))}
              </div>
              
              {/* Search hints */}
              {getSearchHint() && (
                <div className="mt-2 text-sm text-amber-600">
                  {getSearchHint()}
                </div>
              )}
              
              {/* Advanced Filters - Same as LandingPage */}
              {renderAdvancedFilters()}
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Show search results or dashboard content */}
          {hasSearched ? (
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
                          handleMainSearch();
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
                          handleMainSearch();
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