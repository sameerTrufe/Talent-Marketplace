import { createBrowserRouter } from "react-router";
import { LandingPage } from "../components/pages/LandingPage";
import { LoginSignup } from "../components/pages/LoginSignup";
import { ClientDashboard } from "../components/pages/ClientDashboard";
import { BrowseResources } from "../components/pages/BrowseResources";
import { ResourceProfile } from "../components/pages/ResourceProfile";
import { PostRequirement } from "../components/pages/PostRequirement";
import { Messaging } from "../components/pages/Messaging";
import { ContractBilling } from "../components/pages/ContractBilling";
import { AdminDashboard } from "../components/pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/auth",
    Component: LoginSignup,
  },
  {
    path: "/client/dashboard",
    Component: ClientDashboard,
  },
  {
    path: "/client/browse",
    Component: BrowseResources,
  },
  {
    path: "/client/resource/:id",
    Component: ResourceProfile,
  },
  {
    path: "/client/post-requirement",
    Component: PostRequirement,
  },
  {
    path: "/client/messaging",
    Component: Messaging,
  },
  {
    path: "/client/contracts",
    Component: ContractBilling,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
]);
