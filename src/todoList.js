import { compareAsc, toDate } from "date-fns";
import Project from './project'
import Task from "./task";

export default class TodoList {
    constructor() {
        this.projects = [];
        this.projects.push(new Project('Inbox'));
        this.projects.push(new Project('Today'));
        this.projects.push(new Project('Week'));
    }

    setProjects(projects) {
        this.projects = projects;
    }

    getProjects() {
        return this.projects;
    }

    getProject(projectName) {
        return this.projects.find((project) => project.getName() === projectName);
    }

    contains(projectName) {
        return this.projects.some((project) => project.getName() === projectName);
    }

    addProject(newProject) {
        if (this.projects.find((project) => project.name === newProject.name)) return;
        this.projects.push(newProject);
    }

    deleteProject(projectName) {
        const projectToDelete = this.projects.find((project) => project.getName() === projectName);
        this.projects.splice(this.projects.indexOf(projectToDelete), 1);
    }

    updateTodayProject() {
        this.getProject('Today').tasks = [];

        this.projects.forEach((project) => {
            if(project.getName() === 'Today' || project.getName() === 'Week') return;
            
            const todayTasks = project.getTasksToday();
            todayTasks.forEach((task) => {
                const taskName = `${task.getName()}`;
                const taskProject = `${task.getProject()}`;
                this.getProject('Today').addTask(new Task(taskName, taskProject, task.getDate()));
            })
        })
    }

    updateWeekProject() {
        this.getProject('Week').tasks = [];

        this.projects.forEach((project) => {
            if(project.getName() === 'Today' || project.getName() === 'Week') return;
            
            const todayTasks = project.getTasksToday();
            todayTasks.forEach((task) => {
                const taskName = `${task.getName()}`;
                const taskProject = `${task.getProject()}`;
                this.getProject('Week').addTask(new Task(taskName, taskProject, task.getDate()));
            })
        })

        this.getProject('Week').setTasks(
            this.getProject('Week')
                .getTasks()
                .sort((taskA, taskB) => 
                    compareAsc(
                        toDate(taskA.getDateFormatted()),
                        toDate(taskB.getDateFormatted())))
        )
    }
}