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

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// ==================== ROUTES ====================

export async function fetchRoutes(params?: { status?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.search) qs.set('search', params.search)
  return fetchJson<{ data: TransportRoute[] }>(`${BASE}/routes?${qs}`)
}

export async function fetchRoute(id: string) {
  return fetchJson<{ data: TransportRoute }>(`${BASE}/routes/${id}`)
}

export async function createRoute(data: CreateRouteRequest) {
  return fetchJson<{ data: TransportRoute }>(`${BASE}/routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateRoute(id: string, data: Partial<TransportRoute>) {
  return fetchJson<{ data: TransportRoute }>(`${BASE}/routes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteRoute(id: string) {
  return fetchJson<{ success: boolean }>(`${BASE}/routes/${id}`, { method: 'DELETE' })
}

// ==================== VEHICLES ====================

export async function fetchVehicles(params?: { status?: string; type?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.type) qs.set('type', params.type)
  return fetchJson<{ data: Vehicle[] }>(`${BASE}/vehicles?${qs}`)
}

export async function fetchVehicle(id: string) {
  return fetchJson<{ data: Vehicle }>(`${BASE}/vehicles/${id}`)
}

export async function createVehicle(data: CreateVehicleRequest) {
  return fetchJson<{ data: Vehicle }>(`${BASE}/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateVehicle(id: string, data: Partial<Vehicle>) {
  return fetchJson<{ data: Vehicle }>(`${BASE}/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteVehicle(id: string) {
  return fetchJson<{ success: boolean }>(`${BASE}/vehicles/${id}`, { method: 'DELETE' })
}

// ==================== DRIVERS ====================

export async function fetchDrivers(params?: { status?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.search) qs.set('search', params.search)
  return fetchJson<{ data: Driver[] }>(`${BASE}/drivers?${qs}`)
}

export async function fetchDriver(id: string) {
  return fetchJson<{ data: Driver }>(`${BASE}/drivers/${id}`)
}

export async function createDriver(data: CreateDriverRequest) {
  return fetchJson<{ data: Driver }>(`${BASE}/drivers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateDriver(id: string, data: Partial<Driver>) {
  return fetchJson<{ data: Driver }>(`${BASE}/drivers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteDriver(id: string) {
  return fetchJson<{ success: boolean }>(`${BASE}/drivers/${id}`, { method: 'DELETE' })
}

// ==================== STUDENT ASSIGNMENTS ====================

export async function fetchAssignments(params?: { routeId?: string; stopId?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.routeId) qs.set('routeId', params.routeId)
  if (params?.stopId) qs.set('stopId', params.stopId)
  if (params?.search) qs.set('search', params.search)
  return fetchJson<{ data: StopStudentAssignment[] }>(`${BASE}/assignments?${qs}`)
}

export async function assignStudent(data: AssignStudentRequest & Record<string, unknown>) {
  return fetchJson<{ data: StopStudentAssignment }>(`${BASE}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function removeAssignment(id: string) {
  return fetchJson<{ success: boolean }>(`${BASE}/assignments/${id}`, { method: 'DELETE' })
}

// ==================== GPS TRACKING ====================

export async function fetchGPSPositions() {
  return fetchJson<{ data: GPSPosition[] }>(`${BASE}/tracking`)
}

// ==================== MAINTENANCE ====================

export async function fetchMaintenanceRecords(params?: { vehicleId?: string; status?: string; type?: string }) {
  const qs = new URLSearchParams()
  if (params?.vehicleId) qs.set('vehicleId', params.vehicleId)
  if (params?.status) qs.set('status', params.status)
  if (params?.type) qs.set('type', params.type)
  return fetchJson<{ data: MaintenanceRecord[] }>(`${BASE}/maintenance?${qs}`)
}

export async function createMaintenanceRecord(data: CreateMaintenanceRequest) {
  return fetchJson<{ data: MaintenanceRecord }>(`${BASE}/maintenance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateMaintenanceRecord(id: string, data: Partial<MaintenanceRecord>) {
  return fetchJson<{ data: MaintenanceRecord }>(`${BASE}/maintenance/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

// ==================== NOTIFICATIONS ====================

export async function fetchTransportNotifications(params?: { routeId?: string; eventType?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams()
  if (params?.routeId) qs.set('routeId', params.routeId)
  if (params?.eventType) qs.set('eventType', params.eventType)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  return fetchJson<{ data: TransportNotification[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(`${BASE}/notifications?${qs}`)
}

export async function sendTransportNotification(data: Record<string, unknown>) {
  return fetchJson<{ data: TransportNotification }>(`${BASE}/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

// ==================== STATS ====================

export async function fetchTransportStats() {
  return fetchJson<{ data: TransportStats }>(`${BASE}/stats`)
}
