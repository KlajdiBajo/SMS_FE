import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../components/teacher-details/teacher-details.component';

interface ApiResponse<T> {
    status: Array<{
        code: string;
        severity: string;
        message: string;
        action: string;
        helpReference: string;
        traceId: string;
    }>;
    data: T;
}

interface PageableResponse<T> {
    status: Array<{
        code: string;
        severity: string;
        message: string;
        action: string;
        helpReference: string;
        traceId: string;
    }>;
    slice: {
        content: T[];
        first: boolean;
        last: boolean;
        numberOfElements: number;
        size: number;
        number: number;
        empty: boolean;
        pageable: {
            offset: number;
            pageNumber: number;
            pageSize: number;
            paged: boolean;
            unpaged: boolean;
        };
    };
}

interface FilterRequest {
    filter: string;
    pagination: {
        pageNumber: number;
        pageSize: number;
        sort?: Array<{
            field: string;
            direction: string;
            ignoreCase: boolean;
            nullHandling: string;
        }>;
    };
}

@Injectable({
    providedIn: 'root'
})
export class TeacherService {
    private readonly API_URL = 'http://localhost:8080';

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