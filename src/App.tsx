import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/pages/LandingPage';
import { LoginSignup } from './components/pages/LoginSignup';
import { ClientDashboard } from './components/pages/ClientDashboard';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { Messaging } from './components/pages/Messaging';
import { ContractBilling } from './components/pages/ContractBilling';
import { ResourceProfile } from './components/pages/ResourceProfile';
import { PostRequirement } from './components/pages/PostRequirement';
import { BrowseResources } from './components/pages/BrowseResources';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<LoginSignup />} />
        
        {/* Client Routes */}
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/resource/:id" element={<ResourceProfile />} />
        <Route path="/client/browse" element={<BrowseResources />} />
        <Route path="/client/messages" element={<Messaging />} />
        <Route path="/client/contracts" element={<ContractBilling />} />
        <Route path="/client/post-requirement" element={<PostRequirement />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;