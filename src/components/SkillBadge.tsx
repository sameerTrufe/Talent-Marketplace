import { Badge } from "./ui/badge";

interface SkillBadgeProps {
  skill: string;
  variant?: "default" | "secondary" | "outline";
}

export function SkillBadge({ skill, variant = "secondary" }: SkillBadgeProps) {
  return (
    <Badge variant={variant} className="px-3 py-1">
      {skill}
    </Badge>
  );
}
