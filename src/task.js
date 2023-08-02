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

    static setDate(task, newDueDate) {
        task.dueDate = newDueDate;
    }

    getDate() {
        return this.dueDate;
    }

    static getDateFormatted(task) {
        // console.log(task.dueDate);
        if(task.dueDate === 'No date') return 'No date';
        const day = task.dueDate.split('/')[0];
        const month = task.dueDate.split('/')[1];
        const year = task.dueDate.split('/')[2];
        return `${month}/${day}/${year}`;
    }
}