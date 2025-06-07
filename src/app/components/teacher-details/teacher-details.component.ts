import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  subject: string;
  hireDate: string;
}

@Component({
  selector: 'app-teacher-details',
  templateUrl: './teacher-details.component.html',
  styleUrls: ['./teacher-details.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class TeacherDetailsComponent {
  @Input() teacher!: Teacher;
  @Output() close = new EventEmitter<void>();

  get initials(): string {
    return `${this.teacher?.firstName?.[0] ?? ''}${this.teacher?.lastName?.[0] ?? ''}`;
  }

  onClose() {
    this.close.emit();
  }
} 