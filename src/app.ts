enum ProjectStatus { Active, Fininshed };
class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) { }
}
type Listener = (item: Project[]) => void;
class ProjectState {
    private static instance: ProjectState;
    private projects: Project[] = [];
    private listners: Listener[] = [];

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProjects(title: string, description: string, people: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            people,
            ProjectStatus.Active
        );
        this.projects.push(newProject);
        for (const listenerFn of this.listners) {
            listenerFn(this.projects.slice());  // send copy of projects to listnerFn
        }
    }

    addListner(listenerFn: Listener) {
        this.listners.push(listenerFn);
    }
}
const prjState = ProjectState.getInstance();
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
        isValid = isValid && input.value.length <= input.maxLength;
    }
    if (input.minLength != null && typeof input.value === 'string') {
        isValid = isValid && input.value.length >= input.minLength;
    }
    if (input.min != null && typeof input.value === 'number') {
        isValid = isValid && input.value >= input.min;
    }
    if (input.max != null && typeof input.value === 'number') {
        isValid = isValid && input.value <= input.max;
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
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(templateId: string, hostId: string, insertAtStart: boolean, elementId?: string) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostId)! as T;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as U;
        if (elementId) {
            this.element.id = elementId;
        }
        this.attach(insertAtStart)
    }
    private attach(insertAtBeginning: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend',
            this.element);
    }
    abstract configure(): void;
    abstract renderContent(): void;
}
class ProjectTemplate extends Component<HTMLTemplateElement, HTMLDivElement> {
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
    renderContent() {}
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
class ProjectList extends Component<HTMLTemplateElement, HTMLDivElement> {
    assignedProjects: Project[];
    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        this.assignedProjects = [];
        this.configure();        
        this.renderContent();
    }
    configure() {
        prjState.addListner((project: Project[]) => {
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
            const list = document.createElement('li');
            list.textContent = prj.title;
            listEl.appendChild(list);
        }
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
}

const prjTemplate = new ProjectTemplate();
const prjListActive = new ProjectList('active');
const prjListFinished = new ProjectList('finished');