import { StudentService } from './../services/student.service';
import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { StudentFormInterface } from '../model/student-form.interface';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit, OnDestroy {
  studentList: StudentFormInterface[] = [];
  studentService = inject(StudentService);
  cdr = inject(ChangeDetectorRef);
  loading = false;
  private loadingSub?: Subscription;

  ngOnInit(): void {
    this.loadingSub = this.studentService.loading$.subscribe((l: boolean) => {
      this.loading = l;
      this.cdr.detectChanges();
    });

    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.loadingSub?.unsubscribe();
  }

  loadStudents(){
    this.studentService.getStudents().subscribe({
      next: (data: StudentFormInterface[]) => {
        this.studentList = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching students:', error);
      } 
    })
  }

  onDelete(student: StudentFormInterface):void{
    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        this.studentList = this.studentList.filter((currentStudent) => currentStudent.id !== student.id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting student:', error);
      },
    });
  }
}
