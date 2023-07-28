import { toDate, isToday, isThisWeek, subDays } from 'date-fns';
import Task from './task';

export default class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setTasks(tasks) {
        this.tasks = tasks;
    }

    getTasks() {
        return this.tasks;
    }

    getTask(taskName) {
        return this.tasks.find((task) => task.name === taskName);
    }

    contains(taskName) {
        return this.tasks.some((task) => task.name === taskName);
    }

    addTask(newTask) {
        if (this.tasks.find((task) => task.name === newTask.name)) return;
        this.tasks.push(newTask);
    }

    deleteTask(taskName) {
        this.tasks = this.tasks.filter((task) => task.name !== taskName);
    }

    getTasksToday() {
        return this.tasks.filter((task) => {
            const taskDate = new Date(Task.getDateFormatted(task));
            return isToday(toDate(taskDate));
        })
    }

    getTasksThisWeek() {
        return this.tasks.filter((task) => {
            const taskDate = new Date(Task.getDateFormatted(task));
            return isThisWeek(subDays(toDate(taskDate),1));
        })
    }
}