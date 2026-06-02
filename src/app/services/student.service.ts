import { Injectable } from '@angular/core';
import { StudentFormInterface } from '../model/student-form.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private students: StudentFormInterface[] = [];

  constructor() {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      this.students = JSON.parse(savedStudents);
    }
  }

  getStudents(): StudentFormInterface[] {
    return this.students;
  }

  getStudentById(id: number): StudentFormInterface | undefined {
    return this.students.find((student) => student.id === id);
  }

  addStudent(student: StudentFormInterface): void {
    this.students.push(student);
    localStorage.setItem('students', JSON.stringify(this.students));
  }

  updateStudent(id: number, updatedStudent: StudentFormInterface): void {
    const index = this.students.findIndex((student) => student.id === id);
    if (index !== -1) {
      this.students[index] = updatedStudent;
      localStorage.setItem('students', JSON.stringify(this.students));
    }
  }

  deleteStudent(id: number): void {
    this.students = this.students.filter((student) => student.id !== id);
    localStorage.setItem('students', JSON.stringify(this.students));
  }
}
