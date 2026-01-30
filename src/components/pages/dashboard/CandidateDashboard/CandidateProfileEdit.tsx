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
  Edit,
  ChevronDown,
  ChevronUp,
  Users,
  Package,
  Trophy
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
    
    // Location breakdown
    city: '',
    country: '',
    region: '',
    
    // Professional info
    totalExperienceYears: 0,
    domainExperience: '',
    college: '',
    university: '',
    
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
      noticePeriodServedDays?: number;
      rehireEligibility: boolean;
      // UI state for expanding/collapsing
      isExpanded?: boolean;
    }>,
    
    awardsAchievements: [] as Array<{
      id?: number;
      awardName: string;
      awardType: string;
      issuingOrganization: string;
      issueDate: string;
      description: string;
    }>,
    
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

  // New work experience form
  const [newWorkExperience, setNewWorkExperience] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
    isCurrent: false,
    // Project-related fields
    projectTitle: '',
    projectRole: '',
    clientName: '',
    teamSize: undefined as number | undefined,
    technologiesUsed: '',
    keyAchievements: '',
    noticePeriodServedDays: undefined as number | undefined,
    rehireEligibility: true,
    // UI state
    showProjectDetails: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      console.log('Loading profile data...');
      
      const profileData = await CandidateService.getCandidateProfileForEdit();
      console.log('Profile data loaded:', {
        name: profileData.name,
        email: profileData.email,
        technologiesCount: profileData.technologies?.length || 0,
        certificationsCount: profileData.certifications?.length || 0,
        educationsCount: profileData.educations?.length || 0,
        workExperiencesCount: profileData.workExperiences?.length || 0,
        awardsCount: profileData.awardsAchievements?.length || 0
      });
      
      if (profileData.educations && profileData.educations.length > 0) {
        console.log('Education data received:', profileData.educations.map((e: any) => ({
          id: e.id,
          degree: e.degree,
          college: e.college
        })));
      }
      
      if (profileData.workExperiences && profileData.workExperiences.length > 0) {
        console.log('Work experience data received:', profileData.workExperiences.map((w: any) => ({
          id: w.id,
          company: w.company,
          role: w.role,
          projectTitle: w.projectTitle,
          projectRole: w.projectRole,
          clientName: w.clientName
        })));
      }
      
      setProfile(profileData);
      
      // Transform the data for form state - PRESERVE IDs
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        title: profileData.title || '',
        summary: profileData.summary || '',
        location: profileData.location || '',
        
        // Location breakdown
        city: profileData.city || '',
        country: profileData.country || '',
        region: profileData.region || '',
        
        // Professional info
        totalExperienceYears: profileData.totalExperienceYears || 0,
        domainExperience: profileData.domainExperience || '',
        college: profileData.college || '',
        university: profileData.university || '',
        
        // Arrays for related entities - WITH IDs
        technologies: profileData.technologies?.map((tech: any) => ({
          id: tech.id,
          techName: tech.techName || '',
          skillType: tech.skillType || 'PRIMARY',
          yearsOfExperience: tech.yearsOfExperience || 0,
          lastUsedYear: tech.lastUsedYear
        })) || [],
        
        certifications: profileData.certifications?.map((cert: any) => ({
          id: cert.id,
          certName: cert.certName || '',
          issuer: cert.issuer || '',
          yearObtained: cert.yearObtained || new Date().getFullYear()
        })) || [],
        
        educations: profileData.educations?.map((edu: any) => ({
          id: edu.id,
          degree: edu.degree || '',
          college: edu.college || '',
          university: edu.university || '',
          yearOfPassing: edu.yearOfPassing || new Date().getFullYear()
        })) || [],
        
        workExperiences: profileData.workExperiences?.map((exp: any) => ({
          id: exp.id,
          company: exp.company || '',
          role: exp.role || '',
          startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
          endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
          responsibilities: exp.responsibilities || '',
          isCurrent: exp.isCurrent || false,
          projectTitle: exp.projectTitle || '',
          projectRole: exp.projectRole || '',
          clientName: exp.clientName || '',
          teamSize: exp.teamSize,
          technologiesUsed: exp.technologiesUsed || '',
          keyAchievements: exp.keyAchievements || '',
          noticePeriodServedDays: exp.noticePeriodServedDays,
          rehireEligibility: exp.rehireEligibility !== undefined ? exp.rehireEligibility : true,
          isExpanded: false
        })) || [],
        
        awardsAchievements: profileData.awardsAchievements?.map((award: any) => ({
          id: award.id,
          awardName: award.awardName || '',
          awardType: award.awardType || '',
          issuingOrganization: award.issuingOrganization || '',
          issueDate: award.issueDate ? new Date(award.issueDate).toISOString().split('T')[0] : '',
          description: award.description || ''
        })) || [],
        
        // Availability fields
        availabilityStatus: profileData.availabilityStatus || 'IMMEDIATE',
        noticePeriodDays: profileData.noticePeriodDays || 30,
        earliestStartDate: profileData.earliestStartDate || '',
        currentCompany: profileData.currentCompany || '',
        currentCompanyTenureMonths: profileData.currentCompanyTenureMonths || 0,
        lastCompanyTenureMonths: profileData.lastCompanyTenureMonths || 0,
        isWillingToBuyoutNotice: profileData.isWillingToBuyoutNotice || false
      });
      
      console.log('Form data set successfully. Education count:', 
        profileData.educations?.length || 0);
      
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile: ' + (error.message || 'Unknown error'));
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
      console.log('DEBUG: Current form data:', {
        name: formData.name,
        email: formData.email,
        educationsCount: formData.educations.length,
        educations: formData.educations,
        certificationsCount: formData.certifications.length,
        certifications: formData.certifications,
        workExperiencesCount: formData.workExperiences.length,
        technologiesCount: formData.technologies.length
      });

      // Prepare structured data for API
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        title: formData.title || '',
        summary: formData.summary || '',
        
        // Location fields
        city: formData.city || '',
        country: formData.country || '',
        region: formData.region || '',
        
        // Professional information
        totalExperienceYears: formData.totalExperienceYears || 0,
        domainExperience: formData.domainExperience || '',
        college: formData.college || '',
        university: formData.university || '',
        
        // Arrays for related entities
        technologies: formData.technologies.map(tech => ({
          id: tech.id,
          techName: tech.techName || '',
          skillType: tech.skillType || 'PRIMARY',
          yearsOfExperience: tech.yearsOfExperience || 0,
          lastUsedYear: tech.lastUsedYear
        })),
        
        certifications: formData.certifications.map(cert => ({
          id: cert.id,
          certName: cert.certName || '',
          issuer: cert.issuer || '',
          yearObtained: cert.yearObtained || new Date().getFullYear()
        })),
        
        educations: formData.educations.map(edu => ({
          id: edu.id,
          degree: edu.degree || '',
          college: edu.college || '',
          university: edu.university || '',
          yearOfPassing: edu.yearOfPassing || new Date().getFullYear()
        })),
        
        workExperiences: formData.workExperiences.map(exp => ({
          id: exp.id,
          company: exp.company || '',
          role: exp.role || '',
          startDate: formatDateForBackend(exp.startDate),
          endDate: exp.isCurrent ? null : formatDateForBackend(exp.endDate),
          responsibilities: exp.responsibilities || '',
          isCurrent: exp.isCurrent || false,
          projectTitle: exp.projectTitle || '',
          projectRole: exp.projectRole || '',
          clientName: exp.clientName || '',
          teamSize: exp.teamSize,
          technologiesUsed: exp.technologiesUsed || '',
          keyAchievements: exp.keyAchievements || '',
          noticePeriodServedDays: exp.noticePeriodServedDays,
          rehireEligibility: exp.rehireEligibility !== undefined ? exp.rehireEligibility : true
        })),
        
        awardsAchievements: formData.awardsAchievements.map(award => ({
          id: award.id,
          awardName: award.awardName || '',
          awardType: award.awardType || '',
          issuingOrganization: award.issuingOrganization || '',
          issueDate: formatDateForBackend(award.issueDate),
          description: award.description || ''
        })),
        
        // Availability fields
        availabilityStatus: formData.availabilityStatus || 'IMMEDIATE',
        noticePeriodDays: formData.noticePeriodDays || 30,
        earliestStartDate: formatDateForBackend(formData.earliestStartDate),
        currentCompany: formData.currentCompany || '',
        currentCompanyTenureMonths: formData.currentCompanyTenureMonths || 0,
        lastCompanyTenureMonths: formData.lastCompanyTenureMonths || 0,
        isWillingToBuyoutNotice: formData.isWillingToBuyoutNotice || false
      };

      console.log('DEBUG: Sending update data:', {
        totalWorkExperiences: updateData.workExperiences.length,
        workExperiences: updateData.workExperiences.map((exp: any) => ({
          company: exp.company,
          projectTitle: exp.projectTitle,
          projectRole: exp.projectRole,
          clientName: exp.clientName
        }))
      });
      
      const response = await CandidateService.updateCandidateProfile(updateData);
      console.log('DEBUG: Profile update response:', response);
      
      toast.success('Profile updated successfully!');
      
      // Reload the profile to get updated IDs
      await loadProfile();
      
      // Navigate back to dashboard
      setTimeout(() => {
        navigate('/candidate/dashboard');
      }, 1000);
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         error.message || 
                         'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalExperienceYears' ? parseInt(value) || 0 : value
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

  const toggleWorkExperienceExpand = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map((exp, i) => 
        i === index ? { ...exp, isExpanded: !exp.isExpanded } : exp
      )
    }));
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
      const educationToAdd = {
        id: undefined, // Important: new items should not have ID
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

  const handleAddWorkExperience = () => {
    if (newWorkExperience.company.trim() && newWorkExperience.role.trim()) {
      const workExpToAdd = {
        id: undefined, // New item won't have ID
        company: newWorkExperience.company.trim(),
        role: newWorkExperience.role.trim(),
        startDate: newWorkExperience.startDate,
        endDate: newWorkExperience.endDate,
        responsibilities: newWorkExperience.responsibilities,
        isCurrent: newWorkExperience.isCurrent,
        
        // Project-related fields
        projectTitle: newWorkExperience.projectTitle.trim(),
        projectRole: newWorkExperience.projectRole.trim(),
        clientName: newWorkExperience.clientName.trim(),
        teamSize: newWorkExperience.teamSize,
        technologiesUsed: newWorkExperience.technologiesUsed,
        keyAchievements: newWorkExperience.keyAchievements,
        noticePeriodServedDays: newWorkExperience.noticePeriodServedDays,
        rehireEligibility: newWorkExperience.rehireEligibility,
        
        // UI state
        isExpanded: false,
      };
      
      console.log('Adding new work experience:', workExpToAdd);
      
      setFormData(prev => ({
        ...prev,
        workExperiences: [...prev.workExperiences, workExpToAdd]
      }));
      
      // Reset form
      setNewWorkExperience({
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        responsibilities: '',
        isCurrent: false,
        projectTitle: '',
        projectRole: '',
        clientName: '',
        teamSize: undefined,
        technologiesUsed: '',
        keyAchievements: '',
        noticePeriodServedDays: undefined,
        rehireEligibility: true,
        showProjectDetails: false,
      });
      
      toast.success('Work experience added successfully');
    } else {
      toast.error('Please fill in company and role fields');
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

  const handleNewWorkExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setNewWorkExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number'
        ? (value === '' ? undefined : parseInt(value))
        : value
    }));
  };

  const toggleProjectDetails = () => {
    setNewWorkExperience(prev => ({
      ...prev,
      showProjectDetails: !prev.showProjectDetails
    }));
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-primary">Loading profile...</span>
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

            {/* Education Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education {formData.educations.length > 0 && `(${formData.educations.length})`}
                </CardTitle>
                <CardDescription>Your educational background</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* List of existing educations */}
                  {formData.educations.length > 0 ? (
                    formData.educations.map((edu, index) => (
                      <div key={`edu-${index}-${edu.id || 'new'}`} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">
                            Education #{index + 1} {edu.id ? `(ID: ${edu.id})` : '(New)'}
                          </h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('educations', index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="md:col-span-2">
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
                    ))
                  ) : (
                    <div className="text-center p-8 border rounded-lg">
                      <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No education added yet</p>
                    </div>
                  )}

                  {/* Add new education form */}
                  <div className="p-4 border-2 border-dashed rounded-lg space-y-4">
                    <h4 className="font-semibold">Add New Education</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
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
                      disabled={!newEducation.degree.trim() || !newEducation.college.trim()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications {formData.certifications.length > 0 && `(${formData.certifications.length})`}
                </CardTitle>
                <CardDescription>Your professional certifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* List of existing certifications */}
                  {formData.certifications.length > 0 ? (
                    formData.certifications.map((cert, index) => (
                      <div key={`cert-${index}-${cert.id || 'new'}`} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">
                            Certification #{index + 1} {cert.id ? `(ID: ${cert.id})` : '(New)'}
                          </h4>
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
                    ))
                  ) : (
                    <div className="text-center p-8 border rounded-lg">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No certifications added yet</p>
                    </div>
                  )}

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
                      disabled={!newCertification.certName.trim() || !newCertification.issuer.trim()}
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
                  Skills & Technologies {formData.technologies.length > 0 && `(${formData.technologies.length})`}
                </CardTitle>
                <CardDescription>Add your technical skills and proficiency levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add new skill */}
                  <div className="flex gap-4 mb-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
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
                      <Button type="button" onClick={addSkill} className="h-10" disabled={!currentSkill.trim()}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Display skills */}
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.length > 0 ? (
                      formData.technologies.map((tech, index) => (
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
                      ))
                    ) : (
                      <p className="text-muted-foreground">No skills added yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Experience Section */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience {formData.workExperiences.length > 0 && `(${formData.workExperiences.length})`}
                </CardTitle>
                <CardDescription>Your professional work history with project details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* List of existing work experiences */}
                  {formData.workExperiences.length > 0 ? (
                    formData.workExperiences.map((exp, index) => (
                      <div key={`exp-${index}-${exp.id || 'new'}`} className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-muted/30">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {exp.role} at {exp.company}
                                {exp.isCurrent && (
                                  <Badge variant="default" className="ml-2">
                                    Current
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {exp.startDate} to {exp.isCurrent ? 'Present' : exp.endDate}
                                {exp.projectTitle && ` • ${exp.projectTitle}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleWorkExperienceExpand(index)}
                              >
                                {exp.isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                <span className="ml-1">{exp.isExpanded ? 'Less' : 'More'}</span>
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem('workExperiences', index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {exp.isExpanded && (
                          <div className="p-4 border-t space-y-4">
                            {/* Basic Work Experience */}
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
                                  placeholder="Your role"
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
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="date"
                                    value={exp.endDate}
                                    onChange={(e) => handleNestedChange('workExperiences', index, 'endDate', e.target.value)}
                                    disabled={exp.isCurrent}
                                  />
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`exp-current-${index}`}
                                      checked={exp.isCurrent}
                                      onChange={(e) => {
                                        handleNestedChange('workExperiences', index, 'isCurrent', e.target.checked);
                                        if (e.target.checked) {
                                          handleNestedChange('workExperiences', index, 'endDate', '');
                                        }
                                      }}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor={`exp-current-${index}`} className="text-sm">
                                      Current
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Responsibilities */}
                            <div>
                              <Label>Responsibilities</Label>
                              <Textarea
                                value={exp.responsibilities}
                                onChange={(e) => handleNestedChange('workExperiences', index, 'responsibilities', e.target.value)}
                                placeholder="Describe your responsibilities..."
                                rows={3}
                              />
                            </div>
                            
                            {/* Project Details Section */}
                            <div className="border rounded-lg p-4 bg-muted/30">
                              <h5 className="font-semibold mb-3 text-primary flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Project Details
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Project Title</Label>
                                  <Input
                                    value={exp.projectTitle}
                                    onChange={(e) => handleNestedChange('workExperiences', index, 'projectTitle', e.target.value)}
                                    placeholder="Project name"
                                  />
                                </div>
                                <div>
                                  <Label>Project Role</Label>
                                  <select
                                    className="w-full h-10 px-3 py-2 border rounded-md"
                                    value={exp.projectRole}
                                    onChange={(e) => handleNestedChange('workExperiences', index, 'projectRole', e.target.value)}
                                  >
                                    <option value="">Select role</option>
                                    <option value="DEVELOPER">Developer</option>
                                    <option value="TEAM_LEAD">Team Lead</option>
                                    <option value="ARCHITECT">Architect</option>
                                    <option value="PROJECT_MANAGER">Project Manager</option>
                                    <option value="BUSINESS_ANALYST">Business Analyst</option>
                                    <option value="QA">QA Engineer</option>
                                  </select>
                                </div>
                                <div>
                                  <Label>Client Name</Label>
                                  <Input
                                    value={exp.clientName}
                                    onChange={(e) => handleNestedChange('workExperiences', index, 'clientName', e.target.value)}
                                    placeholder="Client/organization name"
                                  />
                                </div>
                                <div>
                                  <Label>Team Size</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={exp.teamSize || ''}
                                    onChange={(e) => handleNestedChange('workExperiences', index, 'teamSize', 
                                      e.target.value ? parseInt(e.target.value) : undefined)}
                                    placeholder="Number of team members"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label>Technologies Used</Label>
                                  <Textarea
                                    value={exp.technologiesUsed}
                                    onChange={(e) => handleNestedChange('workExperiences', index, 'technologiesUsed', e.target.value)}
                                    placeholder="List technologies, frameworks, tools used (comma-separated)"
                                    rows={2}
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label>Key Achievements</Label>
                                  <Textarea
                                    value={exp.keyAchievements}
                                    onChange={(e) => handleNestedChange('workExperiences', index, 'keyAchievements', e.target.value)}
                                    placeholder="Describe key achievements, deliverables, impact..."
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <Label>Notice Period Served (Days)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={exp.noticePeriodServedDays || ''}
                                    onChange={(e) => handleNestedChange('workExperiences', index, 'noticePeriodServedDays', 
                                      e.target.value ? parseInt(e.target.value) : undefined)}
                                    placeholder="e.g., 30, 60, 90"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`exp-rehire-${index}`}
                                    checked={exp.rehireEligibility}
                                    onChange={(e) => handleNestedChange('workExperiences', index, 'rehireEligibility', e.target.checked)}
                                    className="h-4 w-4"
                                  />
                                  <Label htmlFor={`exp-rehire-${index}`} className="text-sm">
                                    Rehire Eligible
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 border rounded-lg">
                      <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No work experience added yet</p>
                    </div>
                  )}

                  {/* Add New Work Experience Form */}
                  <div className="border-2 border-dashed rounded-lg p-4 space-y-4">
                    <h4 className="font-semibold">Add New Work Experience</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newCompany">Company *</Label>
                        <Input
                          id="newCompany"
                          name="company"
                          value={newWorkExperience.company}
                          onChange={handleNewWorkExperienceChange}
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newRole">Role *</Label>
                        <Input
                          id="newRole"
                          name="role"
                          value={newWorkExperience.role}
                          onChange={handleNewWorkExperienceChange}
                          placeholder="Your role"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newStartDate">Start Date</Label>
                        <Input
                          id="newStartDate"
                          name="startDate"
                          type="date"
                          value={newWorkExperience.startDate}
                          onChange={handleNewWorkExperienceChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="newEndDate">End Date</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="newEndDate"
                            name="endDate"
                            type="date"
                            value={newWorkExperience.endDate}
                            onChange={handleNewWorkExperienceChange}
                            disabled={newWorkExperience.isCurrent}
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="newIsCurrent"
                              name="isCurrent"
                              checked={newWorkExperience.isCurrent}
                              onChange={handleNewWorkExperienceChange}
                              className="h-4 w-4"
                            />
                            <Label htmlFor="newIsCurrent" className="text-sm">
                              Current
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="newResponsibilities">Responsibilities</Label>
                        <Textarea
                          id="newResponsibilities"
                          name="responsibilities"
                          value={newWorkExperience.responsibilities}
                          onChange={handleNewWorkExperienceChange}
                          placeholder="Describe your responsibilities..."
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    {/* Toggle for Project Details */}
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={toggleProjectDetails}
                        className="flex items-center gap-2"
                      >
                        {newWorkExperience.showProjectDetails ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                        {newWorkExperience.showProjectDetails ? 'Hide' : 'Show'} Project Details
                      </Button>
                    </div>
                    
                    {/* Project Details Form (Conditional) */}
                    {newWorkExperience.showProjectDetails && (
                      <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
                        <h5 className="font-semibold text-primary flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Project Details
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="newProjectTitle">Project Title</Label>
                            <Input
                              id="newProjectTitle"
                              name="projectTitle"
                              value={newWorkExperience.projectTitle}
                              onChange={handleNewWorkExperienceChange}
                              placeholder="Project name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="newProjectRole">Project Role</Label>
                            <select
                              id="newProjectRole"
                              name="projectRole"
                              className="w-full h-10 px-3 py-2 border rounded-md"
                              value={newWorkExperience.projectRole}
                              onChange={handleNewWorkExperienceChange}
                            >
                              <option value="">Select role</option>
                              <option value="DEVELOPER">Developer</option>
                              <option value="TEAM_LEAD">Team Lead</option>
                              <option value="ARCHITECT">Architect</option>
                              <option value="PROJECT_MANAGER">Project Manager</option>
                              <option value="BUSINESS_ANALYST">Business Analyst</option>
                              <option value="QA">QA Engineer</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="newClientName">Client Name</Label>
                            <Input
                              id="newClientName"
                              name="clientName"
                              value={newWorkExperience.clientName}
                              onChange={handleNewWorkExperienceChange}
                              placeholder="Client/organization name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="newTeamSize">Team Size</Label>
                            <Input
                              id="newTeamSize"
                              name="teamSize"
                              type="number"
                              min="1"
                              value={newWorkExperience.teamSize || ''}
                              onChange={handleNewWorkExperienceChange}
                              placeholder="Number of team members"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="newTechnologiesUsed">Technologies Used</Label>
                            <Textarea
                              id="newTechnologiesUsed"
                              name="technologiesUsed"
                              value={newWorkExperience.technologiesUsed}
                              onChange={handleNewWorkExperienceChange}
                              placeholder="List technologies, frameworks, tools used (comma-separated)"
                              rows={2}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="newKeyAchievements">Key Achievements</Label>
                            <Textarea
                              id="newKeyAchievements"
                              name="keyAchievements"
                              value={newWorkExperience.keyAchievements}
                              onChange={handleNewWorkExperienceChange}
                              placeholder="Describe key achievements, deliverables, impact..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newNoticePeriodServedDays">Notice Period Served (Days)</Label>
                            <Input
                              id="newNoticePeriodServedDays"
                              name="noticePeriodServedDays"
                              type="number"
                              min="0"
                              value={newWorkExperience.noticePeriodServedDays || ''}
                              onChange={handleNewWorkExperienceChange}
                              placeholder="e.g., 30, 60, 90"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="newRehireEligibility"
                              name="rehireEligibility"
                              checked={newWorkExperience.rehireEligibility}
                              onChange={handleNewWorkExperienceChange}
                              className="h-4 w-4"
                            />
                            <Label htmlFor="newRehireEligibility" className="text-sm">
                              Rehire Eligible
                            </Label>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddWorkExperience}
                      className="w-full"
                      disabled={!newWorkExperience.company.trim() || !newWorkExperience.role.trim()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Work Experience
                    </Button>
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

          {/* Debug Button (Temporary) */}
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                console.log('Current form data:', {
                  name: formData.name,
                  email: formData.email,
                  educations: formData.educations,
                  certifications: formData.certifications,
                  technologies: formData.technologies,
                  workExperiences: formData.workExperiences
                });
                toast.info('Check console for form data');
              }}
            >
              Debug Form Data
            </Button>
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