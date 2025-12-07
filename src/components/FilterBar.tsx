import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export function FilterBar() {
  const [showFilters, setShowFilters] = useState(true);
  const [rateRange, setRateRange] = useState([0, 200]);

  return (
    <div className="bg-background border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h3>Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <X className="h-4 w-4" /> : "Show"}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>Skill</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appian">Appian</SelectItem>
                <SelectItem value="outsystems">OutSystems</SelectItem>
                <SelectItem value="mendix">Mendix</SelectItem>
                <SelectItem value="pega">Pega</SelectItem>
                <SelectItem value="powerapps">Power Apps</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Experience</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2">0-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Location</Label>
            <Input placeholder="Enter location" />
          </div>

          <div>
            <Label>Availability</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                <SelectItem value="1month">1 month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <Label>Hourly Rate: ${rateRange[0]} - ${rateRange[1]}</Label>
            <Slider
              value={rateRange}
              onValueChange={setRateRange}
              max={200}
              step={10}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Certification</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select certification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="certified">Certified</SelectItem>
                <SelectItem value="advanced">Advanced Certified</SelectItem>
                <SelectItem value="expert">Expert Certified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button className="flex-1">Apply Filters</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </div>
      )}
    </div>
  );
}
