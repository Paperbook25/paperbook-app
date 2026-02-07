import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api-client'
import type {
  TransportRoute,
  CreateRouteRequest,
  Vehicle,
  CreateVehicleRequest,
  Driver,
  CreateDriverRequest,
  StopStudentAssignment,
  AssignStudentRequest,
  GPSPosition,
  MaintenanceRecord,
  CreateMaintenanceRequest,
  TransportNotification,
  TransportStats,
} from '../types/transport.types'

const BASE = '/api/transport'

// ==================== ROUTES ====================

export async function fetchRoutes(params?: { status?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.search) qs.set('search', params.search)
  return apiGet<{ data: TransportRoute[] }>(`${BASE}/routes?${qs}`)
}

export async function fetchRoute(id: string) {
  return apiGet<{ data: TransportRoute }>(`${BASE}/routes/${id}`)
}

export async function createRoute(data: CreateRouteRequest) {
  return apiPost<{ data: TransportRoute }>(`${BASE}/routes`, data)
}

export async function updateRoute(id: string, data: Partial<TransportRoute>) {
  return apiPut<{ data: TransportRoute }>(`${BASE}/routes/${id}`, data)
}

export async function deleteRoute(id: string) {
  return apiDelete<{ success: boolean }>(`${BASE}/routes/${id}`)
}

// ==================== VEHICLES ====================

export async function fetchVehicles(params?: { status?: string; type?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.type) qs.set('type', params.type)
  return apiGet<{ data: Vehicle[] }>(`${BASE}/vehicles?${qs}`)
}

export async function fetchVehicle(id: string) {
  return apiGet<{ data: Vehicle }>(`${BASE}/vehicles/${id}`)
}

export async function createVehicle(data: CreateVehicleRequest) {
  return apiPost<{ data: Vehicle }>(`${BASE}/vehicles`, data)
}

export async function updateVehicle(id: string, data: Partial<Vehicle>) {
  return apiPut<{ data: Vehicle }>(`${BASE}/vehicles/${id}`, data)
}

export async function deleteVehicle(id: string) {
  return apiDelete<{ success: boolean }>(`${BASE}/vehicles/${id}`)
}

// ==================== DRIVERS ====================

export async function fetchDrivers(params?: { status?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.search) qs.set('search', params.search)
  return apiGet<{ data: Driver[] }>(`${BASE}/drivers?${qs}`)
}

export async function fetchDriver(id: string) {
  return apiGet<{ data: Driver }>(`${BASE}/drivers/${id}`)
}

export async function createDriver(data: CreateDriverRequest) {
  return apiPost<{ data: Driver }>(`${BASE}/drivers`, data)
}

export async function updateDriver(id: string, data: Partial<Driver>) {
  return apiPut<{ data: Driver }>(`${BASE}/drivers/${id}`, data)
}

export async function deleteDriver(id: string) {
  return apiDelete<{ success: boolean }>(`${BASE}/drivers/${id}`)
}

// ==================== STUDENT ASSIGNMENTS ====================

export async function fetchAssignments(params?: { routeId?: string; stopId?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.routeId) qs.set('routeId', params.routeId)
  if (params?.stopId) qs.set('stopId', params.stopId)
  if (params?.search) qs.set('search', params.search)
  return apiGet<{ data: StopStudentAssignment[] }>(`${BASE}/assignments?${qs}`)
}

export async function assignStudent(data: AssignStudentRequest & Record<string, unknown>) {
  return apiPost<{ data: StopStudentAssignment }>(`${BASE}/assignments`, data)
}

export async function removeAssignment(id: string) {
  return apiDelete<{ success: boolean }>(`${BASE}/assignments/${id}`)
}

// ==================== GPS TRACKING ====================

export async function fetchGPSPositions() {
  return apiGet<{ data: GPSPosition[] }>(`${BASE}/tracking`)
}

// ==================== MAINTENANCE ====================

export async function fetchMaintenanceRecords(params?: { vehicleId?: string; status?: string; type?: string }) {
  const qs = new URLSearchParams()
  if (params?.vehicleId) qs.set('vehicleId', params.vehicleId)
  if (params?.status) qs.set('status', params.status)
  if (params?.type) qs.set('type', params.type)
  return apiGet<{ data: MaintenanceRecord[] }>(`${BASE}/maintenance?${qs}`)
}

export async function createMaintenanceRecord(data: CreateMaintenanceRequest) {
  return apiPost<{ data: MaintenanceRecord }>(`${BASE}/maintenance`, data)
}

export async function updateMaintenanceRecord(id: string, data: Partial<MaintenanceRecord>) {
  return apiPatch<{ data: MaintenanceRecord }>(`${BASE}/maintenance/${id}`, data)
}

// ==================== NOTIFICATIONS ====================

export async function fetchTransportNotifications(params?: { routeId?: string; eventType?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams()
  if (params?.routeId) qs.set('routeId', params.routeId)
  if (params?.eventType) qs.set('eventType', params.eventType)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  return apiGet<{ data: TransportNotification[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(`${BASE}/notifications?${qs}`)
}

export async function sendTransportNotification(data: Record<string, unknown>) {
  return apiPost<{ data: TransportNotification }>(`${BASE}/notifications/send`, data)
}

// ==================== STATS ====================

export async function fetchTransportStats() {
  return apiGet<{ data: TransportStats }>(`${BASE}/stats`)
}
