import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardHeader, IonCardContent, IonBadge, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search, people, add, create, trash, eye } from 'ionicons/icons';
import { ToastController } from '@ionic/angular';
import { StudentFormComponent, StudentFormData } from '../../components/student-form/student-form.component';
import { StudentDetailsComponent, Student, Course } from '../../components/student-details/student-details.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,
    IonCard, IonCardHeader, IonCardContent,
    IonBadge, IonGrid, IonRow, IonCol, CommonModule, FormsModule,
    StudentFormComponent, StudentDetailsComponent, SearchBarComponent
  ]
})
export class StudentPage implements OnInit {
  students: Student[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@school.edu',
      phoneNumber: '+1-555-0101',
      dateOfBirth: '2000-03-15',
      address: '123 Main St, City, State 12345',
      enrollmentDate: '2022-09-01',
      status: 'active',
      courses: [
        { id: '1', name: 'Mathematics', code: 'MATH101', credits: 3, instructor: 'Dr. Smith' },
        { id: '2', name: 'Physics', code: 'PHYS101', credits: 4, instructor: 'Dr. Johnson' }
      ]
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@school.edu',
      phoneNumber: '+1-555-0102',
      dateOfBirth: '1999-07-22',
      address: '456 Oak Ave, City, State 12345',
      enrollmentDate: '2021-09-01',
      status: 'active',
      courses: [
        { id: '3', name: 'Chemistry', code: 'CHEM101', credits: 3, instructor: 'Dr. Brown' }
      ]
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@school.edu',
      phoneNumber: '+1-555-0103',
      dateOfBirth: '2001-11-08',
      address: '789 Pine St, City, State 12345',
      enrollmentDate: '2023-01-15',
      status: 'inactive',
      courses: []
    }
  ];

  searchTerm: string = '';
  selectedStudent: Student | null = null;
  isFormOpen: boolean = false;
  isDetailsOpen: boolean = false;
  editingStudent: Student | undefined = undefined;

  constructor(private toastController: ToastController) {
    addIcons({ search, people, add, create, trash, eye });
  }

  ngOnInit() { }

  get filteredStudents(): Student[] {
    return this.students.filter(student =>
      student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async handleAddStudent() {
    this.editingStudent = undefined;
    this.isFormOpen = true;
  }

  handleEditStudent(student: Student) {
    this.editingStudent = student;
    this.isFormOpen = true;
    this.isDetailsOpen = false;
  }

  handleViewStudent(student: Student) {
    this.selectedStudent = student;
    this.isDetailsOpen = true;
  }

  async handleDeleteStudent(studentId: string) {
    const alert = await this.toastController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this student?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.students = this.students.filter(s => s.id !== studentId);
            this.isDetailsOpen = false;
            this.presentToast('Student deleted successfully');
          }
        }
      ]
    });
    await alert.present();
  }

  handleAssociateCourse(studentId: string, courseId: string) {
    const availableCourses: Course[] = [
      { id: '1', name: 'Mathematics', code: 'MATH101', credits: 3, instructor: 'Dr. Smith' },
      { id: '2', name: 'Physics', code: 'PHYS101', credits: 4, instructor: 'Dr. Johnson' },
      { id: '3', name: 'Chemistry', code: 'CHEM101', credits: 3, instructor: 'Dr. Brown' },
      { id: '4', name: 'Biology', code: 'BIO101', credits: 3, instructor: 'Dr. Davis' },
    ];

    const course = availableCourses.find(c => c.id === courseId);
    if (course) {
      this.students = this.students.map(student =>
        student.id === studentId
          ? { ...student, courses: [...student.courses, course] }
          : student
      );

      if (this.selectedStudent && this.selectedStudent.id === studentId) {
        this.selectedStudent = {
          ...this.selectedStudent,
          courses: [...this.selectedStudent.courses, course]
        };
      }
    }
  }

  handleRemoveCourse(studentId: string, courseId: string) {
    this.students = this.students.map(student =>
      student.id === studentId
        ? { ...student, courses: student.courses.filter(c => c.id !== courseId) }
        : student
    );

    if (this.selectedStudent && this.selectedStudent.id === studentId) {
      this.selectedStudent = {
        ...this.selectedStudent,
        courses: this.selectedStudent.courses.filter(c => c.id !== courseId)
      };
    }
  }

  handleFormSubmit(data: StudentFormData) {
    if (this.editingStudent) {
      this.students = this.students.map(s =>
        s.id === this.editingStudent?.id
          ? { ...s, ...data }
          : s
      );
      this.presentToast('Student updated successfully');
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        ...data,
        courses: []
      };
      this.students = [...this.students, newStudent];
      this.presentToast('Student added successfully');
    }
    this.isFormOpen = false;
    this.editingStudent = undefined;
  }

  handleFormCancel() {
    this.isFormOpen = false;
    this.editingStudent = undefined;
  }

  handleDetailsClose() {
    this.isDetailsOpen = false;
    this.selectedStudent = null;
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
