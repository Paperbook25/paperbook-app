import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { SchoolProfileForm } from '../components/SchoolProfileForm'
import { AcademicYearList } from '../components/AcademicYearList'
import { ClassSectionManager } from '../components/ClassSectionManager'
import { UserList } from '../components/UserList'
import { NotificationSettings } from '../components/NotificationSettings'
import { BackupSettings } from '../components/BackupSettings'
import { ThemeSettings } from '../components/ThemeSettings'
import { AuditLogView } from '../components/AuditLogView'
import { AcademicCalendar } from '../components/AcademicCalendar'
import { EmailTemplateManager } from '../components/EmailTemplateManager'

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your school's configuration and preferences"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Settings' }]}
      />

      <Tabs defaultValue="school" className="space-y-6">
        <TabsList className="flex flex-wrap w-full">
          <TabsTrigger value="school">School</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="school">
          <SchoolProfileForm />
        </TabsContent>

        <TabsContent value="academic">
          <AcademicYearList />
        </TabsContent>

        <TabsContent value="calendar">
          <AcademicCalendar />
        </TabsContent>

        <TabsContent value="classes">
          <ClassSectionManager />
        </TabsContent>

        <TabsContent value="users">
          <UserList />
        </TabsContent>

        <TabsContent value="templates">
          <EmailTemplateManager />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogView />
        </TabsContent>

        <TabsContent value="backup">
          <BackupSettings />
        </TabsContent>

        <TabsContent value="appearance">
          <ThemeSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
