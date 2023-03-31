export default abstract class SiteAdapter {
    declare name: string;
    abstract getImageSources(): string[];
}