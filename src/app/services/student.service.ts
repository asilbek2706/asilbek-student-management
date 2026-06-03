import { inject, Injectable } from '@angular/core';
import { StudentFormInterface } from '../model/student-form.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://6a1fb7f0e96c1d13b586306b.mockapi.io/';

  getStudents(): Observable<StudentFormInterface[]> {
    return this.http.get<StudentFormInterface[]>(`${this.apiUrl}/students`);
  }

  getStudentById(id: string | number): Observable<StudentFormInterface> {
    return this.http.get<StudentFormInterface>(`${this.apiUrl}/students/${id}`);
  }

  addStudent(student: Omit<StudentFormInterface, 'id'>): Observable<StudentFormInterface> {
    return this.http.post<StudentFormInterface>(`${this.apiUrl}/students`, student);
  }

  updateStudent(
    id: string | number,
    updatedStudent: StudentFormInterface,
  ): Observable<StudentFormInterface> {
    return this.http.put<StudentFormInterface>(`${this.apiUrl}/students/${id}`, updatedStudent);
  }

  deleteStudent(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/students/${id}`);
  }
}
