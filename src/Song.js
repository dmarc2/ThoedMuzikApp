import $ from 'jquery';

// Component to display the list of links
const LinksComponent = ({ links }) => {
    return (
    <div>
        <h2>Links:</h2>
        <ul>
        {links.map((link, index) => (
            <li key={index}>
            <a href={link} target="_blank" rel="noopener noreferrer">
                Link {index + 1}
            </a>
            </li>
        ))}
        </ul>
    </div>
    );
};


class Song {

    constructor(id, name, YTvID, thumbnail) {
        this.id = id;
        this.name = name;
        this.youtube_video_id = YTvID;
        this.publishDate = "";
        this.contributers = [];
        this.links = [];
        this.viewCount = 0;
        this.thumbnail = (thumbnail!="")? thumbnail:null; 

    }

    static fromStorage(id, name, YTvID, thumbnail, publishDate, contributers, links, viewCount) {
        let song = new Song(id,name,YTvID,thumbnail);
        song.setPublishDate(publishDate);
        song.setContributers(contributers);
        song.setLinks(links);
        song.setViewCount(viewCount);
        return song;
    }

    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getYoutubeVideoID() {
        return this.youtube_video_id;
    }

    getPublishDate() {
        return this.publishDate;
    }
    setPublishDate(date) {
        this.publishDate = date;
    }

    getThumbnail() {
        return this.thumbnail;
    }
    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;
    }

    getViewCount() {
        return Number(this.viewCount);
    }
    setViewCount(viewCount) {
        this.viewCount = Number(viewCount);
    }

    getContributersCount() {
        return this.contributers.length;
    }
    getContributers() {
        return this.contributers;
    }
    setContributers(contributers) {
        this.contributers = contributers;
    }

    getLinksCount() {
        return this.links.length;
    }
    getLinks() {
        return this.links;
    }
    setLinks(links) {
        this.links = links;
    }

    getLinksComponent() {
        return <LinksComponent links={this.links} />;
    }
}

export default Song;