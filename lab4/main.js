const titleInput = document.querySelector('.title');
const contentInput = document.querySelector('.content');
const colorInput = document.querySelector('.color');
const isPinnedInput = document.querySelector('.isPinned');
const tagsInput = document.querySelector('.tags');
const remindersInput = document.querySelector('.reminders');
const todoInput = document.querySelector('.todo');
const formButton = document.querySelector('.formButton');
const searchInput = document.querySelector('.search');

let currentFilter = '';

const notesContainer = document.querySelector('.notesContainer');
let formState = 'add';
let updatedNoteId;

//check reminders
const reminders = JSON.parse(localStorage.getItem('reminders')) || [];

const updatedReminders = [];
reminders.forEach((reminder) => {
  if (Date.now() > reminder.when) {
    alert(reminder.what);
  } else {
    updatedReminders.push(reminder);
  }
});

localStorage.setItem('reminders', JSON.stringify(updatedReminders));

const resetValues = () => {
  titleInput.value = '';
  contentInput.value = '';
  colorInput.value = '#ffffff';
  isPinnedInput.checked = false;
  tagsInput.value = '';
  remindersInput.value = null;
  todoInput.value = '';
};

const checkFilter = (note, currentFilter) => {
  const filteredTags = note.tags.filter((tag) => {
    return tag.includes(currentFilter);
  });

  return (
    note.title.includes(currentFilter) ||
    note.content.includes(currentFilter) ||
    filteredTags.length
  );
};

const addReminder = (reminder) => {
  if (remindersInput.value) {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const date = new Date(remindersInput.value).getTime();

    reminders.push({
      when: date,
      what: titleInput.value + ' note reminder',
    });

    localStorage.setItem('reminders', JSON.stringify(reminders));
  }
};

const handleForm = () => {
  if (formState === 'add') {
    const newNote = {
      id: Date.now(),
      title: titleInput.value,
      content: contentInput.value,
      color: colorInput.value,
      isPinned: isPinnedInput.checked,
      creationDate: Date.now(),
      tags: tagsInput.value.split(',') || [],
      toDo: todoInput.value.split(',') || [],
    };
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    remindersInput.value && addReminder(remindersInput.value);

    resetValues();

    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
  } else if (formState === 'update') {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find((note) => note.id === updatedNoteId);

    note.title = titleInput.value;
    note.content = contentInput.value;
    note.color = colorInput.value;
    note.isPinned = isPinnedInput.checked;
    note.tags = tagsInput.value.split(',') || [];
    note.toDo = todoInput.value.split(',') || [];

    remindersInput.value && addReminder(remindersInput.value);

    resetValues();

    formButton.innerHTML = 'Dodaj';
    formState = 'add';

    localStorage.setItem('notes', JSON.stringify(notes));
  }

  displayNotes();
};

const deleteNote = (id) => {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];

  const filteredNotes = notes.filter((note) => note.id !== id);

  localStorage.setItem('notes', JSON.stringify(filteredNotes));

  displayNotes();
};

const updateNote = (id) => {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const note = notes.find((note) => note.id === id);

  titleInput.value = note.title;
  contentInput.value = note.content;
  colorInput.value = note.color;
  isPinnedInput.checked = note.isPinned;
  tagsInput.value = (note.tags && note.tags.join(', ')) || '';
  todoInput.value = (note.toDo && note.toDo.join(', ')) || '';

  updatedNoteId = note.id;
  formButton.innerHTML = 'Aktualizuj';
  formState = 'update';
};

const displayNotes = () => {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  const wrapper = document.createElement('div');
  wrapper.classList.add('notesWrapper');

  notes = notes
    .sort((a, b) => a.creationDate - b.creationDate)
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  notes.map((note) => {
    if (!currentFilter.length || checkFilter(note, currentFilter)) {
      const container = document.createElement('div');
      container.classList.add('noteContainer');
      container.style.backgroundColor = note.color;

      const mainWrapper = document.createElement('div');
      mainWrapper.classList.add('noteMainWrapper');

      const title = document.createElement('h2');
      title.classList.add('noteTitle');
      title.innerHTML = note.title;
      mainWrapper.appendChild(title);

      const content = document.createElement('p');
      content.classList.add('noteContent');
      content.innerHTML = note.content;
      mainWrapper.appendChild(content);

      if (note.tags && note.tags.length) {
        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('noteTagsContainer');

        note.tags.forEach((tag) => {
          if (tag.length > 0) {
            const tagEl = document.createElement('span');
            tagEl.classList.add('noteTag');
            tagEl.innerHTML = '#' + tag.trimStart();
            tagsContainer.appendChild(tagEl);
          }
        });

        mainWrapper.appendChild(tagsContainer);
      }

      if (note.toDo && note.toDo) {
        const toDoContainer = document.createElement('div');
        toDoContainer.classList.add('noteToDoContainer');
        const header = document.createElement('h4');
        header.innerHTML = 'To do';
        toDoContainer.appendChild(header);

        const leftContainer = document.createElement('div');
        leftContainer.classList.add('noteToDoLeft');
        const rightContainer = document.createElement('div');
        rightContainer.classList.add('noteToDoRight');

        note.toDo.forEach((todo) => {
          if (todo.length > 0) {
            const todoCheck = document.createElement('input');
            todoCheck.classList.add('noteToDoCheck');
            todoCheck.type = 'checkbox';
            todoCheck.id = todo;
            todoCheck.value = false;

            todoCheck.addEventListener('click', function (e) {
              if (e.target.checked) {
                rightContainer.appendChild(todoCheck);
                rightContainer.appendChild(todoLabel);
              } else {
                leftContainer.appendChild(todoCheck);
                leftContainer.appendChild(todoLabel);
              }
            });

            const todoLabel = document.createElement('label');
            todoLabel.htmlFor = todo;
            todoLabel.classList.add('noteToDoLabel');
            todoLabel.innerHTML = todo.trimStart();

            leftContainer.appendChild(todoCheck);
            leftContainer.appendChild(todoLabel);
          }
        });

        toDoContainer.appendChild(leftContainer);
        toDoContainer.appendChild(rightContainer);
        mainWrapper.appendChild(toDoContainer);
      }

      if (note.isPinned) {
        const pinned = document.createElement('img');
        pinned.src =
          'https://www.iconpacks.net/icons/1/free-pin-icon-48-thumb.png';
        pinned.classList.add('notePinned');
        mainWrapper.appendChild(pinned);
      }

      const buttonsWrapper = document.createElement('div');
      buttonsWrapper.classList.add('noteButtonsWrapper');

      const updateButton = document.createElement('button');
      updateButton.classList.add('noteRemoveButton');
      updateButton.innerHTML = 'Aktualizuj';
      buttonsWrapper.appendChild(updateButton);
      updateButton.addEventListener('click', () => updateNote(note.id));

      const removeButton = document.createElement('button');
      removeButton.classList.add('noteRemoveButton');
      removeButton.innerHTML = 'Usuń';
      buttonsWrapper.appendChild(removeButton);
      removeButton.addEventListener('click', () => deleteNote(note.id));

      container.appendChild(mainWrapper);
      container.appendChild(buttonsWrapper);
      wrapper.appendChild(container);
    }
  });

  notesContainer.innerHTML = '';
  notesContainer.appendChild(wrapper);
};

searchInput.addEventListener('input', function (e) {
  currentFilter = e.target.value;
  displayNotes();
});

document.getElementById('noteForm').addEventListener('submit', function (e) {
  e.preventDefault();
  handleForm();
});

displayNotes();
