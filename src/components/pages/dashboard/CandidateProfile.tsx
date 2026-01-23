import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CandidateProfile: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/candidate/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <p>Profile page is under construction. You can edit your profile from the dashboard.</p>
      <Button className="mt-4" asChild>
        <Link to="/candidate/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
};

export default CandidateProfile;