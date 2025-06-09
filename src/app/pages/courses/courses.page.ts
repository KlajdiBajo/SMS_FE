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

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, CourseFormComponent, CourseDetailsComponent, SearchBarComponent],
})
export class CoursesPage implements OnInit {
  constructor(private courseService: CourseService) {
    addIcons({ add, create, eye, trash, search, close });
  }

  searchTerm: string = '';
  showForm: boolean = false;
  showDetails: boolean = false;
  editingCourse: Course | undefined;
  selectedCourse: Course | null = null;
  courses: Course[] = [];
  filteredCourses: Course[] = [];

  // Available teachers for association
  availableTeachers: Teacher[] = [
    { id: 1, firstName: 'Sarah', lastName: 'Johnson', title: 'Dr.' },
    { id: 2, firstName: 'Michael', lastName: 'Brown', title: 'Prof.' },
    { id: 3, firstName: 'Emily', lastName: 'Davis', title: 'Dr.' },
    { id: 4, firstName: 'James', lastName: 'Wilson', title: 'Prof.' },
    { id: 5, firstName: 'Lisa', lastName: 'Anderson', title: 'Dr.' }
  ];

  ngOnInit() {
    this.filterCourses();
  }

  filterCourses() {
    const pagination = {
      pageNumber: 0,
      pageSize: 100,
      sort: []
    };
    this.courseService.filterCourses(this.searchTerm, pagination).subscribe(res => {
      this.filteredCourses = res.slice?.content || [];
      this.courses = this.filteredCourses;
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
    console.log('handleAddCourse called', data);
    const { code, title, description, year } = data;
    const body = { code, title, description, year };
    this.courseService.upsertCourse(body).subscribe(res => {
      this.filterCourses();
      this.closeForm();
    });
  }

  handleEditCourse(data: CourseFormData) {
    if (this.editingCourse) {
      console.log('handleEditCourse called', data);
      const { code, title, description, year } = data;
      const body = { code, title, description, year, id: this.editingCourse.id };
      this.courseService.upsertCourse(body).subscribe(res => {
        this.filterCourses();
        this.closeForm();
      });
    }
  }

  handleDeleteCourse(courseId: number) {
    this.courseService.deleteCourse(courseId).subscribe(res => {
      this.filterCourses();
    });
  }

  handleAssociateTeacher(event: { courseId: number, teacherId: number }) {
    this.courseService.associateTeacherToCourse(event.teacherId, event.courseId).subscribe(res => {
      this.courseService.getCourse(event.courseId).subscribe(courseRes => {
        this.selectedCourse = courseRes.data;
        this.filterCourses();
      });
    });
  }

  handleRemoveTeacher(event: { courseId: number }) {
    const course = this.courses.find(c => c.id === event.courseId);
    if (course && course.teacher) {
      this.courseService.removeTeacherFromCourse(course.teacher.id, event.courseId).subscribe(res => {
        this.courseService.getCourse(event.courseId).subscribe(courseRes => {
          this.selectedCourse = courseRes.data;
          this.filterCourses();
        });
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
}