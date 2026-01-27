import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { 
  ArrowLeft,
  Save,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Plus,
  X,
  Calendar,
  Building
} from 'lucide-react';
import { CandidateService } from '@/lib/api/CandidateService';
import { toast } from 'sonner';
import { Badge } from '../../../ui/badge';

const CandidateProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Enhanced form data structure with arrays for related entities
  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    email: '',
    phone: '',
    title: '',
    location: '',
    summary: '',
    
    // Arrays for related entities
    technologies: [] as Array<{
      techName: string;
      proficiency?: string;
      skillType?: string;
      yearsOfExperience?: number;
      lastUsedYear?: number;
    }>,
    
    certifications: [] as Array<{
      certName: string;
      issuer: string;
      yearObtained: number;
    }>,
    
    educations: [] as Array<{
      degree: string;
      college: string;
      university: string;
      yearOfPassing: number;
    }>,
    
    workExperiences: [] as Array<{
      company: string;
      role: string;
      startDate: string;
      endDate: string;
      responsibilities: string;
      isCurrent: boolean;
      projectTitle?: string;
      projectRole?: string;
      clientName?: string;
      teamSize?: number;
      technologiesUsed?: string;
      keyAchievements?: string;
    }>,
    
    awardsAchievements: [] as Array<{
      awardName: string;
      awardType: string;
      issuingOrganization: string;
      issueDate: string;
      description: string;
    }>,
    
    // Additional candidate fields
    city: '',
    country: '',
    region: '',
    totalExperienceYears: 0,
    domainExperience: '',
    college: '',
    university: '',
    
    // Availability fields
    availabilityStatus: '',
    noticePeriodDays: 30,
    earliestStartDate: '',
    currentCompany: '',
    currentCompanyTenureMonths: 0,
    lastCompanyTenureMonths: 0,
    isWillingToBuyoutNotice: false
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [skillType, setSkillType] = useState('PRIMARY');
  const [yearsOfExperience, setYearsOfExperience] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await CandidateService.getCandidateProfile();
      setProfile(profileData);
      
      // Pre-fill form with structured data
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        title: profileData.title || '',
        location: profileData.location || '',
        summary: profileData.summary || '',
        
        technologies: profileData.technologies || [],
        certifications: profileData.certifications || [],
        educations: profileData.educations || [],
        workExperiences: profileData.workExperiences || [],
        awardsAchievements: profileData.awardsAchievements || [],
        
        city: profileData.city || '',
        country: profileData.country || '',
        region: profileData.region || '',
        totalExperienceYears: profileData.totalExperienceYears || 0,
        domainExperience: profileData.domainExperience || '',
        college: profileData.college || '',
        university: profileData.university || '',
        
        availabilityStatus: profileData.availabilityStatus || '',
        noticePeriodDays: profileData.noticePeriodDays || 30,
        earliestStartDate: profileData.earliestStartDate || '',
        currentCompany: profileData.currentCompany || '',
        currentCompanyTenureMonths: profileData.currentCompanyTenureMonths || 0,
        lastCompanyTenureMonths: profileData.lastCompanyTenureMonths || 0,
        isWillingToBuyoutNotice: profileData.isWillingToBuyoutNotice || false
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare structured data for API
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        location: formData.location,
        summary: formData.summary,
        
        // Parse location into city, country, region
        city: formData.city || extractCity(formData.location),
        country: formData.country || extractCountry(formData.location),
        region: formData.region,
        
        // Professional information
        totalExperienceYears: formData.totalExperienceYears,
        domainExperience: formData.domainExperience,
        college: formData.college,
        university: formData.university,
        
        // Arrays for related entities
        technologies: formData.technologies.map(tech => ({
          techName: tech.techName,
          skillType: tech.skillType || 'PRIMARY',
          yearsOfExperience: tech.yearsOfExperience,
          lastUsedYear: tech.lastUsedYear
        })),
        
        certifications: formData.certifications.map(cert => ({
          certName: cert.certName,
          issuer: cert.issuer,
          yearObtained: cert.yearObtained
        })),
        
        educations: formData.educations.map(edu => ({
          degree: edu.degree,
          college: edu.college,
          university: edu.university,
          yearOfPassing: edu.yearOfPassing
        })),
        
        workExperiences: formData.workExperiences.map(exp => ({
          company: exp.company,
          role: exp.role,
          startDate: exp.startDate,
          endDate: exp.endDate,
          responsibilities: exp.responsibilities,
          isCurrent: exp.isCurrent,
          projectTitle: exp.projectTitle,
          projectRole: exp.projectRole,
          clientName: exp.clientName,
          teamSize: exp.teamSize,
          technologiesUsed: exp.technologiesUsed,
          keyAchievements: exp.keyAchievements
        })),
        
        awardsAchievements: formData.awardsAchievements.map(award => ({
          awardName: award.awardName,
          awardType: award.awardType,
          issuingOrganization: award.issuingOrganization,
          issueDate: award.issueDate,
          description: award.description
        })),
        
        // Availability fields
        availabilityStatus: formData.availabilityStatus,
        noticePeriodDays: formData.noticePeriodDays,
        earliestStartDate: formData.earliestStartDate,
        currentCompany: formData.currentCompany,
        currentCompanyTenureMonths: formData.currentCompanyTenureMonths,
        lastCompanyTenureMonths: formData.lastCompanyTenureMonths,
        isWillingToBuyoutNotice: formData.isWillingToBuyoutNotice
      };

      await CandidateService.updateCandidateProfile(updateData);
      toast.success('Profile updated successfully');
      navigate('/candidate/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (section: string, index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item: any, i: number) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = (section: string, defaultValue: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], defaultValue]
    }));
  };

  const removeItem = (section: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_: any, i: number) => i !== index)
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim()) {
      addItem('technologies', {
        techName: currentSkill.trim(),
        skillType: skillType,
        yearsOfExperience: yearsOfExperience ? parseFloat(yearsOfExperience) : undefined
      });
      setCurrentSkill('');
      setYearsOfExperience('');
    }
  };

  const extractCity = (location: string) => {
    if (!location) return '';
    const parts = location.split(',').map(p => p.trim());
    return parts[0] || '';
  };

  const extractCountry = (location: string) => {
    if (!location) return '';
    const parts = location.split(',').map(p => p.trim());
    return parts[parts.length - 1] || '';
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/candidate/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">Update your personal and professional information</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </CardTitle>
                <CardDescription>Your career details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Senior Appian Developer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="totalExperienceYears">Total Experience (Years)</Label>
                  <Input
                    id="totalExperienceYears"
                    name="totalExperienceYears"
                    type="number"
                    value={formData.totalExperienceYears}
                    onChange={handleChange}
                    placeholder="5"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="domainExperience">Domain Experience</Label>
                  <Input
                    id="domainExperience"
                    name="domainExperience"
                    value={formData.domainExperience}
                    onChange={handleChange}
                    placeholder="BFSI, Healthcare, Retail"
                  />
                </div>
                <div>
                  <Label htmlFor="currentCompany">Current Company</Label>
                  <Input
                    id="currentCompany"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleChange}
                    placeholder="Current company name"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills/Technologies */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Skills & Technologies
                </CardTitle>
                <CardDescription>Add your technical skills and proficiency levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add new skill */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <Label htmlFor="newSkill">Add Skill</Label>
                      <Input
                        id="newSkill"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        placeholder="Enter a skill (e.g., Appian, Java, React)"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                    </div>
                    <div className="w-40">
                      <Label htmlFor="skillType">Skill Type</Label>
                      <select
                        id="skillType"
                        className="w-full h-10 px-3 py-2 border rounded-md"
                        value={skillType}
                        onChange={(e) => setSkillType(e.target.value)}
                      >
                        <option value="PRIMARY">Primary</option>
                        <option value="SECONDARY">Secondary</option>
                        <option value="TOOL">Tool</option>
                      </select>
                    </div>
                    <div className="w-32">
                      <Label htmlFor="yearsOfExperience">Years of Exp</Label>
                      <Input
                        id="yearsOfExperience"
                        type="number"
                        step="0.5"
                        min="0"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)}
                        placeholder="Years"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" onClick={addSkill} className="h-10">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Display skills */}
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tech.techName}
                        {tech.skillType && (
                          <span className="text-xs opacity-75">({tech.skillType})</span>
                        )}
                        {tech.yearsOfExperience && (
                          <span className="text-xs opacity-75">· {tech.yearsOfExperience}y</span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeItem('technologies', index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Work Experience
                </CardTitle>
                <CardDescription>Add your work history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {formData.workExperiences.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Experience #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('workExperiences', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Company *</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => handleNestedChange('workExperiences', index, 'company', e.target.value)}
                            placeholder="Company name"
                            required
                          />
                        </div>
                        <div>
                          <Label>Role *</Label>
                          <Input
                            value={exp.role}
                            onChange={(e) => handleNestedChange('workExperiences', index, 'role', e.target.value)}
                            placeholder="Job title"
                            required
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => handleNestedChange('workExperiences', index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => handleNestedChange('workExperiences', index, 'endDate', e.target.value)}
                            disabled={exp.isCurrent}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Responsibilities</Label>
                          <Textarea
                            value={exp.responsibilities}
                            onChange={(e) => handleNestedChange('workExperiences', index, 'responsibilities', e.target.value)}
                            placeholder="Describe your responsibilities"
                            rows={3}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`isCurrent-${index}`}
                              checked={exp.isCurrent}
                              onChange={(e) => handleNestedChange('workExperiences', index, 'isCurrent', e.target.checked)}
                            />
                            <Label htmlFor={`isCurrent-${index}`}>Current Employment</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addItem('workExperiences', {
                      company: '',
                      role: '',
                      startDate: '',
                      endDate: '',
                      responsibilities: '',
                      isCurrent: false
                    })}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Work Experience
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
                <CardDescription>Your educational background</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.educations.map((edu, index) => (
                    <div key={index} className="p-3 border rounded space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium">{edu.degree}</div>
                          <div className="text-sm text-muted-foreground">
                            {edu.college}, {edu.university}
                          </div>
                          {edu.yearOfPassing && (
                            <div className="text-xs">Passed: {edu.yearOfPassing}</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem('educations', index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addItem('educations', {
                      degree: '',
                      college: '',
                      university: '',
                      yearOfPassing: new Date().getFullYear()
                    })}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications
                </CardTitle>
                <CardDescription>Your professional certifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="p-3 border rounded space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium">{cert.certName}</div>
                          <div className="text-sm text-muted-foreground">
                            {cert.issuer}
                          </div>
                          {cert.yearObtained && (
                            <div className="text-xs">Obtained: {cert.yearObtained}</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem('certifications', index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addItem('certifications', {
                      certName: '',
                      issuer: '',
                      yearObtained: new Date().getFullYear()
                    })}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Professional Summary
                </CardTitle>
                <CardDescription>Briefly describe your experience and expertise</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Experienced software developer with 5+ years in enterprise applications..."
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/candidate/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfileEdit;