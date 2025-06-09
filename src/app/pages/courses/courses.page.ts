import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Course, CourseFormData } from '../../interfaces/course.interface';
import { Teacher } from '../../interfaces/teacher.interface';
import { CourseFormComponent } from '../../components/course-form/course-form.component';
import { CourseDetailsComponent } from '../../components/course-details/course-details.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { addIcons } from 'ionicons';
import { add, create, eye, trash, search, close } from 'ionicons/icons';
import { CourseService } from '../../services/course.service';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { getToastMessage } from '../../utils/toast.utils';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, CourseFormComponent, CourseDetailsComponent, SearchBarComponent],
})
export class CoursesPage implements OnInit {
  constructor(private courseService: CourseService, private toastController: ToastController) {
    addIcons({ add, create, eye, trash, search, close });
  }

  searchTerm: string = '';
  showForm: boolean = false;
  showDetails: boolean = false;
  editingCourse: Course | undefined;
  selectedCourse: Course | null = null;
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  currentPage = 0;
  pageSize = 2;
  totalPages = 1;
  isFirst = true;
  isLast = false;

  ngOnInit() {
    this.filterCourses();
  }

  filterCourses() {
    const pagination = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sort: []
    };
    this.courseService.filterCourses(this.searchTerm, pagination).subscribe({
      next: (res) => {
        if (res.status && res.status[0] && res.status[0].severity === "ERROR") {
          this.presentToast(getToastMessage(res, 'Error loading courses'));
        } else {
          this.filteredCourses = res.slice?.content || [];
          this.courses = this.filteredCourses;
          this.isFirst = res.slice.first;
          this.isLast = res.slice.last;
          this.totalPages = res.slice.pageable && res.slice.pageable.pageSize ? Math.ceil(res.slice.numberOfElements / res.slice.pageable.pageSize) : 1;
        }
      },
      error: (error) => {
        this.presentToast(getToastMessage(error, 'Error loading courses'));
      }
    });
  }

  onSearchChange() {
    this.filterCourses();
  }

  openAddForm() {
    this.editingCourse = undefined;
    this.showForm = true;
  }

  openEditForm(course: Course) {
    this.editingCourse = course;
    this.showForm = true;
  }

  openDetails(course: Course) {
    this.selectedCourse = course;
    this.showDetails = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingCourse = undefined;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedCourse = null;
  }

  handleAddCourse(data: CourseFormData) {
    const { code, title, description, year } = data;
    const body = { code, title, description, year };
    this.courseService.upsertCourse(body).subscribe({
      next: (res) => {
        if (res.status && res.status[0]?.severity === 'ERROR') {
          this.presentToast(getToastMessage(res));
        } else {
          this.filterCourses();
          this.closeForm();
          this.presentToast('Course added successfully');
        }
      },
      error: (error) => {
        this.presentToast(getToastMessage(error, 'Error adding course'));
      }
    });
  }

  handleEditCourse(data: CourseFormData) {
    if (this.editingCourse) {
      const { code, title, description, year } = data;
      const body = { code, title, description, year, id: this.editingCourse.id };
      this.courseService.upsertCourse(body).subscribe({
        next: (res) => {
          if (res.status && res.status[0]?.severity === 'ERROR') {
            this.presentToast(getToastMessage(res));
          } else {
            this.filterCourses();
            this.closeForm();
            this.presentToast('Course updated successfully');
          }
        },
        error: (error) => {
          this.presentToast(getToastMessage(error, 'Error updating course'));
        }
      });
    }
  }

  handleDeleteCourse(courseId: number) {
    this.courseService.deleteCourse(courseId).subscribe({
      next: (res) => {
        if (res.status && res.status[0]?.severity === 'ERROR') {
          this.presentToast(getToastMessage(res));
        } else {
          this.filterCourses();
          this.presentToast('Course deleted successfully');
        }
      },
      error: (error) => {
        this.presentToast(getToastMessage(error, 'Error deleting course'));
      }
    });
  }

  handleAssociateTeacher(event: { courseId: number, teacherId: number }) {
    this.courseService.associateTeacherToCourse(event.teacherId, event.courseId).subscribe({
      next: (res) => {
        if (res.status && res.status[0]?.severity === 'ERROR') {
          this.presentToast(getToastMessage(res));
        } else {
          this.courseService.getCourse(event.courseId).subscribe({
            next: (courseRes) => {
              this.selectedCourse = courseRes.data;
              this.filterCourses();
              this.presentToast('Teacher associated successfully');
            },
            error: (error) => {
              this.presentToast(getToastMessage(error, 'Error loading course after association'));
            }
          });
        }
      },
      error: (error) => {
        this.presentToast(getToastMessage(error, 'Error associating teacher'));
      }
    });
  }

  handleRemoveTeacher(event: { courseId: number }) {
    const course = this.courses.find(c => c.id === event.courseId);
    if (course && course.teacher) {
      this.courseService.removeTeacherFromCourse(course.teacher.id, event.courseId).subscribe({
        next: (res) => {
          if (res.status && res.status[0]?.severity === 'ERROR') {
            this.presentToast(getToastMessage(res));
          } else {
            this.courseService.getCourse(event.courseId).subscribe({
              next: (courseRes) => {
                this.selectedCourse = courseRes.data;
                this.filterCourses();
                this.presentToast('Teacher removed successfully');
              },
              error: (error) => {
                this.presentToast(getToastMessage(error, 'Error loading course after removal'));
              }
            });
          }
        },
        error: (error) => {
          this.presentToast(getToastMessage(error, 'Error removing teacher'));
        }
      });
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

  goToFirstPage() {
    if (!this.isFirst) {
      this.currentPage = 0;
      this.filterCourses();
    }
  }

  goToPreviousPage() {
    if (!this.isFirst && this.currentPage > 0) {
      this.currentPage--;
      this.filterCourses();
    }
  }

  goToNextPage() {
    if (!this.isLast) {
      this.currentPage++;
      this.filterCourses();
    }
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}