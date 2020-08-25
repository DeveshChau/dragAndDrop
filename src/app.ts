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
        if (titleInput.trim().length === 0 || descriptionInput.trim().length === 0 || peopleInput.trim().length === 0) {
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

const prjTemplate = new ProjectTemplate();