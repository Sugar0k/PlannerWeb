export class Task{
  id: number;
  name: string;
  description: string;
  dateCreation: Date;
  deadline: Date;
  isDone: boolean;
  whenDone: Date;
  isActive: boolean;

  constructor(id: number, name: string, description: string, dateCreation: Date, deadLine: Date, isDone: boolean, whenDone: Date) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.dateCreation = dateCreation;
    this.deadline = deadLine;
    this.isDone = isDone;
    this.whenDone = whenDone;
    this.isActive = true;
  }
}
