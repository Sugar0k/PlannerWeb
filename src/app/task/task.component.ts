import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Task} from '../../entity/Task';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest} from '@angular/common/http';
import {SubscribeOnObservable} from 'rxjs/internal-compatibility';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: Task;
  forChangeTask: Task;
  status: string;
  edit: boolean;
  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.chekStatus();
  }
  ngOnDestroy(): void {
    console.log('destroy');
  }
  deleteTask(): void {
    this.http.delete('https://localhost:5001/Planner/api/DeleteTask?id=' + this.task.id).subscribe();
    this.task.isActive = false;
  }
  changeTask(): void {
    this.forChangeTask = new Task(this.task.id,
      this.task.name,
      this.task.description,
      this.task.dateCreation,
      this.task.deadline,
      this.task.isDone,
      this.task.whenDone);
    this.edit = true;
  }
  doneTask(): void {
    this.http.put('https://localhost:5001/Planner/api/DoneTask?id=' + this.task.id, '').subscribe(() => {
      this.http.get('https://localhost:5001/Planner/api/GetTaskById?id=' + this.task.id).subscribe((task: any) => {
        this.task.id = task.id;
        this.task.name = task.name;
        this.task.description = task.description;
        this.task.dateCreation = task.dateCreation;
        this.task.deadline = task.deadLine;
        this.task.isDone = task.isDone;
        this.task.whenDone =  task.whenDone;
        this.chekStatus();
      });
    });
  }
  chekStatus(): void {
    if (this.task.isDone) {
      if (new Date(this.task.deadline) < new Date(this.task.whenDone)) {
        this.status = 'expiredTime';
      } else {
        this.status = 'complete';
      }
    } else {
      if (new Date(this.task.deadline) < new Date(Date.now())) {
        this.status = 'dontComplete';
      } else {
        this.status = 'inProgress';
      }
    }
  }
  doneEdit(form): void {
    console.log(1);
    this.task.name = this.forChangeTask.name;
    this.task.description = this.forChangeTask.description;
    this.task.dateCreation = this.forChangeTask.dateCreation;
    this.task.deadline = this.forChangeTask.deadline;
    this.task.isDone = this.forChangeTask.isDone;
    this.task.whenDone = this.forChangeTask.whenDone;
    this.edit = false;
    const headers = {'Content-Type': 'application/json'};
    this.http.post('https://localhost:5001/Planner/api/EditTask', {
      id: this.task.id,
      name: form.value.name,
      description: form.value.description,
      dateCreation: form.value.dateCreation,
      deadLine: form.value.deadline,
      isDone: form.value.isDone,
      whenDone: form.value.whenDone
    }, {headers}).subscribe();
    this.chekStatus();
  }
  cancelEdit(): void {
    this.edit = false;
  }
}
