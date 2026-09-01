/** Una funcion por recurso: el resto de la app no arma rutas a mano. */
import { api, setToken, unwrap } from './api';
import type {
  DiagnosticQuestion,
  DiagnosticSession,
  Household,
  Paginated,
  Professional,
  ProfessionalDetail,
  ServiceCategory,
  ServiceRequest,
  User,
} from '@/types';

export async function login(email: string, password: string): Promise<User> {
  const tokens = await api.post<{ access: string; refresh: string }>('/auth/token/', {
    email,
    password,
  });
  setToken(tokens.access);
  return api.get<User>('/auth/me/');
}

export function logout(): void {
  setToken(null);
}

export const getMe = () => api.get<User>('/auth/me/');

export async function listCategories(): Promise<ServiceCategory[]> {
  return unwrap(await api.get<Paginated<ServiceCategory> | ServiceCategory[]>('/categories/'));
}

export const getCategory = (slug: string) => api.get<ServiceCategory>(`/categories/${slug}/`);

export async function listHouseholds(): Promise<Household[]> {
  return unwrap(await api.get<Paginated<Household> | Household[]>('/households/'));
}

export const listDiagnosticQuestions = () =>
  api.get<DiagnosticQuestion[]>('/diagnosis/questions/');

export interface DiagnosticInput {
  description: string;
  household?: number | null;
  answers: { question: number; option: number | null }[];
}

export const createDiagnosticSession = (input: DiagnosticInput) =>
  api.post<DiagnosticSession>('/diagnosis/sessions/', input);

export interface ProfessionalSearch {
  lat?: number;
  lng?: number;
  radius_km?: number;
  category?: string;
  accepts_urgent?: boolean;
}

export async function searchProfessionals(params: ProfessionalSearch): Promise<Professional[]> {
  const payload = await api.get<Paginated<Professional> | Professional[]>(
    '/professionals/',
    params as Record<string, string | number | boolean | undefined>,
  );
  return unwrap(payload);
}

export const getProfessional = (id: number) =>
  api.get<ProfessionalDetail>(`/professionals/${id}/`);

export interface ServiceRequestInput {
  household: number;
  selected_category: number;
  suggested_category?: number | null;
  diagnostic_session?: number | null;
  description?: string;
  urgency?: 'flexible' | 'this_week' | 'urgent';
  search_radius_km?: number;
}

export const createServiceRequest = (input: ServiceRequestInput) =>
  api.post<ServiceRequest>('/requests/', input);

export const scheduleVisit = (input: {
  service_request: number;
  professional: number;
  scheduled_for?: string;
  client_notes?: string;
}) => api.post('/orders/', input);
