import { faker } from '@faker-js/faker'

export interface Student {
  id: string
  admissionNumber: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female'
  bloodGroup: string
  class: string
  section: string
  rollNumber: number
  admissionDate: string
  photoUrl: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  parent: {
    fatherName: string
    motherName: string
    guardianPhone: string
    guardianEmail: string
    occupation: string
  }
  status: 'active' | 'inactive' | 'graduated' | 'transferred'
}

const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const SECTIONS = ['A', 'B', 'C', 'D']
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const INDIAN_STATES = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Kerala', 'Telangana']

function createStudent(): Student {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const admissionYear = faker.date.past({ years: 5 }).getFullYear()
  const gender = faker.helpers.arrayElement(['male', 'female']) as 'male' | 'female'

  return {
    id: faker.string.uuid(),
    admissionNumber: `ADM${admissionYear}${faker.string.numeric(4)}`,
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: `+91 ${faker.string.numeric(10)}`,
    dateOfBirth: faker.date.birthdate({ min: 5, max: 18, mode: 'age' }).toISOString(),
    gender,
    bloodGroup: faker.helpers.arrayElement(BLOOD_GROUPS),
    class: faker.helpers.arrayElement(CLASSES),
    section: faker.helpers.arrayElement(SECTIONS),
    rollNumber: faker.number.int({ min: 1, max: 50 }),
    admissionDate: faker.date.past({ years: 3 }).toISOString(),
    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.helpers.arrayElement(INDIAN_STATES),
      pincode: faker.string.numeric(6),
    },
    parent: {
      fatherName: faker.person.fullName({ sex: 'male' }),
      motherName: faker.person.fullName({ sex: 'female' }),
      guardianPhone: `+91 ${faker.string.numeric(10)}`,
      guardianEmail: faker.internet.email(),
      occupation: faker.person.jobTitle(),
    },
    status: faker.helpers.weightedArrayElement([
      { value: 'active', weight: 85 },
      { value: 'inactive', weight: 5 },
      { value: 'graduated', weight: 8 },
      { value: 'transferred', weight: 2 },
    ]) as Student['status'],
  }
}

// Generate 150 students
export const students: Student[] = Array.from({ length: 150 }, createStudent)

// Helper to get stats
export const studentStats = {
  total: students.length,
  active: students.filter((s) => s.status === 'active').length,
  byClass: CLASSES.reduce((acc, cls) => {
    acc[cls] = students.filter((s) => s.class === cls).length
    return acc
  }, {} as Record<string, number>),
  byGender: {
    male: students.filter((s) => s.gender === 'male').length,
    female: students.filter((s) => s.gender === 'female').length,
  },
}
