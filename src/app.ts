// autobind decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get () {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
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
        this.title = document.querySelector('#title') as HTMLInputElement;
        this.description = document.querySelector('#description') as HTMLInputElement;
        this.people = document.querySelector('#people') as HTMLInputElement;
        this.attach();
        this.configure();
    }
    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
    private handleEvent(event: Event) {
        event.preventDefault();
        console.log(this.title.value);
        
    }
    @Autobind
    private configure() {
        this.element.addEventListener('submit', this.handleEvent)
    }
}

const prjTemplate = new ProjectTemplate();