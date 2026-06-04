import { Component, inject, OnInit } from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
  // Servislarni inject orqali chaqirish juda toza chiqqan 👍
  private studentService = inject(StudentService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private currentStudentId: number | string | null = null;

  studentForm = this.fb.group({
    firstName: ['', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }],
    lastName: ['', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }],
    email: ['', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@acharya\.ac\.uz$/)],
    }],
    phoneNumber: ['', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/(?:\+?998)?\s?(9\d|7\d|3\d|8\d)\s?\d{3}\s?\d{2}\s?\d{2}/),
      ],
    }],
    birthDate: ['', { nonNullable: true, validators: Validators.required }],
    gender: ['', { nonNullable: true, validators: Validators.required }],
    studentId: ['', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Z]{3}\d{2}[A-Z]{3}\d{3}$/)],
    }],
    enrollmentDate: ['', { nonNullable: true, validators: Validators.required }],
    branch: ['', { nonNullable: true, validators: Validators.required }],
    course: ['', { nonNullable: true, validators: Validators.required }], 
    status: ['', { nonNullable: true, validators: Validators.required }],

    address: this.fb.group({
      street: ['', { nonNullable: true, validators: Validators.required }],
      city: ['', { nonNullable: true, validators: Validators.required }],
      state: ['', { nonNullable: true, validators: Validators.required }],
      zipCode: ['', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
      }],
    }),
  });

  ngOnInit(): void {
    // ID ni bitta joyda o'qib, o'zgaruvchiga olamiz
    this.currentStudentId = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (this.currentStudentId) {
      this.loadStudent(this.currentStudentId);
    }
  }

  loadStudent(studentId: string): void {
  this.studentService.getStudentById(studentId).subscribe({
    next: (data) => {
      const studentData = { 
        ...data,
        course: data.course?.toString() || '',
        address: data.address || {} 
      };

      this.studentForm.patchValue(studentData);
    },
    error: (error) => {
      console.error('Studentni yuklashda xatolik:', error);
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
    } as Omit<StudentFormInterface, 'id'>;
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched(); // Foydalanuvchiga xatoliklarni qizil qilib ko'rsatish uchun
      return;
    }

    const studentData = this.buildStudentPayload();

    if (this.currentStudentId) {
      // OPTIMIZATSIYA: Ortiqcha getStudentById so'rovisiz to'g'ridan-to'g'ri update qilamiz
      this.studentService
        .updateStudent(this.currentStudentId, { ...studentData, id: this.currentStudentId })
        .subscribe({
          next: () => {
            console.log('Student muvaffaqiyatli yangilandi');
            this.router.navigate(['/students']);
          },
          error: (error) => {
            console.error('Studentni yangilashda xatolik:', error);
          },
        });
    } else {
      // Yangi student qo'shish rejimi
      this.studentService.addStudent(studentData).subscribe({
        next: () => {
          this.studentForm.reset();
          this.router.navigate(['/students']);
        },
        error: (error) => {
            throw new Error('Studentni qo\'shishda xatolik: ' + error.message);
        },
      });
    }
  }
}