import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentFormInterface } from '../model/student-form.interface';

@Component({
  selector: 'app-student-create',
  imports: [ReactiveFormsModule],
  templateUrl: './student-form.html',
  standalone: true,
})
export class StudentForm implements OnInit {
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

  ngOnInit(): void {
    const studentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (studentId) {
      this.loadStudent(studentId);
    }
  }

  loadStudent(studentId: string): void {
    this.studentService
      .getStudentById(studentId)
      .subscribe({
        next: (data) => {
          this.studentForm.patchValue({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            birthDate: data.birthDate
              ? new Date(data.birthDate).toISOString().substring(0, 10)
              : '',
            gender: data.gender,
            studentId: data.studentId,
            enrollmentDate: data.enrollmentDate
              ? new Date(data.enrollmentDate).toISOString().substring(0, 10)
              : '',
            branch: data.branch,
            course: data.course ? data.course.toString() : '',
            status: data.status,
            address: {
              street: data.address?.street || '',
              city: data.address?.city || '',
              state: data.address?.state || '',
              zipCode: data.address?.zipCode || '',
            },
          });
        },
        error: (error) => {
          console.error('Error loading student:', error);
        },
      });
  }

  private buildStudentPayload(): Omit<StudentFormInterface, 'id'> {
    const studentData = this.studentForm.getRawValue();

    return {
      ...studentData,
      course: Number(studentData.course) as StudentFormInterface['course'],
      gender: studentData.gender as StudentFormInterface['gender'],
      branch: studentData.branch as StudentFormInterface['branch'],
      status: studentData.status as StudentFormInterface['status'],
    };
  }

  onSubmit(): void {
    const studentId = this.activatedRoute.snapshot.paramMap.get('id');
    const studentData = this.buildStudentPayload();

    if (studentId) {
      this.studentService.getStudentById(studentId).subscribe({
        next: (student) => {
          this.studentService
            .updateStudent(studentId, { ...studentData, id: student.id })
            .subscribe({
              next: () => {
                this.router.navigate(['/students']);
              },
              error: (error) => {
                console.error('Error updating student:', error);
              },
            });
        },
        error: (error) => {
          console.error('Error fetching student for update:', error);
        },
      });
    } else {
      this.studentService.addStudent(studentData).subscribe({
        next: () => {
          this.studentForm.reset();
          this.router.navigate(['/students']);
        },
        error: (error) => {
          console.error('Error creating student:', error);
        },
      });
    }
  }
}
