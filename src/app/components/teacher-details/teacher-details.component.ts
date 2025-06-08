import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close, create, trash, add } from 'ionicons/icons';

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
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() view = new EventEmitter<void>();

  constructor() {
    addIcons({ close, create, trash, add });
  }

  get initials(): string {
    return `${this.teacher?.firstName?.[0] ?? ''}${this.teacher?.lastName?.[0] ?? ''}`;
  }

  onClose() {
    this.close.emit();
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  onView() {
    this.view.emit();
  }
} 