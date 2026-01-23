import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Settings, 
  Bell, 
  Shield, 
  Mail, 
  Eye, 
  User, 
  Globe,
  Save,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

const CandidateSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    jobAlerts: true,
    profileVisibility: 'public',
    twoFactorAuth: false,
    weeklyDigest: true,
    marketingEmails: false
  });

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: 'en',
    timezone: 'UTC'
  });

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const handleExportData = () => {
    toast.info('Data export has been started. You will receive an email shortly.');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/candidate/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email updates about your applications</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="job-alerts">Job Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new job matches</p>
                </div>
                <Switch
                  id="job-alerts"
                  checked={settings.jobAlerts}
                  onCheckedChange={(checked) => handleSettingChange('jobAlerts', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-digest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly summary emails</p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Manage your privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                </div>
                <select
                  id="profile-visibility"
                  className="rounded-md border border-input bg-background px-3 py-2"
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="recruiters">Recruiters Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="currentPassword">Change Password</Label>
                <div className="space-y-3 mt-2">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Current password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="newPassword"
                    type="password"
                    placeholder="New password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account
              </CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  name="language"
                  className="mt-1 rounded-md border border-input bg-background px-3 py-2 w-full"
                  value={formData.language}
                  onChange={handleInputChange}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <Separator />

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  name="timezone"
                  className="mt-1 rounded-md border border-input bg-background px-3 py-2 w-full"
                  value={formData.timezone}
                  onChange={handleInputChange}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time (EST)</option>
                  <option value="PST">Pacific Time (PST)</option>
                  <option value="CET">Central European Time (CET)</option>
                </select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive promotional emails</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Manage your personal data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={handleExportData} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              <p className="text-sm text-muted-foreground">
                Download a copy of your personal data in JSON format
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link to="/candidate/dashboard">Cancel</Link>
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSettings;