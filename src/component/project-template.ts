import { Component } from "./base-component.js";
import { Validable, validate } from "../util/validate.js";
import { Autobind } from "../decorators/autobind.js";
import { prjState } from "../state/project-state.js";

export class ProjectTemplate extends Component<HTMLTemplateElement, HTMLDivElement> {
    title: HTMLInputElement;
    description: HTMLInputElement;
    people: HTMLInputElement;
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.title = this.element.querySelector('#title') as HTMLInputElement;
        this.description = this.element.querySelector('#description') as HTMLInputElement;
        this.people = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();
    }
    renderContent() { }
    configure() {
        this.element.addEventListener('submit', this.handleEvent)
    }
    private gatherUserInput(): [string, string, number] | void {
        const titleInput = this.title.value;
        const descriptionInput = this.description.value;
        const peopleInput = this.people.value;
        const validateTitle: Validable = {
            value: titleInput,
            required: true
        }
        const validateDescription: Validable = {
            value: descriptionInput,
            minLength: 5,
        }
        const validatePeople: Validable = {
            value: +peopleInput,
            max: 5,
            min: 1
        }
        if (!validate(validateTitle) || !validate(validateDescription) || !validate(validatePeople)) {
            alert('Inter proper value');
            return;
        } else {
            return [titleInput, descriptionInput, +peopleInput];
        }
    }
    private clearInputs() {
        this.title.value = '';
        this.description.value = '';
        this.people.value = '';
    }
    @Autobind
    private handleEvent(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            prjState.addProjects(title, desc, people);
            this.clearInputs();
        }
    }
}
