import { add, format } from 'date-fns'
import Storage from './storage'
import Project from './project'
import Task from './task'

export default class UI {

    static loadHomePage() {
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
        UI.openProject('Inbox', this);
    }
    
    static openTodayTasks() {
        // OPEN TODAY TASKS
        Storage.updateTodayProject();
        UI.openProject('Today', this);
    }

    static openWeekTasks() {
        // OPEN WEEK TASKS
        Storage.updateWeekProject();
        UI.openProject('Week', this);
    }

    static handleProjectButton(e) {
        // HANDLE PROJECT BUTTONS
        const projectName = e.target.textContent;
        const projectBtn = e.target;
        UI.openProject(projectName, projectBtn);
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
        UI.openProject('Inbox', this);
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

    static openProject(projectName, projectBtn) {
        // OPEN PROJECT
        const projectTitle = document.getElementById('project-title');
        const deleteProjectBtn = document.getElementById('delete-project-btn');

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

        projectTitle.textContent = projectName;
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

}
