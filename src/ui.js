import { format } from 'date-fns'
import Storage from './storage'
import Project from './project'
import Task from './task'

export default class UI {

    static loadHomePage() {
        Storage.addTask('A', new Task('AAAAAAAAA', 'A', 'No date'));
        Storage.addTask('A', new Task('BBBBB', 'A', '7/31/2023'));
        UI.loadProjects();
        UI.openProject('Inbox', document.getElementById('inbox-btn'));
    }
   
    // PROJECT

    static loadProjects() {
        Storage.getTodoList()
        .getProjects()
        .forEach((project) => {
            if (
            project.name !== 'Inbox' &&
            project.name !== 'Today' &&
            project.name !== 'Week'
            ) {
            UI.createProject(project.name);
            }
        })

        UI.initAddProjectButtons();
    } 

    static clearProjects() {
        // CLEAR PROJECTS-LIST
        const projectsList = document.getElementById('projects-list');
        
        projectsList.innerHTML = '';
    }

    static initAddProjectButtons() {
        // Add event listeners to the add project popup btns
        const addProjectBtn = document.getElementById('add-project-btn');
        const popupAddProjectBtn = document.getElementById('popup-add-project-btn');
        const popupAddProjectCancelBtn = document.getElementById('popup-add-project-cancel-btn');
        
        addProjectBtn.addEventListener('click', UI.openAddProjectPopup);
        popupAddProjectBtn.addEventListener('click', UI.addProject);
        popupAddProjectCancelBtn.addEventListener('click', UI.closeAddProjectPopup);
    }

    static initProjectButtons() {
        // Add event listeners to the nav btns
        const inboxBtn = document.getElementById('inbox-btn');
        const todayBtn = document.getElementById('today-btn');
        const weekBtn = document.getElementById('week-btn');
        const projectBtns = document.querySelectorAll('[data-project-button]');

        inboxBtn.addEventListener('click', UI.openInboxTasks);
        todayBtn.addEventListener('click', UI.openTodayTasks);
        weekBtn.addEventListener('click', UI.openWeekTasks);

        projectBtns.forEach((projectBtn) =>
            projectBtn.addEventListener('click', UI.handleProjectButton)
        );

        // Delete Project Button

        const deleteProjectBtn = document.getElementById('delete-project-btn');
        deleteProjectBtn.addEventListener('click', UI.removeProject);
    }

    static openInboxTasks() {
        // OPEN INBOX TASKS
        UI.openProject('Inbox');
    }
    
    static openTodayTasks() {
        // OPEN TODAY TASKS
        Storage.updateTodayProject();
        UI.openProject('Today');
    }

    static openWeekTasks() {
        // OPEN WEEK TASKS
        Storage.updateWeekProject();
        UI.openProject('Week');
    }

    static handleProjectButton(e) {
        // HANDLE PROJECT BUTTONS
        const projectName = e.target.textContent;
        UI.openProject(projectName);
    }

    static createProject(projectName) {
        // CREATE A PROJECT
        const projectsList = document.getElementById('projects-list');
        
        projectsList.innerHTML += `<button class="btn" data-project-button>${projectName}</button>`;
    
        UI.initProjectButtons();
    }

    static deleteProject(projectName) {
        // DELETE PROJECT
        Storage.deleteProject(projectName);
        UI.clearProjects();
        UI.loadProjects();
        UI.openProject('Inbox');
    }

    static addProject() {
        // ADD A NEW PROJECT
        const addProjectPopupInput = document.getElementById('input-add-project-popup');

        const projectName = addProjectPopupInput.value;

        if (projectName === '') {
            alert("Project name can't be empty");
            return;
        }

        if (Storage.getTodoList().contains(projectName)) {
            addProjectPopupInput.value = '';
            alert("Project names must be different");
            return;
        }
        
        addProjectPopupInput.value = '';
        Storage.addProject(new Project(projectName));
        UI.createProject(projectName);
        UI.closeAddProjectPopup();
    }

    static openProject(projectName) {
        // OPEN PROJECT
        const projectTitle = document.getElementById('project-title');
        const deleteProjectBtn = document.getElementById('delete-project-btn');
        const addTaskBtn = document.getElementById('add-task-btn');

        if (
            projectName == 'Inbox' ||
            projectName == 'Today' ||
            projectName == 'Week'
            ) {
            deleteProjectBtn.style.display = 'none';
        }
        else {
            deleteProjectBtn.style.display = 'block';
        }

        // CHANGE THIS LATER
        if (
            projectName == 'Today' ||
            projectName == 'Week'
            ) {
            addTaskBtn.style.display = 'none';
        }
        else {
            addTaskBtn.style.display = 'block';
        }
        // CHANGE THIS LATER

        projectTitle.textContent = projectName;
        UI.loadTasks(projectName);
        UI.initTasksButtons();
    } 

