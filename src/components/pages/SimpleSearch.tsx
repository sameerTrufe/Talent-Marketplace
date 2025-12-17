import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { ExpertCard } from "../ExpertCard";
import { Loader2, Search, X } from "lucide-react";

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

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8080/api' 
  : '/api';

export function SimpleSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Normalize candidate data
  const normalizeCandidate = (candidate: any): Expert => {
    const skills = candidate.technologies || candidate.skills || [];
    
    let hourlyRate = candidate.rate;
    if (!hourlyRate && candidate.experience) {
      const expMatch = candidate.experience.match(/\d+/);
      if (expMatch) {
        const expYears = parseInt(expMatch[0]);
        hourlyRate = `$${Math.min(expYears * 10 + 50, 200)}`;
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

  // Simple search function using OR logic
  const handleSimpleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Use the existing search endpoint but force OR logic
      const params = new URLSearchParams();
      params.append("q", searchTerm.trim());
      params.append("searchType", "OR"); // Force OR logic
      params.append("page", "0");
      params.append("size", "50");

      // In SimpleSearch.tsx, update the fetch URL:
const response = await fetch(
  `${API_BASE_URL}/candidates/simple-or-search?q=${encodeURIComponent(searchTerm.trim())}&page=0&size=50`,
  {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  }
);

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      let candidates = [];
      if (data.content && Array.isArray(data.content)) {
        candidates = data.content;
      } else if (Array.isArray(data)) {
        candidates = data;
      } else if (data.results && Array.isArray(data.results.content)) {
        candidates = data.results.content;
      } else if (data.results && Array.isArray(data.results)) {
        candidates = data.results;
      }

      const normalizedExperts = candidates.map(normalizeCandidate);
      setResults(normalizedExperts);

      if (normalizedExperts.length === 0) {
        setError("No candidates found. Try a different search term.");
      }

    } catch (err) {
      console.error("Simple search error:", err);
      setError("Failed to search. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear search
  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setError(null);
    setHasSearched(false);
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSimpleSearch();
    }
  };

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      {/* Search Box */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Enter any search term (name, skill, location, etc.)"
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
          onClick={handleSimpleSearch}
          disabled={isLoading || !searchTerm.trim()}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search All
        </Button>
      </div>

      {/* Search Hint */}
      {searchTerm && (
        <div className="text-sm text-muted-foreground mb-4 text-center">
          ⓘ Using OR logic - searching across all fields for: "{searchTerm}"
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-300 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </Card>
      )}

      {/* Results */}
      {hasSearched && !isLoading && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">
              Simple Search Results ({results.length})
            </h3>
            {results.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {results.length === 0 && !error ? (
            <Card className="p-8 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Results Found</h3>
              <p className="text-muted-foreground">
                Try searching with different terms
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((expert) => (
                <ExpertCard 
                  key={expert.id} 
                  {...expert}
                  skills={expert.skills || []}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center mt-8 p-4">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-primary">Searching all candidates...</p>
        </div>
      )}
    </div>
  );
}