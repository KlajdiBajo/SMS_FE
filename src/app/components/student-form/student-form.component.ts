import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonInput, IonSelect, IonSelectOption, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

export interface StudentFormData {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | string;
}

export interface Student extends StudentFormData {
  id: string;
  courses: any[]; // You can replace 'any' with Course[] if you have a Course interface
}

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonIcon
  ]
})
export class StudentFormComponent implements OnChanges {
  @Input() student?: Student;
  @Input() isOpen = false;
  @Output() submitForm = new EventEmitter<StudentFormData>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    addIcons({ close });
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      dateOfBirth: [''],
      address: [''],
      enrollmentDate: [''],
      status: ['active', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['student'] && this.student) {
      this.form.patchValue({
        name: this.student.name,
        email: this.student.email,
        phoneNumber: this.student.phoneNumber,
        dateOfBirth: this.student.dateOfBirth,
        address: this.student.address,
        enrollmentDate: this.student.enrollmentDate,
        status: this.student.status,
      });
    } else if (changes['student'] && !this.student) {
      this.form.reset({ status: 'active' });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      // Optionally show a toast here
      return;
    }
    this.submitForm.emit(this.form.value);
  }

  onCancel() {
    this.cancel.emit();
  }
}
