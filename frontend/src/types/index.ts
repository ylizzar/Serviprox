export type UserRole = 'client' | 'professional' | 'staff';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone: string;
  city: string;
  initials: string;
  is_identity_verified: boolean;
  created_at: string;
}

export interface Household {
  id: number;
  label: string;
  property_type: 'apartment' | 'house' | 'office' | 'commercial';
  address_line: string;
  neighborhood: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  area_m2: number | null;
  build_year: number | null;
  notes: string;
  is_default: boolean;
  short_location: string;
  created_at: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_key: string;
  professionals_count: number;
  services?: Service[];
}

export interface Service {
  id: number;
  category: number;
  category_slug: string;
  name: string;
  slug: string;
  description: string;
  price_min: string | null;
  price_max: string | null;
  estimated_hours: string | null;
}

export interface DiagnosticOption {
  id: number;
  value: string;
  label: string;
  order: number;
}

export interface DiagnosticQuestion {
  id: number;
  code: string;
  text: string;
  help_text: string;
  order: number;
  is_required: boolean;
  options: DiagnosticOption[];
}

export interface RankedCategory {
  slug: string;
  name: string;
  score: number;
}

export interface DiagnosticSession {
  id: number;
  description: string;
  status: 'draft' | 'suggested' | 'confirmed' | 'discarded';
  household: number | null;
  /** Sugerencia del sistema: informativa, nunca vinculante. */
  suggested_category: ServiceCategory | null;
  confidence: number;
  rationale: string;
  ranking: RankedCategory[];
  created_at: string;
}

export interface Professional {
  id: number;
  display_name: string;
  initials: string;
  headline: string;
  rating_avg: string;
  jobs_completed: number;
  is_verified: boolean;
  accepts_urgent: boolean;
  neighborhood: string;
  city: string;
  latitude: number;
  longitude: number;
  /** Presente solo cuando la busqueda incluye lat/lng. */
  distance_km?: number;
  categories: string[];
}

export interface ProfessionalDetail extends Professional {
  bio: string;
  coverage_radius_km: number;
  response_time_minutes: number;
  services: {
    id: number;
    category: number;
    category_name: string;
    category_slug: string;
    price_min: string | null;
    price_max: string | null;
    years_experience: number;
  }[];
  availability: {
    id: number;
    weekday: number;
    weekday_label: string;
    start_time: string;
    end_time: string;
  }[];
  portfolio: { id: number; image_url: string; caption: string; sort_order: number }[];
}

export interface RequestCandidate {
  id: number;
  professional: Professional;
  distance_km: number;
  status: 'suggested' | 'contacted' | 'quoted' | 'declined' | 'hired';
  created_at: string;
}

export interface ServiceRequest {
  id: number;
  household: number;
  diagnostic_session: number | null;
  suggested_category: ServiceCategory | null;
  selected_category: ServiceCategory;
  followed_suggestion: boolean | null;
  description: string;
  urgency: 'flexible' | 'this_week' | 'urgent';
  search_radius_km: number;
  status: 'draft' | 'open' | 'matched' | 'closed' | 'cancelled';
  candidates: RequestCandidate[];
  created_at: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
