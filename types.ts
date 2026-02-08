
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum AccountStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  status: AccountStatus;
  password?: string;
  email?: string;
  classId?: string;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  students: string[]; // User IDs
}

export interface Lesson {
  id: string;
  title: string;
  unit: number;
  content: string;
  createdBy: string; // Teacher or Admin ID
  category: 'Vocabulary' | 'Grammar' | 'Reading' | 'Listening';
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
  type: 'Regular' | 'Midterm' | 'Final';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Grade {
  id: string;
  studentId: string;
  quizId: string;
  score: number;
  date: string;
  type: 'Regular' | 'Midterm' | 'Final';
}
