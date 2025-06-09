import { Course } from "./course.interface";

export interface ApiResponse<T> {
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

export interface PageableResponse<T> {
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

export interface FilterRequest {
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

export interface Teacher {
    id: number;
    firstName: string;
    lastName: string;
    title: string;
    courses?: Course[];
}