import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Teacher } from '../teacher-details/teacher-details.component';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class TeacherFormComponent implements OnInit {
  @Input() teacher: Teacher | null = null;
  @Output() submitForm = new EventEmitter<Omit<Teacher, 'id'>>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      firstName: [this.teacher?.firstName || '', Validators.required],
      lastName: [this.teacher?.lastName || '', Validators.required],
      title: [this.teacher?.title || '', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }

  onClose() {
    this.close.emit();
  }
} 