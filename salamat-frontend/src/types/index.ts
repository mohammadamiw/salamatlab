// Types for Salamat Lab Medical System

// User and Authentication Types
export interface User {
  id: string;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  city?: string;
  province?: string;
  hasBasicInsurance: 'yes' | 'no';
  basicInsurance?: string;
  complementaryInsurance?: string;
  isProfileComplete: boolean;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface LoginRequest {
  phone: string;
}

export interface VerifyOTPRequest {
  phone: string;
  code: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Address Types
export interface UserAddress {
  id: string;
  userId: string;
  title: string;
  address: string;
  postalCode?: string;
  city: string;
  province: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactName?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Doctor Types
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  specialty: string;
  specialtyCategory: string;
  subSpecialty?: string;
  medicalCouncilNumber?: string;
  experienceYears?: number;
  education?: string;
  phone?: string;
  email?: string;
  bio?: string;
  services?: string;
  profileImage?: string;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  consultationFee?: number;
  homeVisitFee?: number;
  availableDays?: string[];
  availableHours?: { start: string; end: string }[];
  createdAt: string;
  updatedAt: string;
}

// Medical Service Types
export interface MedicalService {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  description?: string;
  preparationInstructions?: string;
  basePrice?: number;
  homeServicePrice?: number;
  urgentServicePrice?: number;
  durationMinutes?: number;
  preparationTimeHours: number;
  ageMin?: number;
  ageMax?: number;
  genderRestriction: 'male' | 'female' | 'both';
  isActive: boolean;
  requiresAppointment: boolean;
  homeServiceAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Checkup Request Types
export interface CheckupRequest {
  id: string;
  userId: string;
  serviceId?: string;
  doctorId?: string;
  title: string;
  patientName: string;
  patientPhone: string;
  patientNationalId?: string;
  patientBirthDate?: string;
  patientGender?: 'male' | 'female';
  patientCity?: string;
  hasInsurance: boolean;
  insuranceType?: string;
  preferredDate?: string;
  preferredTime?: string;
  appointmentDate?: string;
  addressId?: string;
  customAddress?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  priority: 'normal' | 'urgent' | 'emergency';
  estimatedPrice?: number;
  finalPrice?: number;
  patientNotes?: string;
  adminNotes?: string;
  doctorNotes?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

export interface CheckupRequestForm {
  serviceId?: string;
  doctorId?: string;
  title: string;
  patientName: string;
  patientPhone: string;
  patientNationalId?: string;
  patientBirthDate?: string;
  patientGender?: 'male' | 'female';
  patientCity?: string;
  hasInsurance: boolean;
  insuranceType?: string;
  preferredDate?: string;
  preferredTime?: string;
  addressId?: string;
  customAddress?: string;
  priority: 'normal' | 'urgent' | 'emergency';
  patientNotes?: string;
}

// Home Sampling Types
export interface HomeSamplingRequest {
  id: string;
  userId: string;
  serviceIds: string[];
  title: string;
  patientName: string;
  patientPhone: string;
  patientNationalId?: string;
  patientBirthDate?: string;
  patientGender?: 'male' | 'female';
  addressId?: string;
  customAddress?: string;
  addressLatitude?: number;
  addressLongitude?: number;
  preferredDate?: string;
  preferredTimeStart?: string;
  preferredTimeEnd?: string;
  scheduledDatetime?: string;
  status: 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'collected' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent';
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  servicePrice?: number;
  transportPrice?: number;
  totalPrice?: number;
  patientNotes?: string;
  adminNotes?: string;
  technicianNotes?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

export interface HomeSamplingRequestForm {
  serviceIds: string[];
  title: string;
  patientName: string;
  patientPhone: string;
  patientNationalId?: string;
  patientBirthDate?: string;
  patientGender?: 'male' | 'female';
  addressId?: string;
  customAddress?: string;
  preferredDate?: string;
  preferredTimeStart?: string;
  preferredTimeEnd?: string;
  priority: 'normal' | 'urgent';
  patientNotes?: string;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  galleryImages?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'general' | 'appointment' | 'complaint' | 'suggestion' | 'technical';
  status: 'new' | 'read' | 'replied' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  adminReply?: string;
  repliedAt?: string;
  repliedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'general' | 'appointment' | 'complaint' | 'suggestion' | 'technical';
}

// Feedback Types
export interface FeedbackSurvey {
  id: string;
  userId?: string;
  serviceType: 'checkup' | 'home_sampling' | 'general';
  serviceId?: string;
  overallRating: number;
  serviceQuality: number;
  staffBehavior: number;
  timeliness: number;
  cleanliness: number;
  positiveFeedback?: string;
  negativeFeedback?: string;
  suggestions?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  isAnonymous: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackForm {
  serviceType: 'checkup' | 'home_sampling' | 'general';
  serviceId?: string;
  overallRating: number;
  serviceQuality: number;
  staffBehavior: number;
  timeliness: number;
  cleanliness: number;
  positiveFeedback?: string;
  negativeFeedback?: string;
  suggestions?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  isAnonymous: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Form Validation Types
export interface FormErrors {
  [key: string]: string | undefined;
}

// Navigation Types
export interface MenuItem {
  title: string;
  href: string;
  icon?: string;
  children?: MenuItem[];
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

// System Settings Types
export interface SystemSetting {
  id: string;
  settingKey: string;
  settingValue: string;
  settingType: 'string' | 'integer' | 'boolean' | 'json';
  description?: string;
  category: string;
  isPublic: boolean;
  isEditable: boolean;
  createdAt: string;
  updatedAt: string;
}
