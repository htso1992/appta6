
import { User, UserRole, AccountStatus, Lesson } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'System Administrator',
    role: UserRole.ADMIN,
    status: AccountStatus.ACTIVE,
  },
  {
    id: '2',
    username: 'teacher1',
    fullName: 'Mrs. Nguyen',
    role: UserRole.TEACHER,
    status: AccountStatus.ACTIVE,
  },
  {
    id: '3',
    username: 'student1',
    fullName: 'An Tran',
    role: UserRole.STUDENT,
    status: AccountStatus.ACTIVE,
    classId: 'c1'
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'l1',
    unit: 1,
    title: 'My New School',
    content: 'Welcome to Unit 1! In this unit, we will learn about school items and subjects...',
    category: 'Vocabulary',
    createdBy: '1'
  },
  {
    id: 'l2',
    unit: 2,
    title: 'My House',
    content: 'Unit 2 focuses on types of houses and rooms. Learn describing your dream home...',
    category: 'Grammar',
    createdBy: '2'
  }
];

export const UNITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
