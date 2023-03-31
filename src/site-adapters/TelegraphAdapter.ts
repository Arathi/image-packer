import SiteAdapter from "./SiteAdapter";

// @ts-ignore
let $ = window.jQuery;

export default class TelegraphAdapter implements SiteAdapter {
    name = "Telegraph";

    getImageSources() : string[] {
        let srcs: string[] = [];
        let imgs = $("figure img");
        for (let index = 0; index < imgs.length; index++) {
            let img = imgs[index];
            let src = img.src;
            srcs.push(src);
        }
        return srcs;
    }
}