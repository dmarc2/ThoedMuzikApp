class Tape {
    constructor(id,type,name, thumbnail, songs = []) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.thumbnail = thumbnail;
        this.songs = songs;
    }

    getId() {
        return this.id;
    }
    getType() {
        return this.type;
    }
    getName() {
        return this.name;
    }

    getSongsCount() {
        return this.songs.length;
    }
    getSongs() {
        return this.songs;
    }
    setSongs(songs) {
        this.songs = songs;
    }

    getThumbnail() {
        return this.thumbnail;
    }
}

export default Tape;