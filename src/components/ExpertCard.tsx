import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SkillBadge } from "./SkillBadge";
import { MapPin, Star, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom"; // Changed from react-router to react-router-dom

interface ExpertCardProps {
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
  availability?: string;
  showActions?: boolean;
  showProfileLink?: boolean; // Add this new prop
}

export function ExpertCard({
  id,
  name,
  image,
  role,
  location,
  rating,
  reviews,
  rate,
  skills = [],
  experience,
  availability,
  showActions = false,
  showProfileLink = true, // Default to true
}: ExpertCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow relative">
      {/* View Profile Button - Always visible */}
      {showProfileLink && (
        <div className="absolute top-3 right-3 z-10">
          <Button 
            asChild 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <Link to={`/client/resource/${id}`} title="View Profile">
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
      
      <div className="flex gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-muted-foreground">{role}</p>
            </div>
            {showActions && (
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {location}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {rating.toFixed(1)} ({reviews})
            </div>
          </div>
          
          {/* Skills section */}
          <div className="mt-3">
            {Array.isArray(skills) && skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 3).map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
                {skills.length > 3 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{skills.length - 3} more
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No skills listed</span>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-sm text-muted-foreground">{experience}</p>
              {availability && (
                <p className="text-sm text-green-600 mt-1">{availability}</p>
              )}
            </div>
            <div className="text-lg font-semibold text-primary">
              {rate}
            </div>
          </div>
          
          {/* Action Buttons - Only when showActions is true */}
          {showActions && (
            <div className="flex gap-2 mt-4">
              <Button asChild className="flex-1">
                <Link to={`/client/resource/${id}`}>
                  View Profile
                </Link>
              </Button>
              <Button variant="outline" className="flex-1">
                Shortlist
              </Button>
            </div>
          )}
          
          {/* Small View Profile Link for non-showActions mode */}
          {!showActions && showProfileLink && (
            <div className="mt-4 pt-3 border-t">
              <Button 
                asChild 
                variant="ghost" 
                size="sm" 
                className="w-full"
              >
                <Link to={`/client/resource/${id}`} className="flex items-center justify-center gap-2">
                  <Eye className="h-3 w-3" />
                  View Full Profile
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}