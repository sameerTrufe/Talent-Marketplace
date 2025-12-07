import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SkillBadge } from "./SkillBadge";
import { MapPin, Star, Heart } from "lucide-react";
import { Link } from "react-router";

interface ExpertCardProps {
  id: string;
  name: string;
  image: string;
  role: string;
  location: string;
  rating: number;
  reviews: number;
  rate: string;
  skills?: string[]; // Make skills optional
  experience: string;
  availability?: string;
  showActions?: boolean;
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
  skills = [], // Default to empty array
  experience,
  availability,
  showActions = false,
}: ExpertCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{name}</h3>
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
          
          {/* Skills section with better handling */}
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
            <div className="text-right">
              <p className="font-semibold">{rate}</p>
              <p className="text-sm text-muted-foreground">per hour</p>
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2 mt-4">
              <Button asChild className="flex-1">
                <Link to={`/client/resource/${id}`}>View Profile</Link>
              </Button>
              <Button variant="outline" className="flex-1">
                Shortlist
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}