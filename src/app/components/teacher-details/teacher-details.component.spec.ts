import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherDetailsComponent, Teacher } from './teacher-details.component';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';

describe('TeacherDetailsComponent', () => {
  let component: TeacherDetailsComponent;
  let fixture: ComponentFixture<TeacherDetailsComponent>;

  const mockTeacher: Teacher = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    department: 'Mathematics',
    subject: 'Algebra',
    hireDate: '2020-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherDetailsComponent, IonicModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(TeacherDetailsComponent);
    component = fixture.componentInstance;
    component.teacher = mockTeacher;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display teacher name', () => {
    const nameEl = fixture.debugElement.query(By.css('.teacher-details-name'));
    expect(nameEl.nativeElement.textContent).toContain('John Doe');
  });
}); 