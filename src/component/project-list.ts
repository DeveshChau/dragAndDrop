import { Component } from "./base-component.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { Autobind } from "../decorators/autobind.js";
import { prjState } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";

export class ProjectList extends Component<HTMLTemplateElement, HTMLDivElement> implements DragTarget {
    assignedProjects: Project[];
    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }

    @Autobind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    }

    @Autobind
    dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData('text/plain');
        prjState.moveProject(
            prjId,
            this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Fininshed
        );
    }

    @Autobind
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        prjState.addListener((project: Project[]) => {
            const releventProject = project.filter((prj: Project) => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Fininshed;
            })
            this.assignedProjects = releventProject;
            this.renderProject();
        });
    }
    private renderProject() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const prj of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prj);
        }
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
}
