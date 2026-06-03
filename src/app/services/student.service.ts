import { inject, Injectable } from '@angular/core';
import { StudentFormInterface } from '../model/student-form.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://6a1fb7f0e96c1d13b586306b.mockapi.io';
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  getStudents(): Observable<StudentFormInterface[]> {
    this.loadingSubject.next(true);
    return this.http.get<StudentFormInterface[]>(`${this.apiUrl}/students`).pipe(
      finalize(() => this.loadingSubject.next(false)),
    );
  }

  getStudentById(id: string | number): Observable<StudentFormInterface> {
    this.loadingSubject.next(true);
    return this.http.get<StudentFormInterface>(`${this.apiUrl}/students/${id}`).pipe(
      finalize(() => this.loadingSubject.next(false)),
    );
  }

  addStudent(student: Omit<StudentFormInterface, 'id'>): Observable<StudentFormInterface> {
    this.loadingSubject.next(true);
    return this.http.post<StudentFormInterface>(`${this.apiUrl}/students`, student).pipe(
      finalize(() => this.loadingSubject.next(false)),
    );
  }

  updateStudent(
    id: string | number,
    updatedStudent: StudentFormInterface,
  ): Observable<StudentFormInterface> {
    this.loadingSubject.next(true);
    return this.http.put<StudentFormInterface>(`${this.apiUrl}/students/${id}`, updatedStudent).pipe(
      finalize(() => this.loadingSubject.next(false)),
    );
  }

  deleteStudent(id: string | number): Observable<void> {
    this.loadingSubject.next(true);
    return this.http.delete<void>(`${this.apiUrl}/students/${id}`).pipe(
      finalize(() => this.loadingSubject.next(false)),
    );
  }
}
