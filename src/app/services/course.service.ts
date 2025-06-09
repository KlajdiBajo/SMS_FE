import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course, ApiResponse, PageableResponse } from '../interfaces/course.interface';

@Injectable({ providedIn: 'root' })
export class CourseService {
    private readonly API_URL = environment.API_URL;

    constructor(private http: HttpClient) { }

    upsertCourse(course: Partial<Course>): Observable<ApiResponse<Course>> {
        return this.http.post<ApiResponse<Course>>(`${this.API_URL}/upsertCourse`, course);
    }

    getCourse(id: number): Observable<ApiResponse<Course>> {
        return this.http.post<ApiResponse<Course>>(`${this.API_URL}/getCourse`, { id });
    }

    deleteCourse(id: number): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.API_URL}/deleteCourse`, { id });
    }

    removeTeacherFromCourse(idTeacher: number, idCourse: number): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.API_URL}/removeTeacherFromCourse`, { idTeacher, idCourse });
    }

    associateTeacherToCourse(idTeacher: number, idCourse: number): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.API_URL}/associateTeacherToCourse`, { idTeacher, idCourse });
    }

    filterCourses(filter: string, pagination: any): Observable<PageableResponse<Course>> {
        return this.http.post<PageableResponse<Course>>(`${this.API_URL}/filterCourses`, { filter, pagination });
    }
} 