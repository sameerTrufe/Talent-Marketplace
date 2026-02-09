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
  Trophy,
  AlertCircle
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
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

  // Validation state for new work experience
  const [newWorkExperienceErrors, setNewWorkExperienceErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  // Helper function to calculate tenure in months
  const calculateTenureInMonths = (startDateStr: string, endDateStr: string | null): number => {
    if (!startDateStr) return 0;
    
    try {
      const startDate = new Date(startDateStr);
      const endDate = endDateStr ? new Date(endDateStr) : new Date();
      
      if (isNaN(startDate.getTime())) return 0;
      if (endDateStr && isNaN(endDate.getTime())) return 0;
      
      const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
      const monthsDiff = endDate.getMonth() - startDate.getMonth();
      
      return Math.max(0, (yearsDiff * 12) + monthsDiff);
    } catch (error) {
      console.error('Error calculating tenure:', error);
      return 0;
    }
  };

  // Function to handle current work experience toggle
  const toggleCurrentWorkExperience = (index: number) => {
    setFormData(prev => {
      const newWorkExperiences = [...prev.workExperiences];
      
      // If checking current, uncheck all others and disable their checkboxes
      if (!newWorkExperiences[index].isCurrent) {
        // Uncheck all other work experiences
        newWorkExperiences.forEach((exp, i) => {
          newWorkExperiences[i].isCurrent = false;
          // Clear notice period for non-current companies
          newWorkExperiences[i].noticePeriodServedDays = undefined;
        });
        // Check the current one and clear end date
        newWorkExperiences[index].isCurrent = true;
        newWorkExperiences[index].endDate = '';
        
        // Update current company
        const updatedForm = {
          ...prev,
          currentCompany: newWorkExperiences[index].company || '',
          currentCompanyTenureMonths: calculateTenureInMonths(
            newWorkExperiences[index].startDate, 
            null
          ),
          workExperiences: newWorkExperiences
        };
        
        return updatedForm;
      } else {
        // Unchecking current - set a default end date if start date exists
        newWorkExperiences[index].isCurrent = false;
        // Clear notice period when not current
        newWorkExperiences[index].noticePeriodServedDays = undefined;
        
        if (newWorkExperiences[index].startDate) {
          const startDate = new Date(newWorkExperiences[index].startDate);
          const defaultEndDate = new Date(startDate);
          defaultEndDate.setMonth(defaultEndDate.getMonth() + 12);
          newWorkExperiences[index].endDate = defaultEndDate.toISOString().split('T')[0];
        }
        
        // Clear current company if this was the current one
        const updatedForm = {
          ...prev,
          currentCompany: '',
          currentCompanyTenureMonths: 0,
          workExperiences: newWorkExperiences
        };
        
        // Find the most recent past experience for last company tenure
        const pastExperiences = newWorkExperiences
          .filter(exp => !exp.isCurrent && exp.endDate && exp.startDate)
          .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
        
        if (pastExperiences.length > 0) {
          const mostRecent = pastExperiences[0];
          updatedForm.lastCompanyTenureMonths = calculateTenureInMonths(
            mostRecent.startDate, 
            mostRecent.endDate
          );
        }
        
        return updatedForm;
      }
    });
  };

  // Function to handle new work experience current toggle
  const handleNewWorkExperienceCurrentToggle = () => {
    setNewWorkExperience(prev => {
      const newIsCurrent = !prev.isCurrent;
      
      // Clear validation errors when toggling
      setNewWorkExperienceErrors(errors => ({
        ...errors,
        endDate: ''
      }));
      
      // Clear notice period if not current
      const updatedNoticePeriod = newIsCurrent ? prev.noticePeriodServedDays : undefined;
      
      // If setting to current and there's already a current in form data
      if (newIsCurrent && formData.workExperiences.some(exp => exp.isCurrent)) {
        // Update form data to uncheck existing current
        setFormData(prevFormData => {
          const updatedWorkExperiences = prevFormData.workExperiences.map(exp => ({
            ...exp,
            isCurrent: false,
            noticePeriodServedDays: undefined
          }));
          
          return {
            ...prevFormData,
            workExperiences: updatedWorkExperiences,
            currentCompany: '',
            currentCompanyTenureMonths: 0
          };
        });
      }
      
      return {
        ...prev,
        isCurrent: newIsCurrent,
        endDate: newIsCurrent ? '' : prev.endDate,
        noticePeriodServedDays: updatedNoticePeriod
      };
    });
  };

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
          isCurrent: w.isCurrent,
          projectTitle: w.projectTitle,
          projectRole: w.projectRole,
          clientName: w.clientName
        })));
      }
      
      setProfile(profileData);
      
      // Transform the data for form state - PRESERVE IDs
      const workExperiencesData = profileData.workExperiences?.map((exp: any) => ({
        id: exp.id,
        company: exp.company || '',
        role: exp.role || '',
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
        endDate: exp.isCurrent ? '' : (exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''),
        responsibilities: exp.responsibilities || '',
        isCurrent: exp.isCurrent || false,
        projectTitle: exp.projectTitle || '',
        projectRole: exp.projectRole || '',
        clientName: exp.clientName || '',
        teamSize: exp.teamSize || undefined,
        technologiesUsed: exp.technologiesUsed || '',
        keyAchievements: exp.keyAchievements || '',
        // Only show notice period for current company
        noticePeriodServedDays: exp.isCurrent ? (exp.noticePeriodServedDays || undefined) : undefined,
        rehireEligibility: exp.rehireEligibility !== undefined ? exp.rehireEligibility : true,
        isExpanded: false
      })) || [];
      
      // Find current work experience
      const currentWorkExp = workExperiencesData.find(exp => exp.isCurrent);
      const pastWorkExps = workExperiencesData
        .filter(exp => !exp.isCurrent && exp.endDate)
        .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
      
      const mostRecentPastExp = pastWorkExps[0];
      
      // Calculate tenures
      const currentCompanyTenureMonths = currentWorkExp 
        ? calculateTenureInMonths(currentWorkExp.startDate, null)
        : profileData.currentCompanyTenureMonths || 0;
      
      const lastCompanyTenureMonths = mostRecentPastExp
        ? calculateTenureInMonths(mostRecentPastExp.startDate, mostRecentPastExp.endDate)
        : profileData.lastCompanyTenureMonths || 0;
      
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
        
        workExperiences: workExperiencesData,
        
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
        currentCompany: currentWorkExp?.company || profileData.currentCompany || '',
        currentCompanyTenureMonths: currentCompanyTenureMonths,
        lastCompanyTenureMonths: lastCompanyTenureMonths,
        isWillingToBuyoutNotice: profileData.isWillingToBuyoutNotice || false
      });
      
      console.log('Form data set successfully. Current company:', currentWorkExp?.company || profileData.currentCompany);
      
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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Basic validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Work experience validation
    formData.workExperiences.forEach((exp, index) => {
      if (!exp.isCurrent && !exp.endDate) {
        errors[`workExperience_${index}_endDate`] = `End date is required for "${exp.company}" (not current)`;
      }
      if (exp.startDate && exp.endDate && !exp.isCurrent) {
        const startDate = new Date(exp.startDate);
        const endDate = new Date(exp.endDate);
        if (endDate < startDate) {
          errors[`workExperience_${index}_dateRange`] = `End date cannot be before start date for "${exp.company}"`;
        }
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateNewWorkExperience = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!newWorkExperience.company.trim()) {
      errors.company = 'Company is required';
    }
    
    if (!newWorkExperience.role.trim()) {
      errors.role = 'Role is required';
    }
    
    if (!newWorkExperience.isCurrent && !newWorkExperience.endDate) {
      errors.endDate = 'End date is required for non-current work experience';
    }
    
    // Validate date range if both dates exist
    if (newWorkExperience.startDate && newWorkExperience.endDate && !newWorkExperience.isCurrent) {
      const startDate = new Date(newWorkExperience.startDate);
      const endDate = new Date(newWorkExperience.endDate);
      if (endDate < startDate) {
        errors.dateRange = 'End date cannot be before start date';
      }
    }
    
    setNewWorkExperienceErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clear previous errors
      setFormErrors({});
      
      // Validate form
      if (!validateForm()) {
        toast.error('Please fix the validation errors before saving');
        setSaving(false);
        return;
      }

      console.log('DEBUG: Current form data:', {
        name: formData.name,
        email: formData.email,
        educationsCount: formData.educations.length,
        workExperiencesCount: formData.workExperiences.length,
        currentCompany: formData.currentCompany,
        currentTenure: formData.currentCompanyTenureMonths,
        lastTenure: formData.lastCompanyTenureMonths
      });

      // Calculate current company from current work experience
      const currentWorkExp = formData.workExperiences.find(exp => exp.isCurrent);
      const pastWorkExps = formData.workExperiences
        .filter(exp => !exp.isCurrent && exp.endDate)
        .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
      
      const mostRecentPastExp = pastWorkExps[0];
      
      // Calculate tenures
      const currentCompanyTenureMonths = currentWorkExp 
        ? calculateTenureInMonths(currentWorkExp.startDate, null)
        : formData.currentCompanyTenureMonths || 0;
      
      const lastCompanyTenureMonths = mostRecentPastExp
        ? calculateTenureInMonths(mostRecentPastExp.startDate, mostRecentPastExp.endDate)
        : formData.lastCompanyTenureMonths || 0;

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
          // Only send notice period for current company
          noticePeriodServedDays: exp.isCurrent ? (exp.noticePeriodServedDays || undefined) : undefined,
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
        
        // Availability fields - Set from form data
        availabilityStatus: formData.availabilityStatus || 'IMMEDIATE',
        noticePeriodDays: formData.noticePeriodDays || 30,
        earliestStartDate: formatDateForBackend(formData.earliestStartDate),
        currentCompany: currentWorkExp?.company || formData.currentCompany || '',
        currentCompanyTenureMonths: currentCompanyTenureMonths,
        lastCompanyTenureMonths: lastCompanyTenureMonths,
        isWillingToBuyoutNotice: formData.isWillingToBuyoutNotice || false
      };

      console.log('DEBUG: Sending update data:', {
        totalWorkExperiences: updateData.workExperiences.length,
        currentWorkExperience: updateData.workExperiences.find(exp => exp.isCurrent),
        currentCompanySent: updateData.currentCompany,
        currentTenureSent: updateData.currentCompanyTenureMonths,
        lastTenureSent: updateData.lastCompanyTenureMonths
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
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (section: string, index: number, field: string, value: any) => {
    setFormData(prev => {
      const newArray = [...prev[section]];
      
      // Update the specific item
      newArray[index] = { ...newArray[index], [field]: value };
      
      const updatedData = {
        ...prev,
        [section]: newArray
      };
      
      // Special handling for work experiences
      if (section === 'workExperiences') {
        const exp = newArray[index];
        
        // Clear validation errors for this field
        if (formErrors[`workExperience_${index}_${field}`]) {
          setFormErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[`workExperience_${index}_${field}`];
            delete newErrors[`workExperience_${index}_dateRange`];
            return newErrors;
          });
        }
        
        // Clear notice period when marking as non-current
        if (field === 'isCurrent' && value === false) {
          newArray[index].noticePeriodServedDays = undefined;
        }
        
        // If company field changes for current work experience, update currentCompany
        if (field === 'company' && exp.isCurrent) {
          updatedData.currentCompany = value;
        }
        
        // If isCurrent changes, handle it
        if (field === 'isCurrent') {
          if (value === true) {
            // Uncheck all other work experiences and clear their notice periods
            updatedData.workExperiences = newArray.map((expItem, i) => ({
              ...expItem,
              isCurrent: i === index,
              noticePeriodServedDays: i === index ? expItem.noticePeriodServedDays : undefined
            }));
            
            // Update current company and tenure
            updatedData.currentCompany = exp.company || '';
            updatedData.currentCompanyTenureMonths = calculateTenureInMonths(exp.startDate, null);
          } else {
            // Clearing current - clear the current company and notice period
            updatedData.currentCompany = '';
            updatedData.currentCompanyTenureMonths = 0;
          }
        }
        
        // If start date changes for current work experience, recalculate tenure
        if (field === 'startDate' && exp.isCurrent) {
          updatedData.currentCompanyTenureMonths = calculateTenureInMonths(value, null);
        }
      }
      
      return updatedData;
    });
  };

  const addItem = (section: string, defaultValue: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], defaultValue]
    }));
  };

  const removeItem = (section: string, index: number) => {
    console.log(`Removing item from ${section} at index ${index}`);
    
    // If removing current work experience, clear current company
    if (section === 'workExperiences') {
      const exp = formData.workExperiences[index];
      if (exp.isCurrent) {
        setFormData(prev => ({
          ...prev,
          currentCompany: '',
          currentCompanyTenureMonths: 0
        }));
      }
    }
    
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
    // Validate new work experience
    if (!validateNewWorkExperience()) {
      toast.error('Please fix the errors in the work experience form');
      return;
    }

    if (newWorkExperience.company.trim() && newWorkExperience.role.trim()) {
      const workExpToAdd = {
        id: undefined, // New item won't have ID
        company: newWorkExperience.company.trim(),
        role: newWorkExperience.role.trim(),
        startDate: newWorkExperience.startDate,
        endDate: newWorkExperience.isCurrent ? '' : newWorkExperience.endDate,
        responsibilities: newWorkExperience.responsibilities,
        isCurrent: newWorkExperience.isCurrent,
        
        // Project-related fields
        projectTitle: newWorkExperience.projectTitle.trim(),
        projectRole: newWorkExperience.projectRole.trim(),
        clientName: newWorkExperience.clientName.trim(),
        teamSize: newWorkExperience.teamSize,
        technologiesUsed: newWorkExperience.technologiesUsed,
        keyAchievements: newWorkExperience.keyAchievements,
        // Only set notice period for current company
        noticePeriodServedDays: newWorkExperience.isCurrent ? newWorkExperience.noticePeriodServedDays : undefined,
        rehireEligibility: newWorkExperience.rehireEligibility,
        
        // UI state
        isExpanded: false,
      };
      
      console.log('Adding new work experience:', workExpToAdd);
      
      // Handle current work experience logic
      let updatedWorkExperiences = [...formData.workExperiences];
      let updatedCurrentCompany = formData.currentCompany;
      let updatedCurrentTenure = formData.currentCompanyTenureMonths;
      
      if (newWorkExperience.isCurrent) {
        // Uncheck all existing work experiences and clear their notice periods
        updatedWorkExperiences = updatedWorkExperiences.map(exp => ({
          ...exp,
          isCurrent: false,
          noticePeriodServedDays: undefined
        }));
        
        // Set new one as current
        updatedCurrentCompany = newWorkExperience.company.trim();
        updatedCurrentTenure = calculateTenureInMonths(newWorkExperience.startDate, null);
      }
      
      // Add the new work experience
      updatedWorkExperiences.push(workExpToAdd);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        workExperiences: updatedWorkExperiences,
        currentCompany: updatedCurrentCompany,
        currentCompanyTenureMonths: updatedCurrentTenure
      }));
      
      // Reset form and errors
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
      setNewWorkExperienceErrors({});
      
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
    
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number'
      ? (value === '' ? undefined : parseInt(value))
      : value;
    
    setNewWorkExperience(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear validation error for this field
    if (newWorkExperienceErrors[name] || newWorkExperienceErrors.dateRange) {
      setNewWorkExperienceErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors.dateRange;
        return newErrors;
      });
    }
  };

  const toggleProjectDetails = () => {
    setNewWorkExperience(prev => ({
      ...prev,
      showProjectDetails: !prev.showProjectDetails
    }));
  };

  // Check if there's already a current work experience
  const hasCurrentWorkExperience = formData.workExperiences.some(exp => exp.isCurrent);

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

        {/* Form Validation Errors */}
        {Object.keys(formErrors).length > 0 && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">Please fix the following errors:</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {Object.entries(formErrors).map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
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
                    className={formErrors.name ? 'border-red-500' : ''}
                    required
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                  )}
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
                    className={formErrors.email ? 'border-red-500' : ''}
                    required
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                  )}
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
                <div>
                  <Label htmlFor="noticePeriodDays">Notice Period (Days)</Label>
                  <Input
                    id="noticePeriodDays"
                    name="noticePeriodDays"
                    type="number"
                    value={formData.noticePeriodDays}
                    onChange={handleChange}
                    placeholder="30"
                    min="0"
                  />
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
                            {/* Validation errors for this work experience */}
                            {(formErrors[`workExperience_${index}_endDate`] || formErrors[`workExperience_${index}_dateRange`]) && (
                              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2 text-red-700">
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    {formErrors[`workExperience_${index}_endDate`] || formErrors[`workExperience_${index}_dateRange`]}
                                  </span>
                                </div>
                              </div>
                            )}
                            
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
                                <div className="space-y-2">
                                  <Input
                                    type="date"
                                    value={exp.endDate}
                                    onChange={(e) => handleNestedChange('workExperiences', index, 'endDate', e.target.value)}
                                    disabled={exp.isCurrent}
                                    className={formErrors[`workExperience_${index}_endDate`] ? 'border-red-500' : ''}
                                  />
                                  {!exp.isCurrent && !exp.endDate && (
                                    <p className="text-xs text-red-500">
                                      End date is required for non-current work experience
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`exp-current-${index}`}
                                      checked={exp.isCurrent}
                                      onChange={(e) => {
                                        if (e.target.checked || exp.isCurrent) {
                                          toggleCurrentWorkExperience(index);
                                        }
                                      }}
                                      className="h-4 w-4"
                                      disabled={hasCurrentWorkExperience && !exp.isCurrent}
                                    />
                                    <Label htmlFor={`exp-current-${index}`} className="text-sm">
                                      Current
                                      {hasCurrentWorkExperience && !exp.isCurrent && (
                                        <span className="text-xs text-muted-foreground ml-1">(Only one allowed)</span>
                                      )}
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
                                {/* FIX: Only show Notice Period Served for current company */}
                                {exp.isCurrent && (
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
                                )}
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
                    
                    {/* Validation errors for new work experience */}
                    {Object.keys(newWorkExperienceErrors).length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 mb-2">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Please fix the following:</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-red-600 space-y-1">
                          {Object.entries(newWorkExperienceErrors).map(([key, message]) => (
                            <li key={key}>{message}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newCompany">Company *</Label>
                        <Input
                          id="newCompany"
                          name="company"
                          value={newWorkExperience.company}
                          onChange={handleNewWorkExperienceChange}
                          placeholder="Company name"
                          className={newWorkExperienceErrors.company ? 'border-red-500' : ''}
                        />
                        {newWorkExperienceErrors.company && (
                          <p className="text-xs text-red-500 mt-1">{newWorkExperienceErrors.company}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="newRole">Role *</Label>
                        <Input
                          id="newRole"
                          name="role"
                          value={newWorkExperience.role}
                          onChange={handleNewWorkExperienceChange}
                          placeholder="Your role"
                          className={newWorkExperienceErrors.role ? 'border-red-500' : ''}
                        />
                        {newWorkExperienceErrors.role && (
                          <p className="text-xs text-red-500 mt-1">{newWorkExperienceErrors.role}</p>
                        )}
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
                        <div className="space-y-2">
                          <Input
                            id="newEndDate"
                            name="endDate"
                            type="date"
                            value={newWorkExperience.endDate}
                            onChange={handleNewWorkExperienceChange}
                            disabled={newWorkExperience.isCurrent}
                            className={newWorkExperienceErrors.endDate || newWorkExperienceErrors.dateRange ? 'border-red-500' : ''}
                          />
                          {!newWorkExperience.isCurrent && (
                            <p className="text-xs text-muted-foreground">
                              Required for non-current work experience
                            </p>
                          )}
                          {newWorkExperienceErrors.endDate && (
                            <p className="text-xs text-red-500">{newWorkExperienceErrors.endDate}</p>
                          )}
                          {newWorkExperienceErrors.dateRange && (
                            <p className="text-xs text-red-500">{newWorkExperienceErrors.dateRange}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="newIsCurrent"
                              name="isCurrent"
                              checked={newWorkExperience.isCurrent}
                              onChange={handleNewWorkExperienceCurrentToggle}
                              className="h-4 w-4"
                              disabled={hasCurrentWorkExperience && !newWorkExperience.isCurrent}
                            />
                            <Label htmlFor="newIsCurrent" className="text-sm">
                              Current
                              {hasCurrentWorkExperience && !newWorkExperience.isCurrent && (
                                <span className="text-xs text-muted-foreground ml-1">(Only one allowed)</span>
                              )}
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
                          {/* FIX: Only show Notice Period Served for current company */}
                          {newWorkExperience.isCurrent && (
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
                          )}
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

          {/* Current Company Info Display */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Current Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Current Company</Label>
                <p className="font-medium">{formData.currentCompany || 'Not set'}</p>
                <p className="text-sm text-muted-foreground">
                  {formData.workExperiences.some(exp => exp.isCurrent) 
                    ? 'Automatically set from current work experience'
                    : 'Set a work experience as "Current" to auto-populate'}
                </p>
              </div>
              <div>
                <Label>Current Company Tenure</Label>
                <p className="font-medium">{formData.currentCompanyTenureMonths} months</p>
              </div>
              <div>
                <Label>Last Company Tenure</Label>
                <p className="font-medium">{formData.lastCompanyTenureMonths} months</p>
              </div>
            </div>
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
                  workExperiences: formData.workExperiences,
                  currentCompany: formData.currentCompany,
                  currentTenure: formData.currentCompanyTenureMonths,
                  lastTenure: formData.lastCompanyTenureMonths,
                  hasCurrentExperience: formData.workExperiences.some(exp => exp.isCurrent)
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