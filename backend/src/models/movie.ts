export class Movie {
    id: string;
    title: string;
    releaseDate: string;
    posterPath: string;

    constructor(id: string, title: string, releaseDate: string, posterPath: string) {
        this.id = id;
        this.title = title;
        this.releaseDate = releaseDate;
        this.posterPath = posterPath
    }
}