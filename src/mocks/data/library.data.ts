import { faker } from '@faker-js/faker'
import { students } from './students.data'
import type {
  Book,
  BookCategory,
  IssuedBook,
  Fine,
  FINE_RATE_PER_DAY,
} from '@/features/library/types/library.types'

// ==================== CONSTANTS ====================

const BOOK_CATEGORIES: BookCategory[] = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Mathematics',
  'History',
  'Literature',
  'Reference',
  'Biography',
  'Technology',
  'Arts',
]

const PUBLISHERS = [
  'Penguin Random House',
  'HarperCollins',
  'Simon & Schuster',
  'Macmillan Publishers',
  'Hachette Book Group',
  'Oxford University Press',
  'Cambridge University Press',
  'Pearson Education',
  'McGraw-Hill Education',
  'Scholastic',
  'National Book Trust',
  'Rupa Publications',
  'Arihant Publications',
]

const SHELF_LOCATIONS = [
  'A1', 'A2', 'A3', 'A4', 'A5',
  'B1', 'B2', 'B3', 'B4', 'B5',
  'C1', 'C2', 'C3', 'C4', 'C5',
  'D1', 'D2', 'D3', 'D4', 'D5',
  'R1', 'R2', 'R3', // Reference section
]

// Book titles by category for realistic data
const BOOK_TITLES: Record<BookCategory, string[]> = {
  Fiction: [
    'The Great Gatsby', 'To Kill a Mockingbird', 'Pride and Prejudice',
    '1984', 'The Catcher in the Rye', 'Lord of the Flies',
    'Animal Farm', 'Brave New World', 'The Alchemist',
    'One Hundred Years of Solitude', 'The Kite Runner', 'Life of Pi',
  ],
  'Non-Fiction': [
    'Sapiens', 'Thinking Fast and Slow', 'The Power of Habit',
    'Atomic Habits', 'Deep Work', 'The Lean Startup',
    'Outliers', 'Freakonomics', 'The Tipping Point',
  ],
  Science: [
    'A Brief History of Time', 'The Selfish Gene', 'Cosmos',
    'The Origin of Species', 'Silent Spring', 'The Double Helix',
    'Principles of Physics', 'Chemistry: The Central Science',
    'Campbell Biology', 'Environmental Science',
  ],
  Mathematics: [
    'Introduction to Algorithms', 'Calculus Made Easy', 'The Joy of x',
    'How to Solve It', 'Principles of Mathematical Analysis',
    'Linear Algebra Done Right', 'Discrete Mathematics',
    'Statistics for Beginners', 'Probability Theory',
  ],
  History: [
    'Guns, Germs, and Steel', 'The Diary of a Young Girl',
    'A People\'s History of the United States', 'The History of India',
    'World War II: A Complete History', 'The Rise and Fall of the Roman Empire',
    'Ancient Civilizations', 'Modern Indian History',
  ],
  Literature: [
    'Hamlet', 'Romeo and Juliet', 'Macbeth', 'The Odyssey',
    'The Iliad', 'Divine Comedy', 'Paradise Lost',
    'Gitanjali', 'The Guide', 'Midnight\'s Children',
  ],
  Reference: [
    'Oxford English Dictionary', 'Encyclopedia Britannica',
    'World Atlas', 'Thesaurus', 'Grammar in Use',
    'Scientific Encyclopedia', 'Medical Dictionary',
  ],
  Biography: [
    'Steve Jobs', 'The Autobiography of Malcolm X',
    'Long Walk to Freedom', 'Wings of Fire',
    'My Experiments with Truth', 'Einstein: His Life and Universe',
    'Alexander Hamilton', 'The Diary of Anne Frank',
  ],
  Technology: [
    'Clean Code', 'The Pragmatic Programmer', 'Design Patterns',
    'Computer Networks', 'Operating System Concepts',
    'Database System Concepts', 'Artificial Intelligence: A Modern Approach',
    'Web Development with Node.js', 'Python for Data Science',
  ],
  Arts: [
    'The Story of Art', 'Ways of Seeing', 'Art Through the Ages',
    'Drawing on the Right Side of the Brain', 'Color and Light',
    'Music Theory for Beginners', 'The Elements of Graphic Design',
  ],
}

