import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../interfaces/teacher.interface';
import { environment } from '../../environments/environment';
import { ApiResponse, PageableResponse, FilterRequest } from '../interfaces/teacher.interface';
@Injectable({
    providedIn: 'root'
})
export class TeacherService {
    private readonly API_URL = environment.API_URL;

    constructor(private http: HttpClient) { }

    upsertTeacher(teacher: Partial<Teacher>): Observable<ApiResponse<Teacher>> {
        return this.http.post<ApiResponse<Teacher>>(`${this.API_URL}/upsertTeacher`, teacher);
    }

    getTeacher(id: number): Observable<ApiResponse<Teacher>> {
        return this.http.post<ApiResponse<Teacher>>(`${this.API_URL}/getTeacher`, { id });
    }

    deleteTeacher(id: number): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.API_URL}/deleteTeacher`, { id });
    }

    filterTeachers(searchTerm: string = '', pageNumber: number = 0, pageSize: number = 10): Observable<PageableResponse<Teacher>> {
        const request: FilterRequest = {
            filter: searchTerm,
            pagination: {
                pageNumber,
                pageSize,
                sort: [
                    {
                        field: "lastName",
                        direction: "ASC",
                        ignoreCase: true,
                        nullHandling: "NATIVE"
                    }
                ]
            }
        };

        return this.http.post<PageableResponse<Teacher>>(`${this.API_URL}/filterTeachers`, request);
    }
} 