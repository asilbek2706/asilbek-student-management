import { inject, Injectable } from '@angular/core';
import { StudentFormInterface } from '../model/student-form.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/students';

  getStudents(): Observable<StudentFormInterface[]> {
    return this.http.get<StudentFormInterface[]>(this.apiUrl);
  }

  getStudentById(id: string | number): Observable<StudentFormInterface> {
    return this.http.get<StudentFormInterface>(`${this.apiUrl}/${id}`);
  }

  addStudent(student: Omit<StudentFormInterface, 'id'>): Observable<StudentFormInterface> {
    return this.http.post<StudentFormInterface>(this.apiUrl, student);
  }

  updateStudent(
    id: string | number,
    updatedStudent: StudentFormInterface,
  ): Observable<StudentFormInterface> {
    return this.http.put<StudentFormInterface>(`${this.apiUrl}/${id}`, updatedStudent);
  }

  deleteStudent(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
