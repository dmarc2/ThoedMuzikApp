import Tape from "./Tape.js";
import Song from "./Song.js";
import Account from "./Account.js";
import {apiClient, getVideoData, handleAPIError} from './global.js';

class SessionManager {
    constructor() {
        this.sessionId = null;
        this.account = null;
    }

    getAccount() {
        if (this.account === null) {
            if(sessionStorage.getItem("account") != null) {
                let retrievedAccount = JSON.parse(sessionStorage.getItem("account"));
                if (!Array.isArray(retrievedAccount)) {
                    retrievedAccount = [retrievedAccount];
                }
                this.account = retrievedAccount.map(account => new Account(account.type, account.username, account.forArtist));
            }
            else {
                return new Account("visitor", "Guest");
            }
        }

        return this.account[0];
    }

    async getTapes(ignoreSessionStorage=false) {
        let tapes = [];
        if(sessionStorage.getItem("tapes") != null && !ignoreSessionStorage) {
            let retrievedTapes = JSON.parse(sessionStorage.getItem("tapes"));

            retrievedTapes.forEach(tape => {
                let songs = [];
                tape.songs.forEach(song => {
                    songs.push(Song.fromStorage(song.id, song.name, song.youtube_video_id, song.thumbnail, song.publishDate, song.contributers, song.links, song.viewCount));
                });
                tapes.push(new Tape(tape.id, tape.type, tape.name, tape.thumbnail, songs));
            });
        }
        else {
            tapes = await this.fetchTapes();

            sessionStorage.setItem("tapes", JSON.stringify(tapes));
        }
        return tapes;
    }

    async getMuzik(ignoreSessionStorage=false) {
        let muzik = [];
        if(sessionStorage.getItem("muzik") != null && !ignoreSessionStorage) {
            let retrievedSongs = JSON.parse(sessionStorage.getItem("muzik"));

            muzik = retrievedSongs.map(song => Song.fromStorage(song.id, song.name, song.youtube_video_id, song.thumbnail, song.publishDate, song.contributers, song.links, song.viewCount));
        }
        else {
            muzik = await this.fetchMuzik();
            await getVideoData(muzik);

            sessionStorage.setItem("muzik", JSON.stringify(muzik));
        }
        return muzik;
    }

    async fetchTapes() {
        let tapesList = [];

        try {
            const r = await apiClient.get("/api/albums");
            let albums = r.data;
            for(const tape of albums) {
                tapesList.push(new Tape(tape.albumId, "album", tape.name, tape.thumbnail, await this.fetchTapeSongs("album", tape.albumId)));
            }
        } catch (error) {
            handleAPIError(error);
            return; // Exit if there's an error
        }

        try {
            const r = await apiClient.get("/api/mixtapes");
            let mixtapes = r.data;
            for(const tape of mixtapes) {
                tapesList.push(new Tape(tape.mixtapeId, "mixtape", tape.name, tape.thumbnail, await this.fetchTapeSongs("mixtape", tape.mixtapeId)));
            }
        } catch (error) {
            handleAPIError(error);
            return; // Exit if there's an error
        }

        try {
            const r = await apiClient.get("/api/extendedplays");
            let eps = r.data;
            for(const tape of eps) {
                tapesList.push(new Tape(tape.epId, "extendedplay", tape.name, tape.thumbnail, await this.fetchTapeSongs("extendedplay", tape.epId)));
            }
        } catch (error) {
            handleAPIError(error);
            return; // Exit if there's an error
        }

        return tapesList;
    }

    async fetchTapeSongs(type, id) {
        let songList = [];
        try {
            const r = await apiClient.get(`/api/tape/${type}/${id}/songs`);
            let songs = r.data;
            songs.forEach(song => {
                songList.push(new Song(song.songId, song.name, song.youtube_video_id, song.thumbnail));
            });
        } catch (error) {
            handleAPIError(error);
            return; // Exit if there's an error
        }

        for (const song of songList) {
            try {
                const contributersResponse = await apiClient.get(`/api/song/${song.id}/contributers`);
                let contributers = contributersResponse.data.map(c => c.contributer);
                song.setContributers(contributers);
            } catch (error) {
                handleAPIError(error);
                continue; // Skip to the next song if there's an error
            }

            try {
                const linksResponse = await apiClient.get(`/api/song/${song.id}/links`);
                let links = linksResponse.data.map(l => l.link);
                song.setLinks(links);
            } catch (error) {
                handleAPIError(error);
                continue; // Skip to the next song if there's an error
            }
        }

        await getVideoData(songList);

        return songList;
    }

    async fetchMuzik() {
        let songsObjList = [];

        try {
            const r = await apiClient.get("/api/songs");
            let songs = r.data;
            songs.forEach(song => {
                songsObjList.push(new Song(song.songId, song.name, song.youtube_video_id, song.thumbnail));
            });
        } catch (error) {
            handleAPIError(error);
            return; // Exit if there's an error
        }

        for (const song of songsObjList) {
            try {
                const contributersResponse = await apiClient.get(`/api/song/${song.id}/contributers`);
                let contributers = contributersResponse.data.map(c => c.contributer);
                song.setContributers(contributers);
            } catch (error) {
                handleAPIError(error);
                continue; // Skip to the next song if there's an error
            }

            try {
                const linksResponse = await apiClient.get(`/api/song/${song.id}/links`);
                let links = linksResponse.data.map(l => l.link);
                song.setLinks(links);
            } catch (error) {
                handleAPIError(error);
                continue; // Skip to the next song if there's an error
            }
        }

        return songsObjList;
    }
}

export default SessionManager;