import { useState } from 'react'
import { Plus, Bus, MapPin, User, Route, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { cn, getInitials } from '@/lib/utils'

const mockRoutes = [
  { id: 'r1', name: 'Route A - North Zone', stops: 12, students: 45, driver: 'Ramesh Kumar', vehicle: 'KA-01-AB-1234', status: 'active' },
  { id: 'r2', name: 'Route B - South Zone', stops: 10, students: 38, driver: 'Suresh Singh', vehicle: 'KA-01-CD-5678', status: 'active' },
  { id: 'r3', name: 'Route C - East Zone', stops: 8, students: 32, driver: 'Mahesh Rao', vehicle: 'KA-01-EF-9012', status: 'active' },
  { id: 'r4', name: 'Route D - West Zone', stops: 15, students: 52, driver: 'Ganesh Patil', vehicle: 'KA-01-GH-3456', status: 'active' },
  { id: 'r5', name: 'Route E - Central', stops: 6, students: 28, driver: 'Dinesh Sharma', vehicle: 'KA-01-IJ-7890', status: 'maintenance' },
]

const mockVehicles = [
  { id: 'v1', number: 'KA-01-AB-1234', type: 'Bus', capacity: 50, assigned: 'Route A', status: 'running', lastService: '2024-11-15' },
  { id: 'v2', number: 'KA-01-CD-5678', type: 'Bus', capacity: 45, assigned: 'Route B', status: 'running', lastService: '2024-11-20' },
  { id: 'v3', number: 'KA-01-EF-9012', type: 'Mini Bus', capacity: 35, assigned: 'Route C', status: 'running', lastService: '2024-11-10' },
  { id: 'v4', number: 'KA-01-GH-3456', type: 'Bus', capacity: 55, assigned: 'Route D', status: 'running', lastService: '2024-11-25' },
  { id: 'v5', number: 'KA-01-IJ-7890', type: 'Mini Bus', capacity: 30, assigned: 'Route E', status: 'maintenance', lastService: '2024-10-30' },
]

const mockDrivers = [
  { id: 'd1', name: 'Ramesh Kumar', phone: '+91 9876543210', license: 'DL-1234567890', experience: '8 years', assigned: 'Route A', status: 'active' },
  { id: 'd2', name: 'Suresh Singh', phone: '+91 9876543211', license: 'DL-2345678901', experience: '5 years', assigned: 'Route B', status: 'active' },
  { id: 'd3', name: 'Mahesh Rao', phone: '+91 9876543212', license: 'DL-3456789012', experience: '10 years', assigned: 'Route C', status: 'active' },
  { id: 'd4', name: 'Ganesh Patil', phone: '+91 9876543213', license: 'DL-4567890123', experience: '6 years', assigned: 'Route D', status: 'active' },
  { id: 'd5', name: 'Dinesh Sharma', phone: '+91 9876543214', license: 'DL-5678901234', experience: '4 years', assigned: 'Route E', status: 'on_leave' },
]

export function TransportPage() {
  const stats = {
    totalRoutes: mockRoutes.length,
    totalVehicles: mockVehicles.length,
    totalDrivers: mockDrivers.length,
    studentsUsing: mockRoutes.reduce((acc, r) => acc + r.students, 0),
  }

  return (
    <div>
      <PageHeader
        title="Transport"
        description="Manage school transportation"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Transport' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Navigation className="h-4 w-4 mr-2" />
              Track Buses
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Route
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Route className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalRoutes}</p>
              <p className="text-xs text-muted-foreground">Active Routes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Bus className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalVehicles}</p>
              <p className="text-xs text-muted-foreground">Vehicles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalDrivers}</p>
              <p className="text-xs text-muted-foreground">Drivers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <User className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.studentsUsing}</p>
              <p className="text-xs text-muted-foreground">Students Using</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockRoutes.map((route) => (
              <Card key={route.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{route.name}</CardTitle>
                    <Badge variant={route.status === 'active' ? 'success' : 'warning'}>
                      {route.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Stops</span>
                      <span className="font-medium">{route.stops}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Students</span>
                      <span className="font-medium">{route.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Driver</span>
                      <span className="font-medium">{route.driver}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Vehicle</span>
                      <span className="font-mono text-xs">{route.vehicle}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockVehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-mono">{vehicle.number}</CardTitle>
                    <Badge variant={vehicle.status === 'running' ? 'success' : 'warning'}>
                      {vehicle.status}
                    </Badge>
                  </div>
                  <CardDescription>{vehicle.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">{vehicle.capacity} seats</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Assigned To</span>
                      <span className="font-medium">{vehicle.assigned}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Service</span>
                      <span className="text-xs">{vehicle.lastService}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockDrivers.map((driver) => (
              <Card key={driver.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(driver.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{driver.name}</p>
                        <Badge variant={driver.status === 'active' ? 'success' : 'warning'}>
                          {driver.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{driver.phone}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">License</span>
                          <span className="font-mono text-xs">{driver.license}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Experience</span>
                          <span>{driver.experience}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Assigned</span>
                          <span>{driver.assigned}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Live Bus Tracking</CardTitle>
              <CardDescription>Real-time location of school buses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Map integration coming soon...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
