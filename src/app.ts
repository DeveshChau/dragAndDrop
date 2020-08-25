interface Validable {
    value: string | number;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    min?: number;
    max?: number;
}
// validation function
function validate(input: Validable) {
    let isValid = true;
    if (input.required) {
        isValid = isValid && input.value.toString().trim().length !== 0;
    }
    if (input.maxLength != null && typeof input.value === 'string') {
        isValid = isValid && input.value.length < input.maxLength;
    }
    if (input.minLength != null && typeof input.value === 'string') {
        isValid = isValid && input.value.length > input.minLength;
    }
    if (input.min != null && typeof input.value === 'number') {
        isValid = isValid && input.value > input.min;
    }
    if (input.max != null && typeof input.value === 'number') {
        isValid = isValid && input.value < input.max;
    }
    return isValid;
}
// autobind decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
class ProjectTemplate {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    title: HTMLInputElement;
    description: HTMLInputElement;
    people: HTMLInputElement;
    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as HTMLFormElement;
        this.element.id = 'user-input';
        this.title = this.element.querySelector('#title') as HTMLInputElement;
        this.description = this.element.querySelector('#description') as HTMLInputElement;
        this.people = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();
        this.attach();
    }
    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
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
            console.log(title, desc, people);
            this.clearInputs();
        }
    }
    private configure() {
        this.element.addEventListener('submit', this.handleEvent)
    }
}
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;
        this.attach();
        this.renderContent();
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}

const prjTemplate = new ProjectTemplate();
const prjListActive = new ProjectList('active');
const prjListFinished = new ProjectList('finished');