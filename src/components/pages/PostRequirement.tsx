import { Sidebar } from "../Sidebar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MessageSquare, Upload, Plus, X } from "lucide-react";
import { useState } from "react";

export function PostRequirement() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Appian",
    "BPM",
  ]);
  const [files, setFiles] = useState<string[]>([]);

  const availableSkills = [
    "Appian",
    "OutSystems",
    "Mendix",
    "Pega",
    "Power Apps",
    "BPM",
    "Integration",
    "Mobile Apps",
    "Process Mining",
    "Analytics",
  ];

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="client" />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1>Post Requirement</h1>
              <p className="text-muted-foreground">
                Describe your project and find the perfect expert
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
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

        <div className="p-6 max-w-4xl mx-auto">
          <Card className="p-8">
            <form className="space-y-6">
              {/* Project Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Appian Developer for BPM Project"
                />
                <p className="text-sm text-muted-foreground">
                  Write a clear, descriptive title for your project
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="Describe your project requirements, objectives, and deliverables..."
                />
                <p className="text-sm text-muted-foreground">
                  Minimum 100 characters. Be specific about what you need.
                </p>
              </div>

              {/* Required Skills */}
              <div className="space-y-2">
                <Label>Required Skills *</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-lg mb-2">
                  {selectedSkills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full"
                    >
                      <span className="text-sm">{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Select onValueChange={addSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add skills..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills
                      .filter((skill) => !selectedSkills.includes(skill))
                      .map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Engagement Model */}
              <div className="space-y-2">
                <Label htmlFor="engagement">Engagement Model *</Label>
                <Select>
                  <SelectTrigger id="engagement">
                    <SelectValue placeholder="Select engagement model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="full-time">Full-Time</SelectItem>
                    <SelectItem value="project">Project-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Budget */}
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range *</Label>
                  <div className="flex gap-2">
                    <Input id="budget-min" placeholder="Min" type="number" />
                    <span className="flex items-center">-</span>
                    <Input id="budget-max" placeholder="Max" type="number" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter range in USD per hour/month
                  </p>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <Label htmlFor="timeline">Project Timeline *</Label>
                  <Select>
                    <SelectTrigger id="timeline">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3-months">1-3 months</SelectItem>
                      <SelectItem value="3-6-months">3-6 months</SelectItem>
                      <SelectItem value="6-12-months">6-12 months</SelectItem>
                      <SelectItem value="12-months">12+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Experience Level */}
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level *</Label>
                  <Select>
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">
                        Junior (0-2 years)
                      </SelectItem>
                      <SelectItem value="intermediate">
                        Intermediate (3-5 years)
                      </SelectItem>
                      <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                      <SelectItem value="expert">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="start-date">Preferred Start Date *</Label>
                  <Input id="start-date" type="date" />
                </div>
              </div>

              {/* Location Preference */}
              <div className="space-y-2">
                <Label htmlFor="location">Location Preference</Label>
                <Select>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location (Remote)</SelectItem>
                    <SelectItem value="us">United States Only</SelectItem>
                    <SelectItem value="europe">Europe Only</SelectItem>
                    <SelectItem value="asia">Asia Only</SelectItem>
                    <SelectItem value="specific">Specific Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Upload Files */}
              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, or images up to 10MB
                  </p>
                </div>
                {files.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="text-sm">{file}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setFiles(files.filter((_, i) => i !== index))
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  placeholder="Any additional information or specific requirements..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t">
                <Button type="button" variant="outline" className="flex-1">
                  Save as Draft
                </Button>
                <Button type="submit" className="flex-1">
                  Post Requirement
                </Button>
              </div>
            </form>
          </Card>

          {/* Tips */}
          <Card className="p-6 mt-6 bg-muted/50">
            <h3 className="mb-3">Tips for a Great Job Post</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Be specific about your requirements and expectations
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Include project scope, timeline, and budget range</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  List all required skills and certifications clearly
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Mention any tools, platforms, or technologies to be used
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Describe your company and what makes this opportunity unique
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
