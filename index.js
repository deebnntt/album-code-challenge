let api

document.addEventListener('DOMContentLoaded', fetchAlbums())

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
