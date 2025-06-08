import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Course, CourseFormData, Teacher } from '../../../types/course';
import { CourseFormComponent } from '../../components/course-form/course-form.component';
import { CourseDetailsComponent } from '../../components/course-details/course-details.component';
import { addIcons } from 'ionicons';
import { add, create, eye, trash, search } from 'ionicons/icons';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, CourseFormComponent, CourseDetailsComponent],
})
export class CoursesPage implements OnInit {
  constructor() {
    addIcons({ add, create, eye, trash, search });
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
    { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@school.edu', department: 'Computer Science', subject: 'Programming' },
    { id: '2', name: 'Prof. Michael Brown', email: 'michael@school.edu', department: 'Mathematics', subject: 'Calculus' },
    { id: '3', name: 'Dr. Emily Davis', email: 'emily@school.edu', department: 'Physics', subject: 'Quantum Physics' },
    { id: '4', name: 'Prof. James Wilson', email: 'james@school.edu', department: 'Chemistry', subject: 'Organic Chemistry' },
    { id: '5', name: 'Dr. Lisa Anderson', email: 'lisa@school.edu', department: 'Biology', subject: 'Molecular Biology' }
  ];

  ngOnInit() {
    this.loadCourses();
    this.filterCourses();
  }

  loadCourses() {
    // Sample courses data
    this.courses = [
      {
        id: '1',
        name: 'Computer Science',
        code: 'CS101',
        description: 'Fundamental concepts of programming and computer science',
        credits: 3,
        department: 'Computer Science',
        duration: '1 semester',
        capacity: 30,
        enrolledStudents: 25,
        status: 'active',
        teachers: [
          { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@school.edu', department: 'Computer Science', subject: 'Programming' }
        ]
      },
      {
        id: '2',
        name: 'Advanced Mathematics',
        code: 'MATH301',
        description: 'Linear algebra, differential equations, and advanced calculus',
        credits: 4,
        department: 'Mathematics',
        duration: '1 semester',
        capacity: 25,
        enrolledStudents: 20,
        status: 'active',
        teachers: [
          { id: '2', name: 'Prof. Michael Brown', email: 'michael@school.edu', department: 'Mathematics', subject: 'Calculus' }
        ]
      },
      {
        id: '3',
        name: 'Quantum Physics',
        code: 'PHYS401',
        description: 'Introduction to quantum mechanics and modern physics',
        credits: 4,
        department: 'Physics',
        duration: '1 semester',
        capacity: 20,
        enrolledStudents: 18,
        status: 'active',
        teachers: [
          { id: '3', name: 'Dr. Emily Davis', email: 'emily@school.edu', department: 'Physics', subject: 'Quantum Physics' }
        ]
      }
    ];
    this.filterCourses();
  }

  onSearchChange() {
    this.filterCourses();
  }

  filterCourses() {
    if (!this.searchTerm) {
      this.filteredCourses = [...this.courses];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCourses = this.courses.filter(course =>
        course.name.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term) ||
        course.department.toLowerCase().includes(term)
      );
    }
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
    const newCourse: Course = {
      ...data,
      id: Date.now().toString(),
      enrolledStudents: 0,
      teachers: []
    };
    this.courses.push(newCourse);
    this.filterCourses();
    this.closeForm();
    console.log('Course added successfully!');
    // In a real app, you'd use a toast service here
  }

  handleEditCourse(data: CourseFormData) {
    if (this.editingCourse) {
      const index = this.courses.findIndex(course => course.id === this.editingCourse!.id);
      if (index !== -1) {
        this.courses[index] = { ...this.courses[index], ...data };
        this.filterCourses();

        // Update selected course if it's the one being edited
        if (this.selectedCourse && this.selectedCourse.id === this.editingCourse.id) {
          this.selectedCourse = { ...this.selectedCourse, ...data };
        }
      }
      this.closeForm();
      console.log('Course updated successfully!');
    }
  }

  handleDeleteCourse(courseId: string) {
    this.courses = this.courses.filter(course => course.id !== courseId);
    this.filterCourses();
    console.log('Course deleted successfully!');
  }

  handleAssociateTeacher(event: { courseId: string, teacherId: string }) {
    const teacher = this.availableTeachers.find(t => t.id === event.teacherId);
    if (teacher) {
      const courseIndex = this.courses.findIndex(course => course.id === event.courseId);
      if (courseIndex !== -1) {
        this.courses[courseIndex].teachers.push(teacher);

        // Update selected course if it's the one being modified
        if (this.selectedCourse && this.selectedCourse.id === event.courseId) {
          this.selectedCourse = { ...this.selectedCourse, teachers: [...this.selectedCourse.teachers, teacher] };
        }

        this.filterCourses();
      }
    }
  }

  handleRemoveTeacher(event: { courseId: string, teacherId: string }) {
    const courseIndex = this.courses.findIndex(course => course.id === event.courseId);
    if (courseIndex !== -1) {
      this.courses[courseIndex].teachers = this.courses[courseIndex].teachers.filter(t => t.id !== event.teacherId);

      // Update selected course if it's the one being modified
      if (this.selectedCourse && this.selectedCourse.id === event.courseId) {
        this.selectedCourse = {
          ...this.selectedCourse,
          teachers: this.selectedCourse.teachers.filter(t => t.id !== event.teacherId)
        };
      }

      this.filterCourses();
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