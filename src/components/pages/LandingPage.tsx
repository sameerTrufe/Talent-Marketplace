import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { ExpertCard } from "../ExpertCard"; 
import { SkillBadge } from "../SkillBadge"; 
import { Link } from "react-router";
import {
  Search,
  UserPlus,
  FileText,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  AlertTriangle,
  Loader2,
  X,
  Filter,
  ChevronDown,
  MapPin,
  Briefcase,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

// --- Types ---
interface Expert {
  id: string; 
  name: string;
  image: string;
  role: string;
  location: string;
  rating: number;
  reviews: number;
  rate: string;
  skills?: string[];
  experience: string;
}

interface SearchResponse {
  content: Expert[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
  first: boolean;
  last: boolean;
  searchCriteria?: SearchCriteria;
}

interface SearchCriteria {
  technologies?: string[];
  domainExperience?: string;
  minExperience?: number;
  maxExperience?: number;
  region?: string;
  city?: string;
  country?: string;
  searchType?: string;
}

interface FilterOptions {
  technologies: string[];
  locations: string[];
  regions: string[];
  experienceRange: [number, number];
}

// --- Constants ---
const featuredExperts: Expert[] = [
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
  },
];

const howItWorks = [
  { icon: UserPlus, step: "1", title: "Create Account", description: "Sign up as a client or expert in minutes" },
  { icon: FileText, step: "2", title: "Post or Browse", description: "Post requirements or browse certified experts" },
  { icon: Users, step: "3", title: "Connect & Match", description: "Review profiles, schedule calls, and interview" },
  { icon: CheckCircle, step: "4", title: "Start Working", description: "Hire talent and manage projects seamlessly" },
];

const testimonials = [
  { name: "David Kim", role: "CTO, TechStart Inc", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", rating: 5, text: "Found an amazing Appian developer within 48 hours. The quality of talent is outstanding!" },
  { name: "Lisa Anderson", role: "Project Manager, Global Solutions", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400", rating: 5, text: "This platform made it so easy to find certified OutSystems experts for our enterprise project." },
  { name: "James Wilson", role: "VP Engineering, Innovate Corp", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", rating: 5, text: "Best marketplace for low-code talent. Highly recommend for any company using these platforms." },
];

const platformSkills = ["Appian", "OutSystems", "Mendix", "Pega", "Power Apps"];
// --- API Endpoint --- 
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8080/api' 
  : '/api';

// Helper function to generate mock data - SINGLE DEFINITION
const generateMockExperts = (searchTerm: string, technologies: string[]): Expert[] => {
  const mockNames = [
    'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 
    'Lisa Anderson', 'James Wilson', 'Robert Brown', 'Maria Garcia'
  ];
  
  const mockRoles = [
    'Senior Appian Developer', 'OutSystems Expert', 'Mendix Specialist',
    'Pega Architect', 'Power Apps Consultant', 'Low-Code Platform Expert'
  ];
  
  const mockLocations = [
    'New York, USA', 'San Francisco, USA', 'Austin, USA',
    'London, UK', 'Mumbai, India', 'Singapore'
  ];
  
  const mockSkills = [
    'Appian', 'OutSystems', 'Mendix', 'Pega', 'Power Apps',
    'BPM', 'Low-Code', 'Process Automation', 'UI/UX'
  ];
  
  const filteredSkills = technologies.length > 0 ? technologies : mockSkills;
  
  return Array.from({ length: 6 }, (_, index) => ({
    id: `mock-${index}`,
    name: mockNames[index % mockNames.length],
    image: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&${index}`,
    role: mockRoles[index % mockRoles.length],
    location: mockLocations[index % mockLocations.length],
    rating: 4.5 + Math.random() * 0.5,
    reviews: Math.floor(Math.random() * 50) + 10,
    rate: `$${80 + Math.floor(Math.random() * 40)}`,
    skills: [filteredSkills[index % filteredSkills.length], ...filteredSkills.slice(0, 2)],
    experience: `${5 + index}+ years experience`
  }));
};

export function LandingPage() {
  const [techInput, setTechInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
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

  // Helper function to normalize candidate data
  const normalizeCandidate = (candidate: any) => {
    const skills = candidate.technologies || candidate.skills || [];
    
    // Calculate hourly rate based on experience
    let hourlyRate = candidate.rate;
    if (!hourlyRate && candidate.experience) {
      const expMatch = candidate.experience.match(/\d+/);
      if (expMatch) {
        const expYears = parseInt(expMatch[0]);
        hourlyRate = `$${Math.min(expYears * 10 + 50, 200)}`; // Cap at $200/hour
      }
    }

    return {
      id: candidate.id?.toString() || `candidate-${Math.random()}`,
      name: candidate.name || 'Unknown Expert',
      image: candidate.image || `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80`,
      role: candidate.role || 
            (skills.length > 0 ? `${skills[0]} Developer` : 'Low-Code Expert'),
      location: candidate.location || 
               (candidate.city && candidate.country ? 
                `${candidate.city}, ${candidate.country}` : 
                candidate.region || 'Remote'),
      rating: candidate.rating || 4.0 + Math.random() * 1.0,
      reviews: candidate.reviews || Math.floor(Math.random() * 100),
      rate: hourlyRate || '$85',
      skills: skills.slice(0, 5),
      experience: candidate.experience || 
                 (candidate.totalExperienceYears ? 
                  `${candidate.totalExperienceYears}+ years experience` : 
                  'Experienced Professional')
    };
  };

  // Error handling
  const handleSearchError = (err: any) => {
    console.error("Search error:", err);
    
    let errorMsg = "Search failed. Please try again.";
    
    if (err instanceof Error) {
      if (err.message.includes('Network')) {
        errorMsg = "Network error. Please check your connection.";
      } else if (err.message.includes('CORS')) {
        errorMsg = "Backend connection issue. Make sure the server is running.";
      } else {
        errorMsg = err.message;
      }
    }
    
    setError(errorMsg);
    
    // Fallback to mock data in development
    if (import.meta.env.DEV) {
      const mockResults = generateMockExperts(searchTerm, selectedTechnologies);
      setSearchResults(mockResults);
      setSearchStats({
        totalResults: mockResults.length,
        currentPage: 0,
        totalPages: 1
      });
      setError(`${errorMsg} Showing mock data for development.`);
    }
  };

  // --- NEW: Comma-separated AND Search Function ---
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
    const normalizedExperts = candidates.map(normalizeCandidate);
    
    setSearchResults(normalizedExperts);
    setSearchStats({
      totalResults: searchResponse.metadata?.totalResults || 
                    searchResponse.results?.totalElements || 0,
      currentPage: searchResponse.metadata?.currentPage || 
                   searchResponse.results?.number || 0,
      totalPages: searchResponse.metadata?.totalPages || 
                  searchResponse.results?.totalPages || 0
    });

    console.log("AND Search Results:", normalizedExperts.length, "candidates found");

  } catch (err) {
    console.error("Comma AND search error:", err);
    
    // Fallback to direct GET call
    try {
      // Try the simple GET endpoint
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.append("q", searchTerm.trim());
      }
      if (selectedTechnologies.length > 0) {
        params.append("technologies", selectedTechnologies.join(','));
      }
      
      const fallbackResponse = await fetch(
        `${API_BASE_URL}/candidates/search/comma-simple?${params.toString()}&page=0&size=12`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const candidates = fallbackData.content || fallbackData.results?.content || [];
        const normalizedExperts = candidates.map(normalizeCandidate);
        
        setSearchResults(normalizedExperts);
        setSearchStats({
          totalResults: fallbackData.totalElements || fallbackData.results?.totalElements || 0,
          currentPage: fallbackData.number || fallbackData.results?.number || 0,
          totalPages: fallbackData.totalPages || fallbackData.results?.totalPages || 0
        });
        
        setError(null); // Clear error since fallback worked
        return;
      }
    } catch (fallbackErr) {
      console.error("Fallback search also failed:", fallbackErr);
    }
    
    // Final fallback to mock data with correct AND logic filtering
    const mockExperts = generateMockExperts(searchTerm, selectedTechnologies);
    
    // Filter mock data to simulate AND logic
    const filteredMockExperts = mockExperts.filter(expert => {
      if (selectedTechnologies.length > 0) {
        // Check if expert has ALL selected technologies (case-insensitive)
        return selectedTechnologies.every(tech => 
          expert.skills?.some(skill => 
            skill.toLowerCase().includes(tech.toLowerCase()) ||
            tech.toLowerCase().includes(skill.toLowerCase())
          )
        );
      }
      // If no technologies selected but search term has comma, filter by terms
      if (searchTerm.includes(',')) {
        const searchTerms = searchTerm.split(',').map(term => term.trim().toLowerCase());
        return searchTerms.every(term => 
          expert.name.toLowerCase().includes(term) ||
          expert.role.toLowerCase().includes(term) ||
          expert.skills?.some(skill => skill.toLowerCase().includes(term)) ||
          expert.experience.toLowerCase().includes(term)
        );
      }
      return true;
    });
    
    setSearchResults(filteredMockExperts);
    setSearchStats({
      totalResults: filteredMockExperts.length,
      currentPage: 0,
      totalPages: 1
    });
    
    setError("Backend search failed, showing filtered mock data. Error: " + (err instanceof Error ? err.message : 'Unknown error'));
  } finally {
    setIsLoading(false);
  }
};

  // --- Main Search Function (Updated with AND logic detection) --- 
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

    // If no search criteria at all, show featured experts
    if (params.toString() === '') {
      setSearchResults(featuredExperts);
      setSearchStats({
        totalResults: featuredExperts.length,
        currentPage: 0,
        totalPages: 1
      });
      setIsLoading(false);
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
    
    const normalizedExperts = candidates.map(normalizeCandidate);
    setSearchResults(normalizedExperts);
    setSearchStats({
      totalResults,
      currentPage,
      totalPages
    });

  } catch (err) {
    console.error("Search error:", err);
    
    // Fallback to mock data
    const mockExperts = generateMockExperts(searchTerm, selectedTechnologies);
    setSearchResults(mockExperts);
    setSearchStats({
      totalResults: mockExperts.length,
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

  // Add this helper function
  const handleSearchResponse = (data: any) => {
    console.log("Search response:", data);
    
    // Handle the response - Spring Data Page format
    if (data.content && Array.isArray(data.content)) {
      const normalizedExperts = data.content.map(normalizeCandidate);
      setSearchResults(normalizedExperts);
      setSearchStats({
        totalResults: data.totalElements || 0,
        currentPage: data.number || 0,
        totalPages: data.totalPages || 0
      });
    } 
    // Handle array response
    else if (Array.isArray(data)) {
      const normalizedExperts = data.map(normalizeCandidate);
      setSearchResults(normalizedExperts);
      setSearchStats({
        totalResults: normalizedExperts.length,
        currentPage: 0,
        totalPages: 1
      });
    }
    // Handle custom response format
    else if (data.results && Array.isArray(data.results)) {
      const normalizedExperts = data.results.map(normalizeCandidate);
      setSearchResults(normalizedExperts);
      setSearchStats({
        totalResults: data.total || data.totalElements || normalizedExperts.length,
        currentPage: data.page || 0,
        totalPages: data.totalPages || 1
      });
    } else {
      // Fallback to empty results
      setSearchResults([]);
      setSearchStats({
        totalResults: 0,
        currentPage: 0,
        totalPages: 0
      });
    }
  };

  // Enhanced search handler in LandingPage.tsx
// In LandingPage.tsx, update the handleAdvancedSearch function:
const handleAdvancedSearch = async () => {
  setIsLoading(true);
  setError(null);
  setHasSearched(true);

  try {
    // Build search request with proper AND logic for cross-field filtering
    const searchRequest: any = {
      searchTerm: searchTerm.trim(),
      searchType: "AND", // Force AND for cross-field filtering
      page: 0,
      size: 12
    };

    // Handle technologies (comma-separated)
    if (selectedTechnologies.length > 0) {
      searchRequest.technologies = selectedTechnologies.join(',');
    }
    
    // Handle domain experience
    if (domainExperience.trim()) {
      searchRequest.domainExperience = domainExperience.trim();
    }
    
    // Handle location fields - use AND between different location fields
    const locationFilters = [];
    if (city.trim()) {
      searchRequest.city = city.trim();
      locationFilters.push(`City: ${city.trim()}`);
    }
    if (country.trim()) {
      searchRequest.country = country.trim();
      locationFilters.push(`Country: ${country.trim()}`);
    }
    if (region.trim()) {
      searchRequest.region = region.trim();
      locationFilters.push(`Region: ${region.trim()}`);
    }
    
    // Handle experience range
    if (minExperience !== '') searchRequest.minExperience = Number(minExperience);
    if (maxExperience !== '') searchRequest.maxExperience = Number(maxExperience);

    console.log("Advanced search request:", searchRequest);

    // Use the v2 search endpoint which supports AND logic
    const response = await fetch(`${API_BASE_URL}/candidates/search/v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(searchRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search failed: ${response.status} - ${errorText}`);
    }

    const searchResponse = await response.json();
    
    console.log("Search response:", searchResponse);
    
    const candidates = searchResponse.results?.content || 
                      searchResponse.content || 
                      searchResponse.results || [];
    
    const normalizedExperts = candidates.map(normalizeCandidate);
    
    setSearchResults(normalizedExperts);
    setSearchStats({
      totalResults: searchResponse.metadata?.totalResults || 
                    searchResponse.totalElements || 
                    normalizedExperts.length,
      currentPage: searchResponse.metadata?.currentPage || 
                   searchResponse.number || 0,
      totalPages: searchResponse.metadata?.totalPages || 
                  searchResponse.totalPages || 1
    });

  } catch (err) {
    handleSearchError(err);
  } finally {
    setIsLoading(false);
  }
};

  // Update the handleKeyDown function to ensure it uses the right function
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(hasActiveAdvancedFilters());
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

  // --- NEW: Check if we're using AND logic for search hint ---
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
          <p className="mt-2 text-primary">Searching for experts...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container mx-auto px-4 max-w-6xl">
          <Card className="p-6 bg-red-50 border-red-300 mt-8">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="h-5 w-5" />
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
          <h3 className="mt-4 text-lg font-semibold">No Experts Found</h3>
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
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Search Results ({searchStats?.totalResults || searchResults.length})
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
            {searchResults.map((expert) => (
              <ExpertCard 
                key={expert.id} 
                {...expert}
                skills={expert.skills || []}
              />
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="font-semibold">TalentHub</h1>
            <nav className="hidden md:flex gap-6">
              <a href="#experts" className="text-sm hover:text-primary">
                Find Talent
              </a>
              <a href="#how-it-works" className="text-sm hover:text-primary">
                How it Works
              </a>
              <a href="#testimonials" className="text-sm hover:text-primary">
                Testimonials
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="max-w-4xl mx-auto mb-6">
            Connect with Certified Low-Code Experts
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            The leading marketplace for Appian, OutSystems, Mendix, Pega, and
            Power Apps talent. Hire verified experts or join as a certified
            professional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link to="/auth">
                Hire Talent <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">Join as Expert</Link>
            </Button>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-3xl mx-auto">
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
                  onClick={() => handleSearch(hasActiveAdvancedFilters())}
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
                {platformSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => {
                      setSearchTerm(skill);
                      handleSearch(false);
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
              
              {/* Advanced Filters */}
              {renderAdvancedFilters()}
            </Card>
          </div>
        </div>
      </section>
      
      {/* Search Results */}
      {renderSearchResults()}

      {/* Featured Experts (only when no search) */}
      {!hasSearched && (
        <section id="experts" className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="mb-4">Featured Experts</h2>
              <p className="text-muted-foreground">
                Top-rated certified professionals ready to work on your projects
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredExperts.map((expert) => (
                <ExpertCard key={expert.id} {...expert} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/client/browse">
                  View All Experts <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Get started in 4 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step} className="p-6 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3">
                    {item.step}
                  </div>
                  <h3 className="mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground">
              Trusted by companies worldwide
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm mb-4">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">TalentHub</h3>
              <p className="text-sm text-muted-foreground">
                The leading marketplace for low-code talent
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Browse Talent</a></li>
                <li><a href="#" className="hover:text-foreground">Post Requirement</a></li>
                <li><a href="#" className="hover:text-foreground">How it Works</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Experts</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Join as Expert</a></li>
                <li><a href="#" className="hover:text-foreground">Find Jobs</a></li>
                <li><a href="#" className="hover:text-foreground">Success Stories</a></li>
                <li><a href="#" className="hover:text-foreground">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 TalentHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}