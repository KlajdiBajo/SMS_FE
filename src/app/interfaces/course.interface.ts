import { Teacher } from "./teacher.interface";

export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    serialNumber: string;
    course: string;
}

export interface Course {
    id: number;
    code: string;
    title: string;
    description: string;
    year: number;
    teacher?: Teacher;
    students?: Student[];
}

export interface CourseFormData {
    code: string;
    title: string;
    description: string;
    year: number;
    teacherId?: number;
}

export interface ApiStatus {
    code: string;
    severity: string;
    message: string;
    action: string;
    helpReference: string;
    traceId: string;
}

export interface ApiResponse<T> {
    status: ApiStatus[];
    data: T;
}

export interface PageableResponse<T> {
    status: ApiStatus[];
    slice: {
        size: number;
        content: T[];
        number: number;
        sort: any;
        first: boolean;
        last: boolean;
        numberOfElements: number;
        pageable: any;
        empty: boolean;
    };
}