const AUTHORS_BY_CATEGORY: Record<BookCategory, string[]> = {
  Fiction: [
    'F. Scott Fitzgerald', 'Harper Lee', 'Jane Austen', 'George Orwell',
    'J.D. Salinger', 'William Golding', 'Aldous Huxley', 'Paulo Coelho',
    'Gabriel García Márquez', 'Khaled Hosseini', 'Yann Martel',
  ],
  'Non-Fiction': [
    'Yuval Noah Harari', 'Daniel Kahneman', 'Charles Duhigg',
    'James Clear', 'Cal Newport', 'Eric Ries', 'Malcolm Gladwell',
  ],
  Science: [
    'Stephen Hawking', 'Richard Dawkins', 'Carl Sagan', 'Charles Darwin',
    'Rachel Carson', 'James Watson', 'Isaac Newton',
  ],
  Mathematics: [
    'Thomas H. Cormen', 'Silvanus P. Thompson', 'Steven Strogatz',
    'George Pólya', 'Walter Rudin', 'Sheldon Axler',
  ],
  History: [
    'Jared Diamond', 'Anne Frank', 'Howard Zinn', 'Romila Thapar',
    'William Shirer', 'Edward Gibbon',
  ],
  Literature: [
    'William Shakespeare', 'Homer', 'Dante Alighieri', 'John Milton',
    'Rabindranath Tagore', 'R.K. Narayan', 'Salman Rushdie',
  ],
  Reference: [
    'Various Authors', 'Editorial Board', 'Academic Press',
  ],
  Biography: [
    'Walter Isaacson', 'Alex Haley', 'Nelson Mandela',
    'A.P.J. Abdul Kalam', 'Mahatma Gandhi',
  ],
  Technology: [
    'Robert C. Martin', 'David Thomas', 'Erich Gamma',
    'Andrew S. Tanenbaum', 'Abraham Silberschatz', 'Stuart Russell',
  ],
  Arts: [
    'E.H. Gombrich', 'John Berger', 'Helen Gardner',
    'Betty Edwards', 'James Gurney',
  ],
}

// ==================== BOOK GENERATION ====================

function generateISBN(): string {
  return `978-${faker.string.numeric(1)}-${faker.string.numeric(4)}-${faker.string.numeric(4)}-${faker.string.numeric(1)}`
}

