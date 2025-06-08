import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {

  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, create, trash, add } from 'ionicons/icons';

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  instructor: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  status: 'active' | 'inactive' | string;
  enrollmentDate: string;
  courses: Course[];
}

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
  ]
})
export class StudentDetailsComponent {
  @Input() student!: Student;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Student>();
  @Output() delete = new EventEmitter<string>();
  @Output() associateCourse = new EventEmitter<{ studentId: string; courseId: string }>();
  @Output() removeCourse = new EventEmitter<{ studentId: string; courseId: string }>();

  showCourseModal = false;
  availableCourses: Course[] = [
    { id: '1', name: 'Mathematics', code: 'MATH101', credits: 3, instructor: 'Dr. Smith' },
    { id: '2', name: 'Physics', code: 'PHYS101', credits: 4, instructor: 'Dr. Johnson' },
    { id: '3', name: 'Chemistry', code: 'CHEM101', credits: 3, instructor: 'Dr. Brown' },
    { id: '4', name: 'Biology', code: 'BIO101', credits: 3, instructor: 'Dr. Davis' },
  ];

  constructor() {
    addIcons({ close, create, trash, add });
  }

  get enrolledCourseIds(): string[] {
    return this.student?.courses?.map(c => c.id) || [];
  }

  get coursesToAdd(): Course[] {
    return this.availableCourses.filter(c => !this.enrolledCourseIds.includes(c.id));
  }

  handleDelete() {
    if (confirm('Are you sure you want to delete this student?')) {
      this.delete.emit(this.student.id);
      // Optionally show a toast here
    }
  }

  handleRemoveCourse(courseId: string) {
    if (confirm('Are you sure you want to remove this course from the student?')) {
      this.removeCourse.emit({ studentId: this.student.id, courseId });
      // Optionally show a toast here
    }
  }

  handleAddCourse(course: Course) {
    this.associateCourse.emit({ studentId: this.student.id, courseId: course.id });
    this.showCourseModal = false;
    // Optionally show a toast here
  }

  onEdit() {
    this.edit.emit(this.student);
  }

  onClose() {
    this.close.emit();
  }
}