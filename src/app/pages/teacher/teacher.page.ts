import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TeacherFormComponent } from '../../components/teacher-form/teacher-form.component';
import { TeacherDetailsComponent, Teacher } from '../../components/teacher-details/teacher-details.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.page.html',
  styleUrls: ['./teacher.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, TeacherFormComponent, TeacherDetailsComponent],
})
export class TeacherPage {
  teachers: Teacher[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@school.edu',
      phone: '+1 234-567-8901',
      department: 'Mathematics',
      subject: 'Algebra',
      hireDate: '2020-08-15'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@school.edu',
      phone: '+1 234-567-8902',
      department: 'Science',
      subject: 'Biology',
      hireDate: '2019-09-01'
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@school.edu',
      phone: '+1 234-567-8903',
      department: 'English',
      subject: 'Literature',
      hireDate: '2021-01-10'
    }
  ];

  searchTerm = '';
  isFormOpen = false;
  isDetailsOpen = false;
  editingTeacher: Teacher | null = null;
  selectedTeacher: Teacher | null = null;

  get filteredTeachers(): Teacher[] {
    const term = this.searchTerm.toLowerCase();
    return this.teachers.filter(teacher =>
      teacher.firstName.toLowerCase().includes(term) ||
      teacher.lastName.toLowerCase().includes(term) ||
      teacher.email.toLowerCase().includes(term) ||
      teacher.department.toLowerCase().includes(term) ||
      teacher.subject.toLowerCase().includes(term)
    );
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
    this.selectedTeacher = teacher;
    this.isDetailsOpen = true;
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
    const newTeacher: Teacher = {
      ...teacherData,
      id: Date.now().toString()
    };
    this.teachers = [...this.teachers, newTeacher];
    this.isFormOpen = false;
  }

  handleEditTeacher(teacherData: Omit<Teacher, 'id'>) {
    if (this.editingTeacher) {
      this.teachers = this.teachers.map(teacher =>
        teacher.id === this.editingTeacher!.id
          ? { ...teacherData, id: this.editingTeacher!.id }
          : teacher
      );
      this.editingTeacher = null;
      this.isFormOpen = false;
    }
  }

  handleDeleteTeacher(id: string) {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teachers = this.teachers.filter(teacher => teacher.id !== id);
    }
  }
} 