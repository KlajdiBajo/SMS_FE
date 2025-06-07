// course-details.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Course, Teacher } from '../../../types/course';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class CourseDetailsComponent implements OnInit {
  @Input() course: Course | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Course>();
  @Output() delete = new EventEmitter<string>();
  @Output() associateTeacher = new EventEmitter<{courseId: string, teacherId: string}>();
  @Output() removeTeacher = new EventEmitter<{courseId: string, teacherId: string}>();

  showTeacherModal: boolean = false;
  showDeleteConfirm: boolean = false;
  showRemoveTeacherConfirm: string | null = null;
  unassignedTeachers: Teacher[] = [];

  // Sample available teachers - in real app, this would come from a service
  availableTeachers: Teacher[] = [
    { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@school.edu', department: 'Computer Science', subject: 'Programming' },
    { id: '2', name: 'Prof. Michael Brown', email: 'michael@school.edu', department: 'Mathematics', subject: 'Calculus' },
    { id: '3', name: 'Dr. Emily Davis', email: 'emily@school.edu', department: 'Physics', subject: 'Quantum Physics' },
    { id: '4', name: 'Prof. James Wilson', email: 'james@school.edu', department: 'Chemistry', subject: 'Organic Chemistry' },
    { id: '5', name: 'Dr. Lisa Anderson', email: 'lisa@school.edu', department: 'Biology', subject: 'Molecular Biology' }
  ];

  ngOnInit() {
    this.updateUnassignedTeachers();
  }

  ngOnChanges() {
    this.updateUnassignedTeachers();
  }

  updateUnassignedTeachers() {
    if (this.course) {
      this.unassignedTeachers = this.availableTeachers.filter(
        teacher => !this.course!.teachers.some(courseTeacher => courseTeacher.id === teacher.id)
      );
    }
  }

  onClose() {
    this.close.emit();
    this.resetModals();
  }

  onEdit() {
    if (this.course) {
      this.edit.emit(this.course);
    }
  }

  onDelete() {
    if (this.course) {
      this.delete.emit(this.course.id);
      this.showDeleteConfirm = false;
      this.onClose();
    }
  }

  onAssociateTeacher(teacherId: string) {
    if (this.course) {
      this.associateTeacher.emit({ courseId: this.course.id, teacherId });
      this.showTeacherModal = false;
      this.updateUnassignedTeachers();
      // In Angular, you'd typically use a toast service here
      console.log('Teacher associated successfully!');
    }
  }

  onRemoveTeacher(teacherId: string) {
    if (this.course) {
      this.removeTeacher.emit({ courseId: this.course.id, teacherId });
      this.showRemoveTeacherConfirm = null;
      this.updateUnassignedTeachers();
      console.log('Teacher removed from course!');
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      default:
        return 'status-default';
    }
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private resetModals() {
    this.showTeacherModal = false;
    this.showDeleteConfirm = false;
    this.showRemoveTeacherConfirm = null;
  }
}
