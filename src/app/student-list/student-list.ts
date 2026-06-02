import { StudentService } from './../services/student.service';
import { Component, inject, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.studentList = this.studentService.getStudents();
  }

  onEdit(student: StudentFormInterface): void {
    console.log('Edit bosildi:', student);
  }

  onDelete(student: StudentFormInterface):void{
    this.studentService.deleteStudent(student.id)
    this.studentList = this.studentService.getStudents();
  }
}
