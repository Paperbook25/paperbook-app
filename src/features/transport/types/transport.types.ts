export type RouteStatus = 'active' | 'inactive' | 'maintenance'
export type VehicleStatus = 'running' | 'maintenance' | 'idle' | 'decommissioned'
export type DriverStatus = 'active' | 'on_leave' | 'inactive'
export type TripStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled'
export type TripType = 'pickup' | 'drop'
export type MaintenanceType = 'routine' | 'repair' | 'inspection' | 'insurance' | 'fitness_certificate'
export type NotificationEventType = 'boarded' | 'alighted' | 'delay' | 'route_change' | 'breakdown'

export const ROUTE_STATUS_LABELS: Record<RouteStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  maintenance: 'Under Maintenance',
}

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  running: 'Running',
  maintenance: 'In Maintenance',
  idle: 'Idle',
  decommissioned: 'Decommissioned',
}

export const DRIVER_STATUS_LABELS: Record<DriverStatus, string> = {
  active: 'Active',
  on_leave: 'On Leave',
  inactive: 'Inactive',
}

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export interface RouteStop {
  id: string
  name: string
  landmark: string
  pickupTime: string // HH:mm
  dropTime: string   // HH:mm
  distanceFromSchool: number // km
  order: number
  studentCount: number
}

export interface TransportRoute {
  id: string
  name: string
  code: string
  description: string
  stops: RouteStop[]
  totalStudents: number
  totalDistance: number // km
  assignedVehicleId: string | null
  assignedDriverId: string | null
  status: RouteStatus
  monthlyFee: number
  createdAt: string
  updatedAt: string
}

export interface CreateRouteRequest {
  name: string
  code: string
  description: string
  stops: Omit<RouteStop, 'id' | 'studentCount'>[]
  monthlyFee: number
}

export interface Vehicle {
  id: string
  registrationNumber: string
  type: 'bus' | 'mini_bus' | 'van'
  make: string
  model: string
  year: number
  capacity: number
  fuelType: 'diesel' | 'petrol' | 'cng' | 'electric'
  chassisNumber: string
  engineNumber: string
  insuranceExpiry: string
  fitnessExpiry: string
  permitExpiry: string
  lastServiceDate: string
  nextServiceDue: string
  odometerReading: number
  assignedRouteId: string | null
  status: VehicleStatus
  gpsDeviceId: string | null
  features: string[]
  createdAt: string
}

export const VEHICLE_TYPE_LABELS: Record<Vehicle['type'], string> = {
  bus: 'Bus',
  mini_bus: 'Mini Bus',
  van: 'Van',
}

export interface CreateVehicleRequest {
  registrationNumber: string
  type: Vehicle['type']
  make: string
  model: string
  year: number
  capacity: number
  fuelType: Vehicle['fuelType']
  chassisNumber: string
  engineNumber: string
  insuranceExpiry: string
  fitnessExpiry: string
  permitExpiry: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  email: string
  licenseNumber: string
  licenseExpiry: string
  licenseType: string
  experience: number // years
  address: string
  emergencyContact: string
  bloodGroup: string
  photoUrl: string
  assignedRouteId: string | null
  assignedVehicleId: string | null
  status: DriverStatus
  joiningDate: string
  salary: number
  createdAt: string
}

export interface CreateDriverRequest {
  name: string
  phone: string
  email: string
  licenseNumber: string
  licenseExpiry: string
  licenseType: string
  experience: number
  address: string
  emergencyContact: string
  bloodGroup: string
  salary: number
}

export interface StopStudentAssignment {
  id: string
  studentId: string
  studentName: string
  class: string
  section: string
  routeId: string
  stopId: string
  stopName: string
  parentPhone: string
  monthlyFee: number
  assignedDate: string
  isActive: boolean
}

export interface AssignStudentRequest {
  studentId: string
  routeId: string
  stopId: string
}

export interface GPSPosition {
  routeId: string
  vehicleId: string
  driverName: string
  lat: number
  lng: number
  speed: number // km/h
  heading: number // degrees
  lastUpdated: string
  tripStatus: TripStatus
  tripType: TripType
  currentStop: string
  nextStop: string
  eta: string // minutes
  studentsOnBoard: number
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  vehicleNumber: string
  type: MaintenanceType
  description: string
  scheduledDate: string
  completedDate: string | null
  cost: number
  vendor: string
  notes: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue'
  documents: string[]
  createdAt: string
}

export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  routine: 'Routine Service',
  repair: 'Repair',
  inspection: 'Inspection',
  insurance: 'Insurance Renewal',
  fitness_certificate: 'Fitness Certificate',
}

export const MAINTENANCE_STATUS_LABELS: Record<MaintenanceRecord['status'], string> = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
}

export interface CreateMaintenanceRequest {
  vehicleId: string
  type: MaintenanceType
  description: string
  scheduledDate: string
  cost: number
  vendor: string
  notes: string
}

export interface TransportNotification {
  id: string
  studentId: string
  studentName: string
  parentPhone: string
  routeId: string
  routeName: string
  stopName: string
  eventType: NotificationEventType
  message: string
  sentAt: string
  channel: 'sms' | 'whatsapp' | 'push'
  status: 'sent' | 'delivered' | 'failed'
}

export const NOTIFICATION_EVENT_LABELS: Record<NotificationEventType, string> = {
  boarded: 'Boarded Bus',
  alighted: 'Alighted from Bus',
  delay: 'Bus Delayed',
  route_change: 'Route Changed',
  breakdown: 'Bus Breakdown',
}

export interface TransportStats {
  totalRoutes: number
  activeRoutes: number
  totalVehicles: number
  runningVehicles: number
  totalDrivers: number
  activeDrivers: number
  totalStudentsUsing: number
  upcomingMaintenance: number
}
