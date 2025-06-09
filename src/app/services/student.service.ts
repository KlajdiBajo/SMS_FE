import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    Student,
    StudentApiResponse,
    StudentPageableResponse,
    UpsertStudentRequest,
    GetStudentRequest,
    DeleteStudentRequest,
    StudentFilterRequest,
    AssociateStudentToCourseRequest,
    RemoveStudentFromCourseRequest
} from '../interfaces/student.interface';

@Injectable({ providedIn: 'root' })
export class StudentService {
    private readonly API_URL = environment.API_URL;

    constructor(private http: HttpClient) { }

    upsertStudent(body: UpsertStudentRequest): Observable<StudentApiResponse<Student>> {
        return this.http.post<StudentApiResponse<Student>>(`${this.API_URL}/upsertStudent`, body);
    }

    getStudent(id: number): Observable<StudentApiResponse<Student>> {
        return this.http.post<StudentApiResponse<Student>>(`${this.API_URL}/getStudent`, { id });
    }

    deleteStudent(id: number): Observable<StudentApiResponse<{}>> {
        return this.http.post<StudentApiResponse<{}>>(`${this.API_URL}/deleteStudent`, { id });
    }

    filterStudents(filter: string, pagination: { pageNumber: number; pageSize: number; sort?: any[] }): Observable<StudentPageableResponse<Student>> {
        const request: StudentFilterRequest = {
            filter,
            pagination
        };
        return this.http.post<StudentPageableResponse<Student>>(`${this.API_URL}/filterStudents`, request);
    }

    associateStudentToCourse(idStudent: number, idCourse: number): Observable<StudentApiResponse<{}>> {
        return this.http.post<StudentApiResponse<{}>>(`${this.API_URL}/associateStudentToCourse`, { idStudent, idCourse });
    }

    removeStudentFromCourse(idStudent: number, idCourse: number): Observable<StudentApiResponse<{}>> {
        return this.http.post<StudentApiResponse<{}>>(`${this.API_URL}/removeStudentFromCourse`, { idStudent, idCourse });
    }
} 