import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {

  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, create, trash, add } from 'ionicons/icons';
import { Student } from '../../interfaces/student.interface';
import { Course } from '../../interfaces/course.interface';
import { CourseService } from '../../services/course.service';

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
  @Output() delete = new EventEmitter<number>();
  @Output() associateCourse = new EventEmitter<{ studentId: number; courseId: number }>();
  @Output() removeCourse = new EventEmitter<{ studentId: number; courseId: number }>();

  showCourseModal = false;
  availableCourses: Course[] = [];

  constructor(private courseService: CourseService) {
    addIcons({ close, create, trash, add });
  }

  openCourseModal() {
    this.courseService.filterCourses('', { pageNumber: 0, pageSize: 1000, sort: [] }).subscribe({
      next: (res) => {
        this.availableCourses = res.slice?.content || [];
        this.showCourseModal = true;
      }
    });
  }

  handleDelete() {
    this.delete.emit(this.student.id);
  }

  handleRemoveCourse() {
    if (this.student.course) {
      this.removeCourse.emit({ studentId: this.student.id, courseId: this.student.course.id });
    }
  }

  handleAddCourse(courseId: number) {
    this.associateCourse.emit({ studentId: this.student.id, courseId });
    this.showCourseModal = false;
  }

  onEdit() {
    this.edit.emit(this.student);
  }

  onClose() {
    this.close.emit();
  }
}