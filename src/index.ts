import { Status, Todo } from './interfaces/Todo.js';

let form = document.querySelector("#addForm") as HTMLFormElement;
let todoName = document.querySelector("#name") as HTMLInputElement;
let todourgency = document.querySelector("#urgency") as HTMLSelectElement;
let description = document.querySelector("#description") as HTMLTextAreaElement;

let handler = (e: Event) => {
  e.preventDefault();
  let nameValue = todoName.value;
  let urgencyValue = todourgency.value as Todo["urgency"];
  let descriptionValue = description.value;

  console.log("Name: "+nameValue);
  console.log("urgency: "+urgencyValue);
  console.log("descriptoin: "+descriptionValue)

  const holder = document.querySelector("#todoholder") as HTMLDivElement;

  let toDoI : Todo = {
    name: nameValue,
    urgency: urgencyValue,
    status: Status.NOT_STARTED,
    description: descriptionValue
  }
  
  const toDoItem = createTaskElement(toDoI);

  holder.append(toDoItem);

};


function createTaskElement(todo: Todo): HTMLElement {
  const todoDiv = document.createElement('div');
  todoDiv.className = 'relative bg-white rounded-lg shadow-md p-4 flex items-center justify-between';

  const removeButton = createRemoveButton();
  todoDiv.appendChild(removeButton);

  const detailsDiv = document.createElement('div');

  const titleHeading = document.createElement('h2');
  titleHeading.className = 'font-semibold text-lg text-gray-800';
  titleHeading.textContent = todo.name;
  detailsDiv.appendChild(titleHeading);

  const urgencyParagraph = createUrgencyParagraph(todo.urgency);
  detailsDiv.appendChild(urgencyParagraph);

  const descriptionParagraph = document.createElement('p');
  descriptionParagraph.className = 'text-xs text-gray-500';
  descriptionParagraph.textContent = todo.description;
  detailsDiv.appendChild(descriptionParagraph);

  todoDiv.appendChild(detailsDiv);

  const statusDiv = getStatusDiv(todo);

  todoDiv.appendChild(statusDiv);

  return todoDiv;
}

const getStatusDiv = (todo : Todo) : HTMLDivElement => {
  const statusDiv = document.createElement('div');
  statusDiv.className = "p-1 flex gap-2 items-center";

  const leftButton = document.createElement("span");
  leftButton.className="font-bold text-lg cursor-pointer hover:bg-gray-300 hover:rounded-full transition-all duration-100 px-2 pt-0 pb-1";
  leftButton.textContent = "<";
  leftButton.addEventListener("click", (ev) => handleChangeStatus(ev, "left"));
  statusDiv.appendChild(leftButton);

  const statusSpan = document.createElement('span');
  statusSpan.className = `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(todo.status)}`;
  statusSpan.textContent = getStatusName(todo.status);
  statusDiv.appendChild(statusSpan);

  const rightButton = document.createElement("span");
  rightButton.className= "font-bold text-lg cursor-pointer hover:bg-gray-300 hover:rounded-full transition-all duration-100 px-2 pt-0 pb-1";
  rightButton.textContent = ">";
  rightButton.addEventListener("click", (ev) => handleChangeStatus(ev, "right"));
  statusDiv.appendChild(rightButton);

  return statusDiv;
}

const handleChangeStatus = (ev : Event, buttonType : ("left" | "right")) => { 
  const currentButton = ev.target as HTMLElement;
  const parentDiv = currentButton.parentElement as HTMLElement;
  let statusElement : HTMLElement;
  statusElement = parentDiv.querySelector("span:nth-child(2)") as HTMLElement; //gets the 2nd span element
  let currentStatus = getStatusEnum(statusElement.textContent as ("Not Started" | "In Progress" | "Finished"))
  let classColors = getStatusBadgeColor(currentStatus).split(" ");

  statusElement.classList.remove(classColors[0])
  statusElement.classList.remove(classColors[1])
  if(buttonType === "left") currentStatus = (currentStatus - 1 + 3) % 3;
  else currentStatus = (currentStatus + 1) % 3;
  statusElement.classList.add(...getStatusBadgeColor(currentStatus).split(" "));
  statusElement.textContent = getStatusName(currentStatus);


  
};

const deleteToDoItem = (ev : Event) => {
  let button = ev.target as HTMLElement;
  let parent = button.parentElement as HTMLElement;
  parent.remove();
}

function createRemoveButton() : HTMLDivElement {
  const buttonX = document.createElement('div');
  buttonX.textContent = "X";
  buttonX.className = "absolute top-1 right-1 bg-red-400 rounded-full px-2 hover:scale-110 duration-100 transition-all cursor-pointer";
  buttonX.addEventListener("click", deleteToDoItem);
  return buttonX;
}

function createUrgencyParagraph(urgency : Todo["urgency"]) : HTMLParagraphElement {
  const urgencyParagraph = document.createElement('p');
  urgencyParagraph.className = 'text-sm font-bold my-1 text-gray-500';

  const urgencyPill = document.createElement("span");
  urgencyPill.className = "bg-gray-300 text-gray-800 font-semibold p-1 rounded-lg";
  urgencyPill.textContent = "Urgency";
  urgencyParagraph.append(urgencyPill, ` : `);

  const urgencyValuePill = document.createElement("span");
  urgencyValuePill.className = getUrgencyValueClass(urgency);
  urgencyValuePill.textContent = urgency;

  urgencyParagraph.append(urgencyValuePill);
  
  return urgencyParagraph;
}

function getUrgencyValueClass(urgency: Todo["urgency"]) : string {
  return (urgency === 'normal') ? 
    'bg-green-300 text-green-950 capitalize p-1 font-semibold rounded-md' : 
    'bg-red-300 text-red-950 p-1 capitalize font-semibold rounded-md' ;
}

function getStatusName(status: Status) : string {
  switch(status) {
    case Status.NOT_STARTED:
      return "Not Started";
    case Status.IN_PROGRESS:
      return "In Progress";
    default :
      return "Finished";
  }
}

function getStatusEnum(statusName : ("Not Started" | "In Progress" | "Finished")) : Status{
  switch(statusName) {
    case "Not Started":
      return Status.NOT_STARTED
    case "In Progress": 
      return Status.IN_PROGRESS;
    default:
      return Status.FINISHED;
  }
}

function getStatusBadgeColor(status: Status): string {
  switch (status) {
    case Status.FINISHED:
      return 'bg-green-100 text-green-800';
    case Status.NOT_STARTED:
      return 'bg-red-100 text-red-800';
    case Status.IN_PROGRESS:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}


form.addEventListener("submit", handler);

const allCloseButtons = document.getElementsByClassName("closeButton");
Array.from(allCloseButtons).forEach((buttonElement) => {
  buttonElement.addEventListener("click", deleteToDoItem);
});

const allLeftButtons = document.getElementsByClassName("leftButton");
Array.from(allLeftButtons).forEach((leftButt) => {
  leftButt.addEventListener("click", (ev) => handleChangeStatus(ev, "left"));
});

const allRightButtons = document.getElementsByClassName("rightButton");
Array.from(allRightButtons).forEach((rightButt) => {
  rightButt.addEventListener("click", (ev) => handleChangeStatus(ev, "right"));
})