function createBook(index: number): Book {
  const category = BOOK_CATEGORIES[index % BOOK_CATEGORIES.length]
  const titles = BOOK_TITLES[category]
  const authors = AUTHORS_BY_CATEGORY[category]

  const title = titles[index % titles.length] || faker.commerce.productName()
  const author = authors[index % authors.length] || faker.person.fullName()

  const totalCopies = faker.number.int({ min: 2, max: 8 })
  const issuedCopies = faker.number.int({ min: 0, max: Math.min(totalCopies, 3) })

  return {
    id: faker.string.uuid(),
    isbn: generateISBN(),
    title,
    author,
    category,
    publisher: faker.helpers.arrayElement(PUBLISHERS),
    publicationYear: faker.number.int({ min: 1990, max: 2024 }),
    totalCopies,
    availableCopies: totalCopies - issuedCopies,
    description: faker.lorem.paragraph(3),
    coverUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/200/300`,
    location: faker.helpers.arrayElement(SHELF_LOCATIONS),
    addedAt: faker.date.past({ years: 2 }).toISOString(),
  }
}

// Generate 85 books
export const books: Book[] = Array.from({ length: 85 }, (_, i) => createBook(i))

// ==================== ISSUED BOOKS GENERATION ====================

function createIssuedBook(book: Book, isOverdue: boolean = false): IssuedBook {
  const student = faker.helpers.arrayElement(students.filter(s => s.status === 'active'))

  let issueDate: Date
  let dueDate: Date
  let status: IssuedBook['status']

  if (isOverdue) {
    // Overdue: issued 20-40 days ago, due date already passed
    issueDate = faker.date.recent({ days: 40 })
    dueDate = new Date(issueDate)
    dueDate.setDate(dueDate.getDate() + 14)
    status = 'overdue'
  } else {
    // Current: issued within last 14 days
    issueDate = faker.date.recent({ days: 10 })
    dueDate = new Date(issueDate)
    dueDate.setDate(dueDate.getDate() + 14)
    status = 'issued'
  }

  return {
    id: faker.string.uuid(),
    bookId: book.id,
    bookTitle: book.title,
    bookIsbn: book.isbn,
    studentId: student.id,
    studentName: student.name,
    studentClass: student.class,
    studentSection: student.section,
    issueDate: issueDate.toISOString(),
    dueDate: dueDate.toISOString(),
    status,
  }
}

// Select books that have been issued (those with availableCopies < totalCopies)
const booksWithIssued = books.filter(b => b.availableCopies < b.totalCopies)

// Create issued book records - mix of current and overdue
export const issuedBooks: IssuedBook[] = []

booksWithIssued.forEach((book, index) => {
  const copiesIssued = book.totalCopies - book.availableCopies
  for (let i = 0; i < copiesIssued; i++) {
    // Make roughly 30% overdue
    const isOverdue = faker.datatype.boolean({ probability: 0.3 })
    issuedBooks.push(createIssuedBook(book, isOverdue))
  }
})

// Ensure we have at least 25 issued books
while (issuedBooks.length < 25) {
  const randomBook = faker.helpers.arrayElement(books.filter(b => b.availableCopies > 0))
  if (randomBook) {
    randomBook.availableCopies--
    const isOverdue = faker.datatype.boolean({ probability: 0.3 })
    issuedBooks.push(createIssuedBook(randomBook, isOverdue))
  }
}

// ==================== FINES GENERATION ====================

const FINE_RATE = 5 // Rs 5 per day

function createFine(issuedBook: IssuedBook): Fine {
  const dueDate = new Date(issuedBook.dueDate)
  const today = new Date()
  const overdueDays = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)))

  const status = faker.helpers.weightedArrayElement([
    { value: 'pending' as const, weight: 60 },
    { value: 'paid' as const, weight: 30 },
    { value: 'waived' as const, weight: 10 },
  ])

  const fine: Fine = {
    id: faker.string.uuid(),
    issuedBookId: issuedBook.id,
    bookId: issuedBook.bookId,
    bookTitle: issuedBook.bookTitle,
    studentId: issuedBook.studentId,
    studentName: issuedBook.studentName,
    studentClass: issuedBook.studentClass,
    overdueDays,
    amount: overdueDays * FINE_RATE,
    status,
    createdAt: issuedBook.dueDate,
  }

  if (status === 'paid') {
    fine.paidAt = faker.date.recent({ days: 7 }).toISOString()
  } else if (status === 'waived') {
    fine.waivedAt = faker.date.recent({ days: 7 }).toISOString()
    fine.waivedReason = faker.helpers.arrayElement([
      'First-time offender',
      'Medical emergency',
      'Family circumstances',
      'Book was damaged before issue',
    ])
  }

  return fine
}

// Create fines for overdue books
export const fines: Fine[] = issuedBooks
  .filter(ib => ib.status === 'overdue')
  .map(createFine)

// Add some historical fines (from returned books)
const historicalFinesCount = faker.number.int({ min: 5, max: 10 })
for (let i = 0; i < historicalFinesCount; i++) {
  const randomBook = faker.helpers.arrayElement(books)
  const student = faker.helpers.arrayElement(students.filter(s => s.status === 'active'))
  const overdueDays = faker.number.int({ min: 1, max: 15 })

  fines.push({
    id: faker.string.uuid(),
    issuedBookId: faker.string.uuid(), // Historical, no longer in issuedBooks
    bookId: randomBook.id,
    bookTitle: randomBook.title,
    studentId: student.id,
    studentName: student.name,
    studentClass: student.class,
    overdueDays,
    amount: overdueDays * FINE_RATE,
    status: faker.helpers.arrayElement(['paid', 'waived'] as const),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    paidAt: faker.date.past({ years: 1 }).toISOString(),
  })
}

// ==================== HELPER FUNCTIONS ====================

export function getLibraryStats() {
  const overdueBooks = issuedBooks.filter(ib => ib.status === 'overdue').length
  const pendingFines = fines.filter(f => f.status === 'pending')
  const uniqueStudentsWithBooks = new Set(issuedBooks.map(ib => ib.studentId)).size

  return {
    totalBooks: books.reduce((sum, b) => sum + b.totalCopies, 0),
    availableBooks: books.reduce((sum, b) => sum + b.availableCopies, 0),
    issuedBooks: issuedBooks.filter(ib => ib.status !== 'returned').length,
    overdueBooks,
    totalFines: fines.length,
    pendingFinesAmount: pendingFines.reduce((sum, f) => sum + f.amount, 0),
    totalStudentsWithBooks: uniqueStudentsWithBooks,
  }
}

export function getAvailableStudents() {
  return students
    .filter(s => s.status === 'active')
    .map(s => ({
      id: s.id,
      name: s.name,
      className: s.class,
      section: s.section,
      rollNumber: String(s.rollNumber),
      admissionNumber: s.admissionNumber,
    }))
}
