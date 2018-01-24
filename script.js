let users = []
let albums = []
let api
let user1
let user2
let table1 = document.getElementById('table-1')
let table2 = document.getElementById('table-2')

//Class Functions

class Api {
  constructor() {
  this.baseURL = 'https://jsonplaceholder.typicode.com';
}

  getAlbums() {
    return fetch(`${this.baseURL}/albums`)
    .then(res => res.json())
  }

  getUsers() {
    return fetch(`${this.baseURL}/users`)
    .then(res => res.json())
  }

}

class User {
  constructor(attr) {
    this.id = attr.id
    this.name = attr.name
    this.username = attr.username

    users.push(this)
  }

  renderUser(user) {
    const userCell1 = document.getElementById('user-cell-1')
    const userCell2 = document.getElementById('user-cell-2')

    if (user.id === 1) {
      userCell1.innerText = `${user.name}'s Albums`
      user1 = user
    }

    if (user.id === 2){
      userCell2.innerText = `${user.name}'s Albums`
      user2 = user
    }
  }

  static findUserByName(name) {
    return users.find(user => user.name === name)
  }

  static findUserById(id) {
    return users.find(user => user.id === id)
  }
}

class Album {
  constructor(attr) {
    this.title = attr.title
    this.id = attr.id
    this.userId = attr.userId

    albums.push(this)
  }

  renderAlbum(album) {
    let row = document.createElement('div')
    row.className = 'table__row'
    row.id = album.id
    row.setAttribute('draggable', 'true');
    row.setAttribute('aria-grabbed', 'false');
    row.setAttribute('tabindex', '0');

    let idCell = document.createElement('div')
    let titleCell = document.createElement('div')

    idCell.innerText = album.id
    idCell.className = 'table__cell--short'

    titleCell.innerText = album.title
    titleCell.className = 'table__cell'

    row.appendChild(idCell)
    row.appendChild(titleCell)

    if (album.userId === user1.id) {
        table1.appendChild(row)
      } else if (album.userId === user2.id) {
        table2.appendChild(row)
      } else {
        null
      }
  }

}


//Event Listeners, Functions

document.addEventListener('DOMContentLoaded', fetchUsers())

document.getElementById('filter-input-1').addEventListener('input', filterTitles)
document.getElementById('filter-input-2').addEventListener('input', filterTitles)


function fetchUsers() {
  api = new Api()
  api.getUsers()
    .then(addUsers)
    .then(renderDropDown)
    .then(fetchAlbums)
}

function fetchAlbums() {
  api = new Api()
  api.getAlbums()
    .then(addAlbums)
}

function addAlbums(response) {
  response.forEach((albumData) => {
    const album = new Album(albumData)
    album.renderAlbum(album)
  })
}

function addUsers(response) {
  response.forEach((userData) => {
    const user = new User(userData)
    user.renderUser(user)
  })
}

function renderDropDown() {
  users.forEach(user => {
    let userOption = document.createElement('option');
    userOption.innerText = user.name
    document.getElementById('user-list-1').add(userOption)
  })

  users.forEach(user =>{
    let userOption = document.createElement('option');
    userOption.innerText = user.name
    document.getElementById('user-list-2').add(userOption)
  })

  document
    .getElementById('user-list-1')
    .addEventListener('change', (ev, id) => reRenderName(ev, 'user-list-1'));

  document
    .getElementById('user-list-2')
    .addEventListener('change', (ev, id) => reRenderName(ev, 'user-list-2'));
}

function reRenderName(ev, id) {
  const name = event.target.value

  const userCell1 = document.getElementById('user-cell-1')
  const userCell2 = document.getElementById('user-cell-2')

  if (id === 'user-list-1') {
    userCell1.innerText = `${name}'s Albums`
    user1 = User.findUserByName(name)
  }

  if (id === 'user-list-2'){
    userCell2.innerText = `${name}'s Albums`
    user2 = User.findUserByName(name)
  }

  filterAlbums(id)
}

function filterAlbums(id) {
  let table
  let user

  if (id === 'user-list-1') {
    table = table1
    user = user1
  } else if (id === 'user-list-2') {
    table = table2
    user = user2
  }

  renderAlbums(albums, user, table)
}

function renderAlbums(array, user, table) {
  table.innerHTML = ""

  array.map(function(album) {
    if (album.userId === user.id) {
      let row = document.createElement('div')
      row.className = 'table__row'
      row.setAttribute('draggable', 'true');
      row.setAttribute('aria-grabbed', 'false');
      row.setAttribute('tabindex', '0');

      let idCell = document.createElement('div')
      let titleCell = document.createElement('div')

      idCell.innerText = album.id
      idCell.className = 'table__cell--short'

      titleCell.innerText = album.title
      titleCell.className = 'table__cell'

      row.appendChild(idCell)
      row.appendChild(titleCell)
      table.appendChild(row)
    }
  })
}

function filterTitles(ev) {
  let term = ev.target.value.toLowerCase();

  if (ev.target.id === 'filter-input-1') {
    table = table1
    user = user1
  } else if (ev.target.id === 'filter-input-2') {
    table = table2
    user = user2
  }
  //
  let filtered = albums.filter(a => a.title.includes(term.toLowerCase()))

  renderAlbums(filtered, user, table)
}

//Drag and Drop Functions

var dragged;

/* events fired on the draggable target */
document.addEventListener("drag", function(ev) {
  }, false);

document.addEventListener("dragstart", function(ev) {
    // store a ref. on the dragged elem
    dragged = ev.target;
    ev.dataTransfer.setData('text', '');
    // make it half transparent
    dragged.style.opacity = .5;

    if (dragged.parentNode.id === 'table-1') {
      table2.style.opacity = .7
      table2.style.border = "3px dashed #333"
    }

    if (dragged.parentNode.id === 'table-2') {
      table1.style.opacity = .7
      table1.style.border = "3px dashed #333"
    }

}, false);

document.addEventListener("dragend", function( event ) {
    // reset the transparency
    event.target.style.opacity = "";
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function( event ) {
    // prevent default to allow drop
    event.preventDefault();
}, false);

document.addEventListener("dragenter", function( event ) {
    // highlight potential drop target when the draggable element enters it
    if ( event.target.className == "table" ) {
        event.target.style.background = "pink";
    }

}, false);

document.addEventListener("dragleave", function( event ) {
    // reset background of potential drop target when the draggable element leaves it
    if ( event.target.className == "table" ) {
        event.target.style.background = "";
    }

}, false);

document.addEventListener("drop", function( event ) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged elem to the selected drop target
    console.log("you left me")
    if ( event.target.className == "table" ) {
        event.target.style.background = "";
        dragged.parentNode.removeChild( dragged );
        event.target.appendChild( dragged );
    }

    table1.style.opacity = 1
    table2.style.opacity = 1
    table1.style.border = "1px solid #333"
    table2.style.border = "1px solid #333"

}, false);
