import SiteAdapter from "./SiteAdapter";

export default class DefaultAdapter extends SiteAdapter {
    name = "Default";

    getImageSources(): string[] {
        let srcs: string[] = [];
        let imgs = document.getElementsByTagName("img");
        for (let index = 0; index < imgs.length; index++) {
            let img = imgs[index];
            srcs.push(img.src);
        }
        return srcs;
    }
}