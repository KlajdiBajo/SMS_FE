import { Course } from './course.interface';
import { Teacher } from './teacher.interface';

export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    serialNumber: string;
    course?: Course;
}

export interface StudentFormData {
    firstName: string;
    lastName: string;
    serialNumber: string;
}

export interface UpsertStudentRequest extends StudentFormData {
    id?: number;
}

export interface GetStudentRequest {
    id: number;
}

export interface DeleteStudentRequest {
    id: number;
}

export interface AssociateStudentToCourseRequest {
    idStudent: number;
    idCourse: number;
}

export interface RemoveStudentFromCourseRequest {
    idStudent: number;
    idCourse: number;
}

export interface StudentApiStatus {
    code: string;
    severity: string;
    message: string;
    action: string;
    helpReference: string;
    traceId: string;
}

export interface StudentApiResponse<T> {
    status: StudentApiStatus[];
    data: T;
}

export interface StudentPageableResponse<T> {
    status: StudentApiStatus[];
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

export interface StudentFilterRequest {
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