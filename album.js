const albums = []

class Album {
  constructor(attr) {
    this.title = attr.title
    this.id = attr.id
    this.userId = attr.userId

    albums.push(this)
  }

  static all(){
    return albums
  }

  renderAlbum(album) {
    const table1 = document.getElementById('table-1')
    const table2 = document.getElementById('table-2')

    let row = document.createElement('div')
    row.className = 'table__row'

    let idCell = document.createElement('div')
    let titleCell = document.createElement('div')

    idCell.innerText = album.id
    idCell.className = 'table__cell--short'

    titleCell.innerText = album.title
    titleCell.className = 'table__cell'

    row.appendChild(idCell)
    row.appendChild(titleCell)

    if (album.userId === 1) {
      table1.appendChild(row)
    } else if (album.userId === 2){
      table2.appendChild(row)
    } else {
      null
    }
  }

  static findByUser(id) {
    return this.all.find(album => album.userId === id)
  }
}
