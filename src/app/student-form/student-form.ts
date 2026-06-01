import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-create',
  imports: [ ReactiveFormsModule],
  templateUrl: './student-form.html',
})
export class StudentForm  {
  studentForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@acharya\.ac\.uz$/),
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/(?:\+?998)?\s?(9\d|7\d|3\d|8\d)\s?\d{3}\s?\d{2}\s?\d{2}/),
    ]),
    birthDate: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),

    studentId: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z]{3}\d{2}[A-Z]{3}\d{3}$/),
    ]),
    enrollmentDate: new FormControl('', Validators.required),
    branch: new FormControl('', Validators.required),
    course: new FormControl('', Validators.required),
    status: new FormControl('active', Validators.required),

    address: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zipCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
    }),
  });

  onSubmit(): void {
    console.log(this.studentForm.value);
  }
}
