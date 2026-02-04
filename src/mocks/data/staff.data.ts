import { faker } from '@faker-js/faker'

export interface Staff {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female'
  department: string
  designation: string
  joiningDate: string
  photoUrl: string
  qualification: string[]
  specialization: string
  salary: number
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  status: 'active' | 'on_leave' | 'resigned'
}

const DEPARTMENTS = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science', 'Physical Education', 'Art', 'Music', 'Administration']
const DESIGNATIONS = ['Principal', 'Vice Principal', 'Senior Teacher', 'Teacher', 'Assistant Teacher', 'Lab Assistant', 'Librarian', 'Accountant', 'Clerk', 'Peon']
const QUALIFICATIONS = ['B.Ed', 'M.Ed', 'B.A.', 'M.A.', 'B.Sc.', 'M.Sc.', 'B.Com', 'M.Com', 'Ph.D.', 'MBA']
const INDIAN_STATES = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Kerala', 'Telangana']

function createStaff(): Staff {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const joiningYear = faker.date.past({ years: 10 }).getFullYear()
  const gender = faker.helpers.arrayElement(['male', 'female']) as 'male' | 'female'
  const department = faker.helpers.arrayElement(DEPARTMENTS)

  return {
    id: faker.string.uuid(),
    employeeId: `EMP${joiningYear}${faker.string.numeric(4)}`,
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: `+91 ${faker.string.numeric(10)}`,
    dateOfBirth: faker.date.birthdate({ min: 25, max: 60, mode: 'age' }).toISOString(),
    gender,
    department,
    designation: faker.helpers.arrayElement(DESIGNATIONS),
    joiningDate: faker.date.past({ years: 10 }).toISOString(),
    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}&backgroundColor=b6e3f4`,
    qualification: faker.helpers.arrayElements(QUALIFICATIONS, { min: 1, max: 3 }),
    specialization: department,
    salary: faker.number.int({ min: 25000, max: 100000 }),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.helpers.arrayElement(INDIAN_STATES),
      pincode: faker.string.numeric(6),
    },
    status: faker.helpers.weightedArrayElement([
      { value: 'active', weight: 90 },
      { value: 'on_leave', weight: 7 },
      { value: 'resigned', weight: 3 },
    ]) as Staff['status'],
  }
}

// Generate 35 staff members
export const staff: Staff[] = Array.from({ length: 35 }, createStaff)

// Helper to get stats
export const staffStats = {
  total: staff.length,
  active: staff.filter((s) => s.status === 'active').length,
  byDepartment: DEPARTMENTS.reduce((acc, dept) => {
    acc[dept] = staff.filter((s) => s.department === dept).length
    return acc
  }, {} as Record<string, number>),
  byGender: {
    male: staff.filter((s) => s.gender === 'male').length,
    female: staff.filter((s) => s.gender === 'female').length,
  },
}
