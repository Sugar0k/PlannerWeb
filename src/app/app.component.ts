import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Task} from 'src/entity/Task';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  tasks: any;
  arr: WeakSet<Task>;
  constructor(private http: HttpClient) {
  }
  applyChanges(): void{
  }

  ngOnInit(): void {
    this.getAllTasks();
  }
  getAllTasks(): void {
    this.http.get('https://localhost:5001/Planner/api/GetAllTask')
      .subscribe((tasks: any) => {
        this.tasks = tasks.map(task => new Task(
          task.id,
          task.name,
          task.description,
          task.dateCreation,
          task.deadLine,
          task.isDone,
          task.whenDone));
        this.tasks.sort((a, b) => {
          if (a.isDone && b.isDone) {
            return a.deadline < b.deadline ? -1 : 1;
          } else if (a.isDone && !b.isDone) {
            return 1;
          } else if (!a.isDone && b.isDone) {
            return -1;
          } else {
            return a.deadline < b.deadline ? -1 : 1;
          }});
      });
  }
  createTask(form: NgForm): void {
    const headers = {'Content-Type': 'application/json'};
    // tslint:disable-next-line:triple-equals
    if (!(form.value.name == '' || form.value.description == '' || form.value.deadline == '')) {
      console.log('create task');
      this.http.post('https://localhost:5001/Planner/api/CreateTask', {
        name: form.value.name,
        description: form.value.description,
        deadLine: new Date(form.value.deadline)
      }, {headers}).subscribe( () => {
        this.getAllTasks();
      });
    }
  }
  // GetOthers(): void {
  //   for (let task of this.tasks) {
  //     if (!task.isActive) {
  //       task = null;
  //       // this.tasks.delete(task);
  //     }
  //     task.isActive = true;
  //   }
  // }
}
