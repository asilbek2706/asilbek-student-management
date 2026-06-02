import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-student-create',
  imports: [ReactiveFormsModule],
  templateUrl: './student-form.html',
  standalone: true,
})
export class StudentForm {
  studentService = inject(StudentService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  studentForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@acharya\.ac\.uz$/)],
    }),
    phoneNumber: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/(?:\+?998)?\s?(9\d|7\d|3\d|8\d)\s?\d{3}\s?\d{2}\s?\d{2}/),
      ],
    }),
    birthDate: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    gender: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),

    studentId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Z]{3}\d{2}[A-Z]{3}\d{3}$/)],
    }),
    enrollmentDate: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    branch: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    course: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    status: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),

    address: new FormGroup({
      street: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      city: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      state: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      zipCode: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
      }),
    }),
  });

  constructor() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      const student = this.studentService.getStudentById(+id);
      if (student) {
        this.studentForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          phoneNumber: student.phoneNumber,
          birthDate: student.birthDate ? new Date(student.birthDate).toISOString().substring(0, 10) : '',
          gender: student.gender,
          studentId: student.studentId,
          enrollmentDate: student.enrollmentDate
            ? new Date(student.enrollmentDate).toISOString().substring(0, 10) : '',
          branch: student.branch,
          course: student.course ? student.course.toString() : '',
          status: student.status,
          address: {
            street: student.address?.street || '',
            city: student.address?.city || '',
            state: student.address?.state || '',
            zipCode: student.address?.zipCode || '',
          },
        });
      }
    }
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formValues = this.studentForm.getRawValue();

    const studentData = {
      ...formValues,
      course: Number(formValues.course) as 1 | 2 | 3 | 4,
      gender: formValues.gender as 'Male' | 'Female' | 'Other',
      branch: formValues.branch as 'B.TECH' | 'BCA',
      status: formValues.status as 'active' | 'suspended' | 'graduated',
    };

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      const existingStudent = this.studentService.getStudentById(+id);
      if (existingStudent) {
        this.studentService.updateStudent(existingStudent.id!, {
          ...studentData,
          id: existingStudent.id,
        });
        this.studentForm.reset();
        this.router.navigate(['/students']);
        return;
      }
    } else {
      const newId = Date.now();
      const data = { ...studentData, id: newId };
      this.studentService.addStudent(data);
      this.studentForm.reset();
      this.router.navigate(['/students']);
      return;
    }
  }
}
