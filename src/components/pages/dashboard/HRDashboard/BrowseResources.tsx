import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from "../../../Sidebar";
import { Button } from "../../../ui/button";
import { Card } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Badge } from "../../../ui/badge";
import { ExpertCard } from "../../../ExpertCard";
import { SkillBadge } from "../../../SkillBadge";
import { Link } from "react-router-dom";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  X, 
  AlertCircle,
  Loader2,
  MapPin,
  Star,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";
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
  availability?: string;
  status?: string;
  email?: string;
  matchScore?: number;
  lastUpdated?: string;
  rate?: string;
}

// --- API Endpoint --- 
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8080/api' 
  : '/api';

export function BrowseResources() {
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
  const [availability, setAvailability] = useState("");
  const [certification, setCertification] = useState("");
  const [searchType, setSearchType] = useState<"AND" | "OR">("OR");
  const [techInput, setTechInput] = useState("");

  // --- Filter Options State ---
  const [filterOptions, setFilterOptions] = useState<{
    technologies: string[];
    locations: string[];
    regions: string[];
    experienceRange: [number, number];
    availabilities: string[];
    certifications: string[];
  }>({
    technologies: [],
    locations: [],
    regions: [],
    experienceRange: [0, 20],
    availabilities: ['Available Now', 'Available in 1 week', 'Available in 2 weeks', 'Available in 1 month'],
    certifications: ['Certified', 'Advanced Certified', 'Expert Certified']
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
        setFilterOptions(prev => ({
          ...prev,
          technologies: data.technologies || [],
          locations: data.locations || [],
          regions: data.regions || [],
          experienceRange: data.experienceRange || [0, 20]
        }));
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

    // Generate hourly rate if not present
    let rate = candidate.rate || candidate.hourlyRate;
    if (!rate) {
      const baseRate = 50 + Math.random() * 100;
      rate = `$${Math.round(baseRate)}`;
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
      availability: candidate.availability || 'Available Now',
      status: candidate.status || 'Available',
      email: candidate.email,
      matchScore: candidate.matchScore || Math.floor(Math.random() * 20) + 80,
      lastUpdated: candidate.lastUpdated || 'Recently',
      rate: rate
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
           country.trim() !== "" ||
           availability !== "" ||
           certification !== "";
  }, [selectedTechnologies, domainExperience, minExperience, maxExperience, region, city, country, availability, certification]);

  // --- Main Search Function ---
  const handleMainSearch = async () => {
    if (!searchTerm.trim() && !hasActiveAdvancedFilters()) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      console.log(`Searching for: ${searchTerm}`);
      
      // Check if we should use comma-separated AND search
      const shouldUseCommaAndSearch = 
        (searchTerm.includes(',') && searchTerm.trim().length >= 2) || 
        (selectedTechnologies.length > 1);
      
      if (shouldUseCommaAndSearch) {
        await handleCommaAndSearch();
        return;
      }

      // Build search parameters
      const params = new URLSearchParams();
      
      // Add search term if provided
      if (searchTerm.trim()) {
        params.append("q", searchTerm.trim());
      }

      // Add advanced filters if active
      if (hasActiveAdvancedFilters()) {
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
        // Note: availability and certification filters will be added when backend supports them
      }

      // If no search criteria at all, fetch all candidates
      if (params.toString() === '') {
        const response = await fetch(`${API_BASE_URL}/candidates?page=0&size=12`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          const candidates = data.content || data || [];
          const normalizedCandidates = candidates.map(normalizeCandidate);
          setSearchResults(normalizedCandidates);
          setSearchStats({
            totalResults: normalizedCandidates.length,
            currentPage: 0,
            totalPages: 1
          });
        }
        return;
      }

      // Build URL for search
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
      
      // Handle response structure
      let candidates = [];
      let totalResults = 0;
      let currentPage = 0;
      let totalPages = 0;
      
      if (data.results && Array.isArray(data.results.content)) {
        candidates = data.results.content;
        totalResults = data.metadata?.totalResults || data.results.totalElements || 0;
        currentPage = data.metadata?.currentPage || data.results.number || 0;
        totalPages = data.metadata?.totalPages || data.results.totalPages || 0;
      } else if (data.content && Array.isArray(data.content)) {
        candidates = data.content;
        totalResults = data.totalElements || 0;
        currentPage = data.number || 0;
        totalPages = data.totalPages || 0;
      } else if (Array.isArray(data)) {
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

      if (normalizedCandidates.length === 0) {
        setError("No resources found. Try a different search term.");
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

      // Use the comma-separated AND search endpoint
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
      
      // Handle response
      const candidates = searchResponse.results?.content || searchResponse.content || [];
      const normalizedCandidates = candidates.map(normalizeCandidate);
      
      setSearchResults(normalizedCandidates);
      setSearchStats({
        totalResults: searchResponse.metadata?.totalResults || 
                      searchResponse.results?.totalElements || 
                      normalizedCandidates.length,
        currentPage: searchResponse.metadata?.currentPage || 
                     searchResponse.results?.number || 0,
        totalPages: searchResponse.metadata?.totalPages || 
                    searchResponse.results?.totalPages || 1
      });

    } catch (err) {
      console.error("Comma AND search error:", err);
      
      // Fallback to mock data
      const mockCandidates = generateMockCandidates(searchTerm);
      
      // Filter mock data to simulate AND logic
      const filteredMockCandidates = mockCandidates.filter(candidate => {
        if (selectedTechnologies.length > 0) {
          return selectedTechnologies.every(tech => 
            candidate.skills?.some(skill => 
              skill.toLowerCase().includes(tech.toLowerCase()) ||
              tech.toLowerCase().includes(skill.toLowerCase())
            )
          );
        }
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
      
      setError("Backend search failed, showing filtered mock data.");
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
      'Pega Architect', 'Power Apps Consultant', 'Low-Code Platform Expert'
    ];
    
    const mockLocations = [
      'New York, USA', 'San Francisco, USA', 'Austin, USA',
      'London, UK', 'Mumbai, India', 'Singapore', 'Toronto, Canada'
    ];
    
    const mockSkills = [
      'Appian', 'OutSystems', 'Mendix', 'Pega', 'Power Apps',
      'BPM', 'Low-Code', 'Process Automation', 'UI/UX'
    ];

    const mockAvailabilities = ['Available Now', 'Available in 1 week', 'Available in 2 weeks', 'Available in 1 month'];
    
    return Array.from({ length: 6 }, (_, index) => ({
      id: `mock-${index}`,
      name: mockNames[index % mockNames.length],
      image: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&${index}`,
      role: mockRoles[index % mockRoles.length],
      location: mockLocations[index % mockLocations.length],
      rating: 4.5 + Math.random() * 0.5,
      reviews: Math.floor(Math.random() * 50) + 10, 
      skills: [mockSkills[index % mockSkills.length], ...mockSkills.slice(0, 2)],
      experience: `${5 + index % 5}+ years experience`,
      availability: mockAvailabilities[index % mockAvailabilities.length],
      status: 'Available',
      matchScore: Math.floor(Math.random() * 20) + 80,
      lastUpdated: 'Recently',
      rate: `$${Math.round(50 + Math.random() * 100)}`
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
    setAvailability("");
    setCertification("");
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
    if (!hasActiveAdvancedFilters()) return null;

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
          {availability && (
            <Badge variant="secondary" className="gap-1">
              Availability: {availability}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setAvailability("")} />
            </Badge>
          )}
          {certification && (
            <Badge variant="secondary" className="gap-1">
              Certification: {certification}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setCertification("")} />
            </Badge>
          )}
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

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium mb-2">Availability</label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="">Select Availability</option>
              {filterOptions.availabilities.map(avail => (
                <option key={avail} value={avail}>{avail}</option>
              ))}
            </select>
          </div>

          {/* Certification */}
          <div>
            <label className="block text-sm font-medium mb-2">Certification</label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={certification}
              onChange={(e) => setCertification(e.target.value)}
            >
              <option value="">Select Certification</option>
              {filterOptions.certifications.map(cert => (
                <option key={cert} value={cert}>{cert}</option>
              ))}
            </select>
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
            <Button onClick={handleMainSearch}>
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
          <p className="mt-2 text-primary">Searching for resources...</p>
        </div>
      );
    }

    if (error) {
      return (
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
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="text-center mt-8 p-8">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Resources Found</h3>
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
      <div className="mt-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{searchStats?.totalResults || searchResults.length}</span> results
            </p>
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

        {/* Active filters display */}
        {renderActiveFilters()}

        {/* Expert Cards Grid */}
        <div className="grid gap-6">
          {searchResults.map((expert) => (
            <ExpertCard 
              key={expert.id} 
              {...expert}
              skills={expert.skills || []}
              rate={expert.rate || "$95"}
              availability={expert.availability}
              showActions={true}
              showProfileLink={true}
            />
          ))}
        </div>

        {/* Pagination */}
        {searchStats && searchStats.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" disabled={searchStats.currentPage === 0}>
              Previous
            </Button>
            <Button variant="default">{searchStats.currentPage + 1}</Button>
            {searchStats.currentPage + 1 < searchStats.totalPages && (
              <Button variant="outline">{searchStats.currentPage + 2}</Button>
            )}
            {searchStats.currentPage + 2 < searchStats.totalPages && (
              <Button variant="outline">{searchStats.currentPage + 3}</Button>
            )}
            <Button variant="outline" disabled={searchStats.currentPage === searchStats.totalPages - 1}>
              Next
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="client" />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-2xl font-bold">Browse Resources</h1>
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
                <AvatarImage src={user?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"} />
                <AvatarFallback>{user?.name?.charAt(0) || 'C'}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 pb-6">
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
                  {showAdvancedFilters ? 'Hide' : 'Show'} Filters
                  {hasActiveAdvancedFilters() && (
                    <span className="ml-2 h-2 w-2 bg-white rounded-full"></span>
                  )}
                </Button>
              </div>
              
              {/* Quick search chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {['Appian', 'OutSystems', 'Mendix', 'Pega', 'Power Apps', 'AWS'].map((skill) => (
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
              
              {/* Advanced Filters */}
              {renderAdvancedFilters()}
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {hasSearched ? (
            renderSearchResults()
          ) : (
            <>
              {/* Default content when no search */}
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Find Your Perfect Resource</h2>
                <p className="text-muted-foreground mb-6">
                  Search for low-code experts by skills, experience, location, or use advanced filters
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("Appian Developer");
                      handleMainSearch();
                    }}
                  >
                    Search Appian Developers
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(true)}
                  >
                    Open Advanced Filters
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      handleMainSearch();
                    }}
                  >
                    Browse All Resources
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}