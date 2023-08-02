export default class Task {
    constructor(name, project, dueDate = 'No date') {
        this.name = name;
        this.project = project;
        this.dueDate = dueDate;
    }

    static setName(task, newName) {
        task.name = newName;
    }

    getName() {
        return this.name;
    } 

    setProject(project) {
        this.project = project;
    }

    getProject() {
        return this.project
    }

    setDate(dueDate) {
        this.dueDate = dueDate;
    }

    getDate() {
        return this.dueDate;
    }

    static getDateFormatted(task) {
        const day = task.dueDate.split('/')[0];
        const month = task.dueDate.split('/')[1];
        const year = task.dueDate.split('/')[2];
        return `${day}/${month}/${year}`;
    }
}