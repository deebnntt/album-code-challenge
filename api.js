class Api {
	constructor() {
		this.baseURL = 'https://jsonplaceholder.typicode.com';
	}

	getAlbums() {
		return fetch(`${this.baseURL}/albums`)
			.then(res => res.json())
	}

}
