import { faker } from '@faker-js/faker'
import { students, studentStats } from './students.data'
import { staff, staffStats } from './staff.data'

export const dashboardStats = {
  totalStudents: studentStats.total,
  activeStudents: studentStats.active,
  totalStaff: staffStats.total,
  activeStaff: staffStats.active,
  totalFeeCollected: 4523000,
  pendingFees: 876000,
  attendanceToday: 92.5,
  newAdmissions: 12,
}

export const feeCollectionData = [
  { month: 'Apr', collected: 450000, pending: 120000 },
  { month: 'May', collected: 520000, pending: 95000 },
  { month: 'Jun', collected: 380000, pending: 140000 },
  { month: 'Jul', collected: 620000, pending: 80000 },
  { month: 'Aug', collected: 550000, pending: 110000 },
  { month: 'Sep', collected: 480000, pending: 130000 },
  { month: 'Oct', collected: 590000, pending: 90000 },
  { month: 'Nov', collected: 510000, pending: 105000 },
  { month: 'Dec', collected: 423000, pending: 6000 },
]

export const attendanceData = [
  { day: 'Mon', present: 95, absent: 5 },
  { day: 'Tue', present: 92, absent: 8 },
  { day: 'Wed', present: 88, absent: 12 },
  { day: 'Thu', present: 94, absent: 6 },
  { day: 'Fri', present: 90, absent: 10 },
  { day: 'Sat', present: 85, absent: 15 },
]

export const classWiseStudents = Object.entries(studentStats.byClass).map(([className, count]) => ({
  name: className.replace('Class ', ''),
  students: count,
}))

export const announcements = [
  {
    id: '1',
    title: 'Annual Day Celebration',
    content: 'The school annual day will be celebrated on 15th December. All students are requested to participate.',
    priority: 'high' as const,
    createdAt: faker.date.recent({ days: 1 }).toISOString(),
    createdBy: 'Principal',
  },
  {
    id: '2',
    title: 'Winter Vacation Notice',
    content: 'Winter vacation will commence from 20th December to 5th January. School will reopen on 6th January.',
    priority: 'medium' as const,
    createdAt: faker.date.recent({ days: 3 }).toISOString(),
    createdBy: 'Administration',
  },
  {
    id: '3',
    title: 'Parent-Teacher Meeting',
    content: 'PTM scheduled for Class 10 and 12 students on Saturday, 10 AM - 1 PM.',
    priority: 'medium' as const,
    createdAt: faker.date.recent({ days: 5 }).toISOString(),
    createdBy: 'Academic Coordinator',
  },
]

export const upcomingEvents = [
  {
    id: '1',
    title: 'Unit Test - Class 10',
    date: faker.date.soon({ days: 3 }).toISOString(),
    type: 'exam' as const,
    description: 'Unit test for all subjects',
  },
  {
    id: '2',
    title: 'Science Exhibition',
    date: faker.date.soon({ days: 7 }).toISOString(),
    type: 'event' as const,
    description: 'Annual science exhibition for classes 6-12',
  },
  {
    id: '3',
    title: 'Staff Meeting',
    date: faker.date.soon({ days: 2 }).toISOString(),
    type: 'meeting' as const,
    description: 'Monthly staff meeting at 4 PM',
  },
  {
    id: '4',
    title: 'Christmas Holiday',
    date: new Date('2024-12-25').toISOString(),
    type: 'holiday' as const,
    description: 'School closed for Christmas',
  },
]

export const recentActivities = [
  {
    id: '1',
    action: 'New Admission',
    description: 'Rahul Sharma admitted to Class 5-A',
    timestamp: faker.date.recent({ days: 0.1 }).toISOString(),
    user: { name: 'Admin', avatar: '' },
  },
  {
    id: '2',
    action: 'Fee Collected',
    description: '₹15,000 collected from Priya Singh (Class 8-B)',
    timestamp: faker.date.recent({ days: 0.2 }).toISOString(),
    user: { name: 'Accountant', avatar: '' },
  },
  {
    id: '3',
    action: 'Leave Approved',
    description: 'Leave approved for Amit Kumar (Teacher) - 2 days',
    timestamp: faker.date.recent({ days: 0.5 }).toISOString(),
    user: { name: 'Principal', avatar: '' },
  },
  {
    id: '4',
    action: 'Book Issued',
    description: '"Introduction to Physics" issued to Sneha Reddy',
    timestamp: faker.date.recent({ days: 0.8 }).toISOString(),
    user: { name: 'Librarian', avatar: '' },
  },
  {
    id: '5',
    action: 'Attendance Marked',
    description: 'Attendance marked for Class 10-A - 42 present, 3 absent',
    timestamp: faker.date.recent({ days: 1 }).toISOString(),
    user: { name: 'Class Teacher', avatar: '' },
  },
]

export const quickStats = {
  todayBirthdays: students.filter((s) => {
    const today = new Date()
    const dob = new Date(s.dateOfBirth)
    return dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth()
  }).length,
  pendingLeaveRequests: 5,
  overdueBooks: 12,
  upcomingExams: 3,
}
