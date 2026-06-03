import { StudentService } from './../services/student.service';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { StudentFormInterface } from '../model/student-form.interface';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {
  studentList: StudentFormInterface[] = [];
  studentService = inject(StudentService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadStudents();
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
