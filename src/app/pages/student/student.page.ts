import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardHeader, IonCardContent, IonBadge, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search, people, add, create, trash, eye } from 'ionicons/icons';
import { ToastController } from '@ionic/angular';
import { StudentFormComponent } from '../../components/student-form/student-form.component';
import { StudentDetailsComponent } from '../../components/student-details/student-details.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { Student, StudentFormData } from '../../interfaces/student.interface';
import { StudentService } from '../../services/student.service';
import { getToastMessage } from '../../utils/toast.utils';

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
  students: Student[] = [];
  searchTerm: string = '';
  selectedStudent: Student | null = null;
  isFormOpen: boolean = false;
  isDetailsOpen: boolean = false;
  editingStudent: Student | undefined = undefined;
  currentPage = 0;
  pageSize = 2;
  isFirst = true;
  isLast = false;
  totalPages = 1;

  constructor(
    private studentService: StudentService,
    private toastController: ToastController
  ) {
    addIcons({ search, people, add, create, trash, eye });
  }

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.filterStudents(this.searchTerm, {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sort: []
    }).subscribe({
      next: (response) => {
        this.students = response.slice.content;
        this.isFirst = response.slice.first;
        this.isLast = response.slice.last;
        this.totalPages = response.slice.pageable && response.slice.pageable.pageSize ? Math.ceil(response.slice.numberOfElements / response.slice.pageable.pageSize) : 1;
      },
      error: (error) => {
        this.presentToast(getToastMessage(error, 'Error loading students'));
      }
    });
  }

  onSearchChange(term?: string) {
    if (typeof term === 'string') {
      this.searchTerm = term;
    }
    this.currentPage = 0;
    this.loadStudents();
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
    this.studentService.getStudent(student.id).subscribe({
      next: (response) => {
        this.selectedStudent = response.data;
        this.isDetailsOpen = true;
      },
      error: (error) => {
        this.presentToast(getToastMessage(error, 'Error loading student details'));
      }
    });
  }

  handleDeleteStudent(studentId: number) {
    this.studentService.deleteStudent(studentId).subscribe({
      next: (response) => {
        if (response.status && response.status[0]?.severity === 'ERROR') {
          this.presentToast(getToastMessage(response));
        } else {
          this.studentService.filterStudents(this.searchTerm, {
            pageNumber: this.currentPage,
            pageSize: this.pageSize,
            sort: []
          }).subscribe({
            next: (res) => {
              if (res.slice.content.length === 0 && this.currentPage > 0) {
                this.currentPage--;
                this.loadStudents();
              } else {
                this.students = res.slice.content;
                this.isFirst = res.slice.first;
                this.isLast = res.slice.last;
                this.totalPages = res.slice.pageable && res.slice.pageable.pageSize ? Math.ceil(res.slice.numberOfElements / res.slice.pageable.pageSize) : 1;
              }
            },
            error: (error) => {
              this.presentToast(getToastMessage(error, 'Error loading students'));
            }
          });
          this.isDetailsOpen = false;
          this.selectedStudent = null;
          this.presentToast('Student deleted successfully');
        }
      },
      error: (error) => {
        this.presentToast(getToastMessage(error, 'Error deleting student'));
      }
    });
  }

  handleAssociateCourse(event: { studentId: number, courseId: number }) {
    this.studentService.associateStudentToCourse(event.studentId, event.courseId).subscribe({
      next: (response) => {
        if (response.status && response.status[0]?.severity === 'ERROR') {
          this.presentToast(getToastMessage(response));
        } else {
          this.studentService.getStudent(event.studentId).subscribe({
            next: (res) => {
              this.selectedStudent = res.data;
              this.loadStudents();
            }
          });
        }
      },
      error: (error) => {
        this.presentToast(getToastMessage(error, 'Error associating course'));
      }
    });
  }

  handleRemoveCourse(event: { studentId: number, courseId: number }) {
    this.studentService.removeStudentFromCourse(event.studentId, event.courseId).subscribe({
      next: (response) => {
        if (response.status && response.status[0]?.severity === 'ERROR') {
          this.presentToast(getToastMessage(response));
        } else {
          this.studentService.getStudent(event.studentId).subscribe({
            next: (res) => {
              this.selectedStudent = res.data;
              this.loadStudents();
            }
          });
        }
      },
      error: (error) => {
        this.presentToast(getToastMessage(error, 'Error removing course'));
      }
    });
  }

  handleFormSubmit(data: StudentFormData) {
    if (this.editingStudent) {
      const body = { ...data, id: this.editingStudent.id };
      this.studentService.upsertStudent(body).subscribe({
        next: (response) => {
          if (response.status && response.status[0]?.severity === 'ERROR') {
            this.presentToast(getToastMessage(response));
          } else {
            this.loadStudents();
            this.isFormOpen = false;
            this.editingStudent = undefined;
            this.presentToast('Student updated successfully');
          }
        },
        error: (error) => {
          this.presentToast(getToastMessage(error, 'Error updating student'));
        }
      });
    } else {
      this.studentService.upsertStudent(data).subscribe({
        next: (response) => {
          if (response.status && response.status[0]?.severity === 'ERROR') {
            this.presentToast(getToastMessage(response));
          } else {
            this.loadStudents();
            this.isFormOpen = false;
            this.presentToast('Student added successfully');
          }
        },
        error: (error) => {
          this.presentToast(getToastMessage(error, 'Error adding student'));
        }
      });
    }
  }

  handleFormCancel() {
    this.isFormOpen = false;
    this.editingStudent = undefined;
  }

  handleDetailsClose() {
    this.isDetailsOpen = false;
    this.selectedStudent = null;
  }

  goToFirstPage() {
    if (!this.isFirst) {
      this.currentPage = 0;
      this.loadStudents();
    }
  }

  goToPreviousPage() {
    if (!this.isFirst && this.currentPage > 0) {
      this.currentPage--;
      this.loadStudents();
    }
  }

  goToNextPage() {
    if (!this.isLast) {
      this.currentPage++;
      this.loadStudents();
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
