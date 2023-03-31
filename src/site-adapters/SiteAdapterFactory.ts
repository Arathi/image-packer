import DefaultAdapter from "./DefaultAdapter";
import SiteAdapter from "./SiteAdapter";
import TelegraphAdapter from "./TelegraphAdapter";

export default class SiteAdapterFactory {
    static createAdapter(site?: string) : SiteAdapter {
        if (site == null) {
            let href = window.location.href;
            let url = new URL(href);
            site = url.host;
        }
        
        switch (site) {
            case "telegra.ph":
                return new TelegraphAdapter();
        }

        return new DefaultAdapter();
    }
}