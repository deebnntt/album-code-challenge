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

  updateUserId(albumId, bodyData) {
    return fetch(`${this.baseURL}/albums/${albumId}`, {
      method: 'PUT',
      body: JSON.stringify({ bodyData }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(res => res.json())
      .then(function(data) {
        renderData(data);
      })
      .catch(function(error) {
        console.log('Fetch Error :-S', error);
      });
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
    row.setAttribute('draggable', 'true')
    row.setAttribute('aria-grabbed', 'false')
    row.setAttribute('tabindex', '0')
    row.setAttribute('data-draggable','item')

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

function renderData(data) {
  let alb = albums.find(album => album.id === data.id)
  alb.userId = data.bodyData.userId
  renderAlbums(albums, user1, table1)
  renderAlbums(albums, user2, table2)
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
      row.setAttribute('draggable', 'true')
      row.setAttribute('aria-grabbed', 'false')
      row.setAttribute('tabindex', '0')
      row.setAttribute('data-draggable','item')

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

function updateAlbumUserId(moved) {
  let userId
  let array = moved.itemDetails

  if (moved.droptarget.id === 'table-1') {
    userId = user1.id
  }

  if (moved.droptarget.id === 'table-2') {
    userId = user2.id
  }

  array.forEach(album => {
    albumId = album
    let body = {
      id: albumId,
      title: 'foo',
      body: 'bar',
      userId: userId
    }
    api = new Api()
    api.updateUserId(albumId, body)
  })
}

//Drag and Drop Functions

let targets = document.querySelectorAll('[data-draggable="target"]')
let dragged

(function() {

    for(var
        targets = document.querySelectorAll('[data-draggable="target"]'),
        len = targets.length,
        i = 0; i < len; i ++) {
        targets[i].setAttribute('aria-dropeffect', 'none');
    }

    for(var
        items = document.querySelectorAll('[data-draggable="item"]'),
        len = items.length,
        i = 0; i < len; i ++) {
        items[i].setAttribute('draggable', 'true');
        items[i].setAttribute('aria-grabbed', 'false');
        items[i].setAttribute('tabindex', '0');
    }

    var selections = {
        items      : [],
        itemDetails: [],
        owner      : null,
        droptarget : null
      }

    //function for selecting an item
    function addSelection(item) {
        if(!selections.owner) {
            selections.owner = item.parentNode;
        }  else if (selections.owner != item.parentNode) {
            return
        }

        item.setAttribute('aria-grabbed', 'true');
        selections.items.push(item);
        selections.itemDetails.push(item.id);
    }

    //function for unselecting an item
    function removeSelection(item) {
        item.setAttribute('aria-grabbed', 'false');

        for(var len = selections.items.length, i = 0; i < len; i ++) {
            if(selections.items[i] == item) {
                selections.items.splice(i, 1);
                selections.itemDetails.splice(i, 1)
                break;
            }
        }
    }

    //function for resetting all selections
    function clearSelections() {
        if(selections.items.length) {
            selections.owner = null;
            for(var len = selections.items.length, i = 0; i < len; i ++) {
                selections.items[i].setAttribute('aria-grabbed', 'false');
            }

            selections.items = [];
            selections.itemDetails = [];
        }
    }

    //shorctut function for testing whether a selection modifier is pressed
    function hasModifier(e) {
        return (e.ctrlKey || e.metaKey || e.shiftKey);
    }

    //function for applying dropeffect to the target containers
    function addDropeffects() {
        //apply aria-dropeffect and tabindex to all targets apart from the owner
        for(var len = targets.length, i = 0; i < len; i ++) {
            if (targets[i] != selections.owner && targets[i].getAttribute('aria-dropeffect') == 'none') {
                targets[i].setAttribute('aria-dropeffect', 'move');
                targets[i].setAttribute('tabindex', '0');
              }
          }

        for(var len = items.length, i = 0; i < len; i ++) {
            if (items[i].parentNode != selections.owner && items[i].getAttribute('aria-grabbed')){
                items[i].removeAttribute('aria-grabbed');
                items[i].removeAttribute('tabindex');
            }
          }
        }

    //function for removing dropeffect from the target containers
    function clearDropeffects()
    {
        if(selections.items.length) {
            for(var len = targets.length, i = 0; i < len; i ++) {
                if(targets[i].getAttribute('aria-dropeffect') != 'none') {
                    targets[i].setAttribute('aria-dropeffect', 'none');
                    targets[i].removeAttribute('tabindex');
                }
            }
            for(var len = items.length, i = 0; i < len; i ++) {
                if(!items[i].getAttribute('aria-grabbed')) {
                    items[i].setAttribute('aria-grabbed', 'false');
                    items[i].setAttribute('tabindex', '0');
                }
                else if(items[i].getAttribute('aria-grabbed') == 'true') {
                    items[i].setAttribute('tabindex', '0');
                }
            }
        }
    }

    //shortcut function for identifying an event element's target container
    function getContainer(element){
        do {
          if (element.nodeType == 1 && element.getAttribute('aria-dropeffect')) {
                return element;
            }
        } while(element = element.parentNode);
        return null;
      }

    //mousedown event to implement single selection
    document.addEventListener('mousedown', function(e) {
        if(e.target.getAttribute('draggable')) {
            clearDropeffects();
            if (!hasModifier(e) && e.target.getAttribute('aria-grabbed') == 'false' ) {
                clearSelections();
                addSelection(e.target);
            }
        } else if (!hasModifier(e)) {
            clearDropeffects();
            clearSelections();
        } else {
            clearDropeffects();
        }
    }, false);

    //mouseup event to implement multiple selection
    document.addEventListener('mouseup', function(e) {
        if(e.target.getAttribute('draggable') && hasModifier(e)) {
            if(e.target.getAttribute('aria-grabbed') == 'true') {
                removeSelection(e.target);
                if(!selections.items.length) {
                    selections.owner = null;
                }
            } else {
              addSelection(e.target);
            }
        }
    }, false);

    //dragstart event to initiate mouse dragging
    document.addEventListener('dragstart', function(e) {
        if (selections.owner != e.target.parentNode) {
            e.preventDefault();
            return;
        }
        if (hasModifier(e) && e.target.getAttribute('aria-grabbed') == 'false') {
            addSelection(e.target);
        }
        e.dataTransfer.setData('text', '');
        addDropeffects();
    }, false);

    //keydown event to implement selection and abort
    document.addEventListener('keydown', function(e) {
        if(e.target.getAttribute('aria-grabbed')) {
            if(e.keyCode == 32) {
                if(hasModifier(e)) {
                    if(e.target.getAttribute('aria-grabbed') == 'true') {
                        if(selections.items.length == 1) {
                            clearDropeffects();
                        }
                        removeSelection(e.target);

                        if(selections.items.length) {
                            addDropeffects();
                        }
                        if(!selections.items.length) {
                            selections.owner = null;
                        }
                    } else {
                        addSelection(e.target);
                        addDropeffects();
                    }
                } else if(e.target.getAttribute('aria-grabbed') == 'false') {
                    clearDropeffects();
                    clearSelections();
                    addSelection(e.target);
                    addDropeffects();
                } else {
                    addDropeffects();
                }
                e.preventDefault();
            }
        }
    }, false);

    //related variable is needed to maintain a reference to the
    //dragleave's relatedTarget, since it doesn't have e.relatedTarget
    var related = null;

    //dragenter event to set that variable
    document.addEventListener('dragenter', function(e) {
        related = e.target;
    }, false);

    // dragleave event to maintain target highlighting using that variable
    document.addEventListener('dragleave', function(e) {
        var droptarget = getContainer (related);
        if (droptarget == selections.owner) {
            droptarget = null;
        }
        if (droptarget != selections.droptarget) {
            if (selections.droptarget) {
                selections.droptarget.className =
                    selections.droptarget.className.replace(/ dragover/g, '');
            } if (droptarget) {
                droptarget.className += ' dragover';
            }
            selections.droptarget = droptarget;
        }
    }, false);

    //dragover event to allow the drag by preventing its default
    document.addEventListener('dragover', function(e) {
        if(selections.items.length) {
            e.preventDefault();
        }
    }, false);


    //dragend event to implement items being validly dropped into targets,
    //or invalidly dropped elsewhere, and to clean-up the interface either way
    document.addEventListener('dragend', function(e) {
        console.log("dragend", selections)
        let moved = {...selections}
        updateAlbumUserId(moved)
        if (selections.droptarget) {
            for (var len = selections.items.length, i = 0; i < len; i ++) {
                selections.droptarget.appendChild(selections.items[i]);
            }
            e.preventDefault();
        } if (selections.items.length) {
            clearDropeffects();
            if (selections.droptarget) {
                clearSelections();
                selections.droptarget.className = selections.droptarget.className.replace(/ dragover/g, '');
                selections.droptarget = null;
            }
        }
    }, false);


})();
