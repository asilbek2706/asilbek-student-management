import { Routes } from '@angular/router';
import { Student } from './student/student';
import { StudentList } from './student-list/student-list';
import { StudentForm } from './student-form/student-form';

export const routes: Routes = [
    {
        path: '',
        component: Student,
        title: 'Student Management'
    },
    {
        path: 'students',
        component: StudentList,
        title: 'Student List'
    },
    {
        path: "create",
        component: StudentForm,
        title: 'Create Student'
    },
    {
        path: "edit/:slug",
        component: StudentForm,
        title: 'Edit Student'
    }
];
