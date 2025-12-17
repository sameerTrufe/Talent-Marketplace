// SkillBadge.tsx
import { Badge } from "./ui/badge";

interface SkillBadgeProps {
  skill: string | { techName: string } | any;
  variant?: "default" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
}

export function SkillBadge({ skill, variant = "secondary", className = "", onClick }: SkillBadgeProps) {
  // Extract skill name from string or object
  const getSkillName = () => {
    if (typeof skill === 'string') {
      return skill;
    } else if (skill && typeof skill === 'object') {
      return skill.techName || skill.name || JSON.stringify(skill);
    }
    return String(skill);
  };
  
  const skillName = getSkillName();

  return (
    <Badge 
      variant={variant} 
      className={`px-3 py-1 ${className}`}
      onClick={onClick}
    >
      {skillName}
    </Badge>
  );
}