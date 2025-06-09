import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Course } from '../../interfaces/course.interface';
import { Teacher } from '../../interfaces/teacher.interface';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TeacherService } from '../../services/teacher.service';
import { CourseService } from '../../services/course.service';

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
  @Output() delete = new EventEmitter<number>();
  @Output() associateTeacher = new EventEmitter<{ courseId: number, teacherId: number }>();
  @Output() removeTeacher = new EventEmitter<{ courseId: number }>();

  showTeacherModal: boolean = false;
  showDeleteConfirm: boolean = false;
  showRemoveTeacherConfirm: number | null = null;
  unassignedTeachers: Teacher[] = [];
  availableTeachers: Teacher[] = [];

  constructor(private teacherService: TeacherService, private courseService: CourseService) { }

  ngOnInit() {
    this.updateUnassignedTeachers();
  }

  ngOnChanges() {
    this.updateUnassignedTeachers();
  }

  openTeacherModal() {
    if (this.course && this.course.teacher) {
      // If a teacher is already assigned, do not open the modal
      return;
    }
    this.teacherService.filterTeachers('', 0, 100).subscribe(res => {
      this.availableTeachers = res.slice?.content || [];
      this.updateUnassignedTeachers();
      this.showTeacherModal = true;
    });
  }

  updateUnassignedTeachers() {
    if (this.course) {
      this.unassignedTeachers = this.availableTeachers.filter(
        teacher => !this.course!.teacher || this.course!.teacher.id !== teacher.id
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

  onAssociateTeacher(teacherId: number) {
    if (this.course && !this.course.teacher) {
      this.associateTeacher.emit({ courseId: this.course.id, teacherId });
      this.showTeacherModal = false;
      this.updateUnassignedTeachers();
    }
  }

  onRemoveTeacher() {
    if (this.course) {
      this.removeTeacher.emit({ courseId: this.course.id });
      this.showRemoveTeacherConfirm = null;
      this.updateUnassignedTeachers();
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