    static removeProject() {
        // Remove a Project
        const projectTitle = document.getElementById('project-title');
        const projectName = projectTitle.textContent;
        UI.deleteProject(projectName);
    }

    static openAddProjectPopup() {
        // OPEN ADD PROJECT POPUP
        const addProjectPopup = document.getElementById('add-project-popup');
        const addProjectBtn = document.getElementById('add-project-btn');
        addProjectPopup.classList = 'add-project-popup active';
        addProjectBtn.style.display = 'none';
    }

    static closeAddProjectPopup() {
        // CLOSE ADD PROJECT POPUP
        const addProjectPopup = document.getElementById('add-project-popup');
        const addProjectBtn = document.getElementById('add-project-btn');
        addProjectPopup.classList = 'add-project-popup';
        addProjectBtn.style.display = 'block';
    }

    static loadTasks(projectName) {
        // LOAD TASKS
        UI.clearTasks();
        const tasks = Storage.getTodoList().getProject(projectName).getTasks();
        tasks.forEach((task) => {
            UI.createTask(task);
        })
    }

    static clearTasks() {
        // CLEAR TASK LIST
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = '';
    }

    static createTask(task) {
        // CREATE A NEW TASK DOM
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML += `
        <div class="button-task">
            <div class="task-panel left-task-panel">
                <i class="far fa-circle" task-status-button></i>
                <h4>${task.name}</h4>
            </div>
            <div class="task-panel center-task-panel">
                <h4 class="projectName">${task.project}</h4>
            </div>
            <div class="task-panel right-task-panel">
                <h4>${task.dueDate}</h4>
            </div>
        </div>
        `;

        UI.initTasksButtons()
    }

    static initTasksButtons() {
        // ADD EVENT LISTENERS TO THE TASKS BUTTONS
        const addTaskBtn = document.getElementById('add-task-btn');
        const taskStatusBtns = document.querySelectorAll('[task-status-button]');

        addTaskBtn.addEventListener('click', UI.openAddTaskPopup);

        taskStatusBtns.forEach((taskBtn) =>
            taskBtn.addEventListener('click', UI.handleTaskStatusButton)
        );
    }

    static handleTaskStatusButton(e) {
        // HANDLE TASK STATUS BUTTONS
        const taskProjectTitle = e.target.parentNode.parentNode.children[1].children[0];
        const taskProjectName = taskProjectTitle.textContent;
        const taskName = e.target.parentNode.children[1].textContent;
        
        const projectName = document.getElementById('project-title').textContent;

        Storage.deleteTask(taskProjectName, taskName)
        Storage.updateTodayProject();
        Storage.updateWeekProject();
        UI.loadTasks(projectName);
    }

    static initAddTaskPopupButtons() {
        // ADD EVENT LISTENERS TO THE ADD TASK POPUP BUTTONS
        const popupAddTaskBtn = document.getElementById('popup-add-task-btn');
        const popupAddTaskCancelBtn = document.getElementById('popup-add-task-cancel-btn');

        popupAddTaskBtn.addEventListener('click', UI.addNewTask);
        popupAddTaskCancelBtn.addEventListener('click', UI.closeAddTaskPopup)
    }

    static openAddTaskPopup() {
        // OPEN ADD TASK POPUP
        const addTaskPopup = document.getElementById('add-task-popup');
        const addTaskBtn = document.getElementById('add-task-btn');

        addTaskPopup.style.display = 'flex';
        addTaskBtn.style.display = 'none';

        UI.initAddTaskPopupButtons();
    }

    static closeAddTaskPopup() {
        // CANCEL ADD TASK POPUP
        const addTaskPopup = document.getElementById('add-task-popup');
        const addTaskBtn = document.getElementById('add-task-btn');

        addTaskPopup.style.display = 'none';
        addTaskBtn.style.display = 'block';
    }

    static addNewTask() {
        // ADD NEW TASK  
        const projectName = document.getElementById('project-title').textContent;
        const addTaskPopupInput = document.getElementById('input-add-task-popup');

        const taskName = addTaskPopupInput.value;

        if (taskName === '') {
            alert("Task name can't be empty");
            return;
        }

        if (Storage.getTodoList().getProject(projectName).contains(taskName)) {
            addTaskPopupInput.value = '';
            alert("Task name must be different");
            return;
        }
        
        addTaskPopupInput.value = '';
        const task = new Task(taskName, projectName, 'No date');

        Storage.addTask(projectName, task);
        UI.createTask(task);
        UI.closeAddTaskPopup();
    }
}
