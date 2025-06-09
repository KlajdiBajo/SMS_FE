import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TeacherFormComponent } from '../../components/teacher-form/teacher-form.component';
import { TeacherDetailsComponent } from '../../components/teacher-details/teacher-details.component';
import { Teacher } from '../../interfaces/teacher.interface';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, create, eye, trash, close } from 'ionicons/icons';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { TeacherService } from '../../services/teacher.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.page.html',
  styleUrls: ['./teacher.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, TeacherFormComponent, TeacherDetailsComponent, SearchBarComponent],
})
export class TeacherPage implements OnInit {
  teachers: Teacher[] = [];
  searchTerm = '';
  isFormOpen = false;
  isDetailsOpen = false;
  editingTeacher: Teacher | null = null;
  selectedTeacher: Teacher | null = null;
  private searchSubject = new Subject<string>();
  currentPage = 0;
  pageSize = 1;
  isFirst = true;
  isLast = false;
  totalPages = 1;
  totalElements = 0;

  constructor(
    private teacherService: TeacherService,
    private toastController: ToastController
  ) {
    addIcons({ add, create, eye, trash, close });
  }

  ngOnInit() {
    this.loadTeachers();
    this.setupSearch();
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.currentPage = 0;
      this.loadTeachers();
    });
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  loadTeachers() {
    this.teacherService.filterTeachers(this.searchTerm, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.teachers = response.slice.content;
          this.isFirst = response.slice.first;
          this.isLast = response.slice.last;
          this.totalPages = response.slice.pageable && response.slice.pageable.pageSize ? Math.ceil(response.slice.numberOfElements / response.slice.pageable.pageSize) : 1;
          this.totalElements = response.slice.numberOfElements;
        },
        error: (error) => {
          console.error('Error loading teachers:', error);
          this.presentToast('Error loading teachers');
        }
      });
  }

  openAddForm() {
    this.editingTeacher = null;
    this.isFormOpen = true;
  }

  openEditForm(teacher: Teacher) {
    this.editingTeacher = teacher;
    this.isFormOpen = true;
  }

  openViewDetails(teacher: Teacher) {
    this.teacherService.getTeacher(Number(teacher.id)).subscribe({
      next: (response) => {
        this.selectedTeacher = response.data;
        this.isDetailsOpen = true;
      },
      error: (error) => {
        console.error('Error loading teacher details:', error);
        this.presentToast('Error loading teacher details');
      }
    });
  }

  closeForm() {
    this.isFormOpen = false;
    this.editingTeacher = null;
  }

  closeDetails() {
    this.isDetailsOpen = false;
    this.selectedTeacher = null;
  }

  handleAddTeacher(teacherData: Omit<Teacher, 'id'>) {
    this.teacherService.upsertTeacher(teacherData).subscribe({
      next: (response) => {
        this.loadTeachers();
        this.isFormOpen = false;
        this.presentToast('Teacher added successfully');
      },
      error: (error) => {
        console.error('Error adding teacher:', error);
        this.presentToast('Error adding teacher');
      }
    });
  }

  handleEditTeacher(teacherData: Omit<Teacher, 'id'>) {
    if (this.editingTeacher) {
      const updateData = {
        ...teacherData,
        id: this.editingTeacher.id
      };

      this.teacherService.upsertTeacher(updateData).subscribe({
        next: (response) => {
          this.loadTeachers();
          this.editingTeacher = null;
          this.isFormOpen = false;
          this.presentToast('Teacher updated successfully');
        },
        error: (error) => {
          console.error('Error updating teacher:', error);
          this.presentToast('Error updating teacher');
        }
      });
    }
  }

  handleDeleteTeacher(teacherId: number) {
    this.teacherService.deleteTeacher(teacherId).subscribe({
      next: () => {
        this.loadTeachers();
        this.isDetailsOpen = false;
        this.selectedTeacher = null;
        this.presentToast('Teacher deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting teacher:', error);
        this.presentToast('Error deleting teacher');
      }
    });
  }

  goToFirstPage() {
    if (!this.isFirst) {
      this.currentPage = 0;
      this.loadTeachers();
    }
  }

  goToPreviousPage() {
    if (!this.isFirst && this.currentPage > 0) {
      this.currentPage--;
      this.loadTeachers();
    }
  }

  goToNextPage() {
    if (!this.isLast) {
      this.currentPage++;
      this.loadTeachers();
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