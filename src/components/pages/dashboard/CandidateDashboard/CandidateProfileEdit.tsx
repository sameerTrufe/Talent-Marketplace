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
  Building,
  Trash2,
  Edit
} from 'lucide-react';
import { CandidateService } from '@/lib/api/CandidateService';
import { toast } from 'sonner';
import { Badge } from '../../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';

const CandidateProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
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
      id?: number;
      techName: string;
      proficiency?: string;
      skillType?: string;
      yearsOfExperience?: number;
      lastUsedYear?: number;
    }>,
    
    certifications: [] as Array<{
      id?: number;
      certName: string;
      issuer: string;
      yearObtained: number;
    }>,
    
    educations: [] as Array<{
      id?: number;
      degree: string;
      college: string;
      university: string;
      yearOfPassing: number;
    }>,
    
    workExperiences: [] as Array<{
      id?: number;
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
      id?: number;
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
    availabilityStatus: 'IMMEDIATE' as 'IMMEDIATE' | 'NOTICE_PERIOD' | 'AVAILABLE_SOON' | 'NOT_AVAILABLE',
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
  const [lastUsedYear, setLastUsedYear] = useState('');
  
  // New education form
  const [newEducation, setNewEducation] = useState({
    degree: '',
    college: '',
    university: '',
    yearOfPassing: new Date().getFullYear()
  });
  
  // New certification form
  const [newCertification, setNewCertification] = useState({
    certName: '',
    issuer: '',
    yearObtained: new Date().getFullYear()
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      const profileData = await CandidateService.getCandidateProfileForEdit();
      console.log('DEBUG - Loaded profile data:', {
        name: profileData.name,
        email: profileData.email,
        technologiesCount: profileData.technologies?.length,
        workExperiencesCount: profileData.workExperiences?.length,
        educationsCount: profileData.educations?.length,
        certificationsCount: profileData.certifications?.length,
        fullData: profileData
      });
      
      setProfile(profileData);
      
      // Transform the data for form state - PRESERVE IDs
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        title: profileData.title || '',
        summary: profileData.summary || '',
        location: profileData.location || '',
        
        // Arrays for related entities - WITH IDs
        technologies: profileData.technologies?.map(tech => ({
          id: tech.id,
          techName: tech.techName || '',
          skillType: tech.skillType || 'PRIMARY',
          yearsOfExperience: tech.yearsOfExperience || 0,
          lastUsedYear: tech.lastUsedYear
        })) || [],
        
        certifications: profileData.certifications?.map(cert => ({
          id: cert.id,
          certName: cert.certName || '',
          issuer: cert.issuer || '',
          yearObtained: cert.yearObtained || new Date().getFullYear()
        })) || [],
        
        educations: profileData.educations?.map(edu => ({
          id: edu.id,
          degree: edu.degree || '',
          college: edu.college || '',
          university: edu.university || '',
          yearOfPassing: edu.yearOfPassing || new Date().getFullYear()
        })) || [],
        
        workExperiences: profileData.workExperiences?.map(exp => ({
          id: exp.id,
          company: exp.company || '',
          role: exp.role || '',
          startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
          endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
          responsibilities: exp.responsibilities || '',
          isCurrent: exp.isCurrent || false,
          projectTitle: exp.projectTitle,
          projectRole: exp.projectRole,
          clientName: exp.clientName,
          teamSize: exp.teamSize,
          technologiesUsed: exp.technologiesUsed,
          keyAchievements: exp.keyAchievements
        })) || [],
        
        awardsAchievements: profileData.awardsAchievements?.map(award => ({
          id: award.id,
          awardName: award.awardName || '',
          awardType: award.awardType || '',
          issuingOrganization: award.issuingOrganization || '',
          issueDate: award.issueDate ? new Date(award.issueDate).toISOString().split('T')[0] : '',
          description: award.description || ''
        })) || [],
        
        // Location breakdown
        city: profileData.city || '',
        country: profileData.country || '',
        region: profileData.region || '',
        
        // Professional info
        totalExperienceYears: profileData.totalExperienceYears || 0,
        domainExperience: profileData.domainExperience || '',
        college: profileData.college || '',
        university: profileData.university || '',
        
        // Availability fields
        availabilityStatus: profileData.availabilityStatus || 'IMMEDIATE',
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

  const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('Current form data before submit:', {
        educationsCount: formData.educations.length,
        educations: formData.educations,
        certificationsCount: formData.certifications.length,
        certifications: formData.certifications
      });

      // Prepare structured data for API
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        summary: formData.summary,
        
        // Location fields
        city: formData.city,
        country: formData.country,
        region: formData.region,
        
        // Professional information
        totalExperienceYears: formData.totalExperienceYears || 0,
        domainExperience: formData.domainExperience,
        college: formData.college,
        university: formData.university,
        
        // Arrays for related entities
        technologies: formData.technologies.map(tech => ({
          id: tech.id, // May be undefined for new entries
          techName: tech.techName,
          skillType: tech.skillType || 'PRIMARY',
          yearsOfExperience: tech.yearsOfExperience || 0,
          lastUsedYear: tech.lastUsedYear
        })),
        
        // For new certifications without IDs, send without id field
        certifications: formData.certifications.map(cert => {
          const certData: any = {
            certName: cert.certName,
            issuer: cert.issuer,
            yearObtained: cert.yearObtained || new Date().getFullYear()
          };
          // Only include id if it exists (for existing entries)
          if (cert.id) {
            certData.id = cert.id;
          }
          return certData;
        }),
        
        // For new educations without IDs, send without id field
        educations: formData.educations.map(edu => {
          const eduData: any = {
            degree: edu.degree,
            college: edu.college,
            university: edu.university,
            yearOfPassing: edu.yearOfPassing || new Date().getFullYear()
          };
          // Only include id if it exists (for existing entries)
          if (edu.id) {
            eduData.id = edu.id;
          }
          return eduData;
        }),
        
        workExperiences: formData.workExperiences.map(exp => ({
          id: exp.id,
          company: exp.company,
          role: exp.role,
          startDate: formatDateForBackend(exp.startDate),
          endDate: formatDateForBackend(exp.endDate),
          responsibilities: exp.responsibilities,
          isCurrent: exp.isCurrent || false,
          projectTitle: exp.projectTitle,
          projectRole: exp.projectRole,
          clientName: exp.clientName,
          teamSize: exp.teamSize,
          technologiesUsed: exp.technologiesUsed,
          keyAchievements: exp.keyAchievements
        })),
        
        awardsAchievements: formData.awardsAchievements.map(award => ({
          id: award.id,
          awardName: award.awardName,
          awardType: award.awardType,
          issuingOrganization: award.issuingOrganization,
          issueDate: formatDateForBackend(award.issueDate),
          description: award.description
        })),
        
        // Availability fields
        availabilityStatus: formData.availabilityStatus || 'IMMEDIATE',
        noticePeriodDays: formData.noticePeriodDays || 30,
        earliestStartDate: formatDateForBackend(formData.earliestStartDate),
        currentCompany: formData.currentCompany,
        currentCompanyTenureMonths: formData.currentCompanyTenureMonths || 0,
        lastCompanyTenureMonths: formData.lastCompanyTenureMonths || 0,
        isWillingToBuyoutNotice: formData.isWillingToBuyoutNotice || false
      };

      console.log('Sending update data to backend:', {
        totalEducations: updateData.educations.length,
        educations: updateData.educations,
        totalCertifications: updateData.certifications.length,
        certifications: updateData.certifications
      });
      
      const response = await CandidateService.updateCandidateProfile(updateData);
      console.log('Profile update response:', response);
      
      toast.success('Profile updated successfully');
      
      // Reload the profile to get updated IDs
      await loadProfile();
      
      // Navigate back to dashboard
      navigate('/candidate/dashboard');
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.error || error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
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
    console.log(`Removing item from ${section} at index ${index}`);
    
    setFormData(prev => {
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [section]: newArray
      };
    });
    
    toast.success('Item removed successfully');
  };

  const addSkill = () => {
    if (currentSkill.trim()) {
      addItem('technologies', {
        techName: currentSkill.trim(),
        skillType: skillType,
        yearsOfExperience: yearsOfExperience ? parseFloat(yearsOfExperience) : 0,
        lastUsedYear: lastUsedYear ? parseInt(lastUsedYear) : undefined
      });
      setCurrentSkill('');
      setYearsOfExperience('');
      setLastUsedYear('');
      toast.success('Skill added successfully');
    } else {
      toast.error('Please enter a skill name');
    }
  };

  const handleAddEducation = () => {
    if (newEducation.degree.trim() && newEducation.college.trim()) {
      // Add new education WITHOUT id (backend will generate it)
      const educationToAdd = {
        degree: newEducation.degree,
        college: newEducation.college,
        university: newEducation.university,
        yearOfPassing: newEducation.yearOfPassing || new Date().getFullYear()
      };
      
      console.log('Adding new education:', educationToAdd);
      
      setFormData(prev => ({
        ...prev,
        educations: [...prev.educations, educationToAdd]
      }));
      
      // Reset form
      setNewEducation({
        degree: '',
        college: '',
        university: '',
        yearOfPassing: new Date().getFullYear()
      });
      
      toast.success('Education added successfully');
    } else {
      toast.error('Please fill in degree and college fields');
    }
  };

  const handleAddCertification = () => {
    if (newCertification.certName.trim() && newCertification.issuer.trim()) {
      // Add new certification WITHOUT id (backend will generate it)
      const certificationToAdd = {
        certName: newCertification.certName,
        issuer: newCertification.issuer,
        yearObtained: newCertification.yearObtained || new Date().getFullYear()
      };
      
      console.log('Adding new certification:', certificationToAdd);
      
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationToAdd]
      }));
      
      // Reset form
      setNewCertification({
        certName: '',
        issuer: '',
        yearObtained: new Date().getFullYear()
      });
      
      toast.success('Certification added successfully');
    } else {
      toast.error('Please fill in certification name and issuer fields');
    }
  };

  const handleNewEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: name === 'yearOfPassing' ? parseInt(value) || new Date().getFullYear() : value
    }));
  };

  const handleNewCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCertification(prev => ({
      ...prev,
      [name]: name === 'yearObtained' ? parseInt(value) || new Date().getFullYear() : value
    }));
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
                  <Label htmlFor="availabilityStatus">Availability Status</Label>
                  <Select
                    value={formData.availabilityStatus}
                    onValueChange={(value) => handleSelectChange('availabilityStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IMMEDIATE">Immediate</SelectItem>
                      <SelectItem value="NOTICE_PERIOD">Notice Period</SelectItem>
                      <SelectItem value="AVAILABLE_SOON">Available Soon</SelectItem>
                      <SelectItem value="NOT_AVAILABLE">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Education Section - FIXED */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
                <CardDescription>Your educational background</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* List of existing educations */}
                  {formData.educations.map((edu, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Education #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('educations', index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label>Degree *</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => handleNestedChange('educations', index, 'degree', e.target.value)}
                            placeholder="e.g., Bachelor of Engineering"
                            required
                          />
                        </div>
                        <div>
                          <Label>College *</Label>
                          <Input
                            value={edu.college}
                            onChange={(e) => handleNestedChange('educations', index, 'college', e.target.value)}
                            placeholder="College name"
                            required
                          />
                        </div>
                        <div>
                          <Label>University</Label>
                          <Input
                            value={edu.university}
                            onChange={(e) => handleNestedChange('educations', index, 'university', e.target.value)}
                            placeholder="University name"
                          />
                        </div>
                        <div>
                          <Label>Year of Passing</Label>
                          <Input
                            type="number"
                            value={edu.yearOfPassing}
                            onChange={(e) => handleNestedChange('educations', index, 'yearOfPassing', parseInt(e.target.value) || new Date().getFullYear())}
                            placeholder="2020"
                            min="1900"
                            max="2099"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add new education form */}
                  <div className="p-4 border-2 border-dashed rounded-lg space-y-4">
                    <h4 className="font-semibold">Add New Education</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="newDegree">Degree *</Label>
                        <Input
                          id="newDegree"
                          name="degree"
                          value={newEducation.degree}
                          onChange={handleNewEducationChange}
                          placeholder="e.g., Bachelor of Engineering"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newCollege">College *</Label>
                        <Input
                          id="newCollege"
                          name="college"
                          value={newEducation.college}
                          onChange={handleNewEducationChange}
                          placeholder="College name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newUniversity">University</Label>
                        <Input
                          id="newUniversity"
                          name="university"
                          value={newEducation.university}
                          onChange={handleNewEducationChange}
                          placeholder="University name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newYearOfPassing">Year of Passing</Label>
                        <Input
                          id="newYearOfPassing"
                          name="yearOfPassing"
                          type="number"
                          value={newEducation.yearOfPassing}
                          onChange={handleNewEducationChange}
                          placeholder="2020"
                          min="1900"
                          max="2099"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddEducation}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications Section - FIXED */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications
                </CardTitle>
                <CardDescription>Your professional certifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* List of existing certifications */}
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Certification #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('certifications', index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label>Certification Name *</Label>
                          <Input
                            value={cert.certName}
                            onChange={(e) => handleNestedChange('certifications', index, 'certName', e.target.value)}
                            placeholder="e.g., AWS Certified Solutions Architect"
                            required
                          />
                        </div>
                        <div>
                          <Label>Issuer *</Label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => handleNestedChange('certifications', index, 'issuer', e.target.value)}
                            placeholder="Issuing organization"
                            required
                          />
                        </div>
                        <div>
                          <Label>Year Obtained</Label>
                          <Input
                            type="number"
                            value={cert.yearObtained}
                            onChange={(e) => handleNestedChange('certifications', index, 'yearObtained', parseInt(e.target.value) || new Date().getFullYear())}
                            placeholder="2023"
                            min="1900"
                            max="2099"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add new certification form */}
                  <div className="p-4 border-2 border-dashed rounded-lg space-y-4">
                    <h4 className="font-semibold">Add New Certification</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="newCertName">Certification Name *</Label>
                        <Input
                          id="newCertName"
                          name="certName"
                          value={newCertification.certName}
                          onChange={handleNewCertificationChange}
                          placeholder="e.g., AWS Certified Solutions Architect"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newIssuer">Issuer *</Label>
                        <Input
                          id="newIssuer"
                          name="issuer"
                          value={newCertification.issuer}
                          onChange={handleNewCertificationChange}
                          placeholder="Issuing organization"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newYearObtained">Year Obtained</Label>
                        <Input
                          id="newYearObtained"
                          name="yearObtained"
                          type="number"
                          value={newCertification.yearObtained}
                          onChange={handleNewCertificationChange}
                          placeholder="2023"
                          min="1900"
                          max="2099"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddCertification}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </Button>
                  </div>
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
                    <div className="w-32">
                      <Label htmlFor="lastUsedYear">Last Used Year</Label>
                      <Input
                        id="lastUsedYear"
                        type="number"
                        min="2000"
                        max={new Date().getFullYear()}
                        value={lastUsedYear}
                        onChange={(e) => setLastUsedYear(e.target.value)}
                        placeholder="2024"
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
                        {tech.yearsOfExperience && tech.yearsOfExperience > 0 && (
                          <span className="text-xs opacity-75">· {tech.yearsOfExperience}y</span>
                        )}
                        {tech.lastUsedYear && (
                          <span className="text-xs opacity-75">· {tech.lastUsedYear}</span>
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
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfileEdit;