import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonInput, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { Student, StudentFormData } from '../../interfaces/student.interface';

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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      serialNumber: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['student'] && this.student) {
      this.form.patchValue({
        firstName: this.student.firstName,
        lastName: this.student.lastName,
        serialNumber: this.student.serialNumber,
      });
    } else if (changes['student'] && !this.student) {
      this.form.reset();
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
