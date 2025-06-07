export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  subject: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  department: string;
  duration: string;
  enrolledStudents: number;
  capacity: number;
  status: 'active' | 'inactive' | 'archived';
  teachers: Teacher[];
}

export interface CourseFormData {
  name: string;
  code: string;
  description: string;
  credits: number;
  department: string;
  duration: string;
  capacity: number;
  status: 'active' | 'inactive' | 'archived';
}