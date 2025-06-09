import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course, CourseFormData } from '../../interfaces/course.interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class CourseFormComponent implements OnInit, OnChanges {
  @Input() course?: Course;
  @Input() isOpen: boolean = false;
  @Output() formSubmit = new EventEmitter<CourseFormData>();
  @Output() cancel = new EventEmitter<void>();

  courseForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.courseForm = this.createForm();
  }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges() {
    if (this.course) {
      this.populateForm();
    } else {
      this.resetForm();
    }
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      code: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: [''],
      year: [2024, [Validators.required, Validators.min(1900), Validators.max(2100)]]
    });
  }

  initializeForm() {
    if (this.course) {
      this.populateForm();
    }
  }

  populateForm() {
    if (this.course) {
      this.courseForm.patchValue({
        code: this.course.code,
        title: this.course.title,
        description: this.course.description,
        year: this.course.year
      });
    }
  }

  resetForm() {
    this.courseForm.reset({
      code: '',
      title: '',
      description: '',
      year: 2024
    });
  }

  onSubmit() {
    console.log('onSubmit called', this.courseForm.value);
    if (this.courseForm.valid) {
      const formData: CourseFormData = this.courseForm.value;
      this.formSubmit.emit(formData);
    } else {
      // Mark all fields as touched to show validation errors
      this.courseForm.markAllAsTouched();
      console.log('Please fill in all required fields');
      // In a real app, you'd use a toast service here
    }
  }

  onCancel() {
    this.cancel.emit();
    this.resetForm();
  }

  // Helper method to check if a field has an error
  hasError(fieldName: string): boolean {
    const field = this.courseForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Helper method to get error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.courseForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['min']) {
        return `${fieldName} must be at least ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${fieldName} cannot exceed ${field.errors['max'].max}`;
      }
    }
    return '';
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('course-form-backdrop')) {
      this.onCancel();
    }
  }
}