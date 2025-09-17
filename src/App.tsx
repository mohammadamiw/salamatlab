
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./components/Contact";
import AllDoctors from "./pages/AllDoctors";
import UrologyDoctors from "./pages/UrologyDoctors";
import OrthopedicDoctors from "./pages/OrthopedicDoctors";
import GynecologyDoctors from "./pages/GynecologyDoctors";
import GeneralDoctors from "./pages/GeneralDoctors";
import InternalMedicineDoctors from "./pages/InternalMedicineDoctors";
import MidwifeDoctors from "./pages/MidwifeDoctors";
import LocalDoctorsLanding from "./pages/LocalDoctorsLanding";
import AllArticles from "./pages/AllArticles";
import SingleArticle from "./pages/SingleArticle";
import Profile from "./pages/Profile";
import Login from "./pages/Auth/Login";
import CompleteProfile from "./pages/Auth/CompleteProfile";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import PneumocystisPneumoniaArticle from "./pages/PneumocystisPneumoniaArticle";
import NotFound from "./pages/NotFound";
import LabServices from "./pages/LabServices";
import HematologyServices from "./pages/HematologyServices";
import BiochemistryServices from "./pages/BiochemistryServices";
import CoagulationServices from "./pages/CoagulationServices";
import MicrobiologyServices from "./pages/MicrobiologyServices";
import ImmunologyServices from "./pages/ImmunologyServices";
import CytologyServices from "./pages/CytologyServices";
import MolecularDiagnosisServices from "./pages/MolecularDiagnosisServices";
import FlowCytometryServices from "./pages/FlowCytometryServices";
import ToxicologyServices from "./pages/ToxicologyServices";
import ResearchServices from "./pages/ResearchServices";
import RequestCheckup from "./pages/RequestCheckup";
import Careers from "./pages/Careers";
import Game from "./pages/Game";
import SampleAtHome from "./pages/SampleAtHome";
import RequestView from "./pages/RequestView";
import FeedbackAdmin from "./pages/FeedbackAdmin";
import AdminLogin from "./pages/AdminLogin";
import CheckupsAdmin from "./pages/CheckupsAdmin";
import SamplingAdmin from "./pages/SamplingAdmin";
import CareersAdmin from "./pages/CareersAdmin";
import ContactsAdmin from "./pages/ContactsAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import FeedbackPage from "./pages/Feedback";
import Blog from "./pages/Blog";
import SingleBlogPost from "./pages/SingleBlogPost";
import BlogAdmin from "./pages/BlogAdmin";
import Chatbot from "./components/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<AllDoctors />} />
          <Route path="/doctors/shahrqods" element={<LocalDoctorsLanding />} />
          <Route path="/doctors/urology" element={<UrologyDoctors />} />
          <Route path="/doctors/orthopedic" element={<OrthopedicDoctors />} />
          <Route path="/doctors/gynecology" element={<GynecologyDoctors />} />
          <Route path="/doctors/general" element={<GeneralDoctors />} />
          <Route path="/doctors/internal-medicine" element={<InternalMedicineDoctors />} />
          <Route path="/doctors/midwife" element={<MidwifeDoctors />} />
          <Route path="/articles" element={<AllArticles />} />
          <Route path="/article/:id" element={<SingleArticle />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/complete-profile" element={<CompleteProfile />} />
          <Route path="/articles/pneumocystis-pneumonia" element={<PneumocystisPneumoniaArticle />} />
          <Route path="/services" element={<LabServices />} />
          <Route path="/services/hematology" element={<HematologyServices />} />
          <Route path="/services/biochemistry" element={<BiochemistryServices />} />
          <Route path="/services/coagulation" element={<CoagulationServices />} />
          <Route path="/services/microbiology" element={<MicrobiologyServices />} />
          <Route path="/services/immunology" element={<ImmunologyServices />} />
          <Route path="/services/cytology" element={<CytologyServices />} />
          <Route path="/services/molecular-diagnosis" element={<MolecularDiagnosisServices />} />
          <Route path="/services/flow-cytometry" element={<FlowCytometryServices />} />
          <Route path="/services/toxicology" element={<ToxicologyServices />} />
          <Route path="/services/research" element={<ResearchServices />} />
          <Route path="/checkups/request" element={<RequestCheckup />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<SingleBlogPost />} />
          <Route path="/sample-at-home" element={<SampleAtHome />} />
          <Route path="/r/:id" element={<RequestView />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/feedback" element={<FeedbackAdmin />} />
          <Route path="/admin/checkups" element={<CheckupsAdmin />} />
          <Route path="/admin/sampling" element={<SamplingAdmin />} />
          <Route path="/admin/careers" element={<CareersAdmin />} />
          <Route path="/admin/contacts" element={<ContactsAdmin />} />
          <Route path="/admin/blog" element={<BlogAdmin />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
