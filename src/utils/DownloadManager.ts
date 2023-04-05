// import {} from 'tampermonkey';
// import Dexie, { Table } from 'dexie';

// 
// export default class DownloadManager extends Dexie {
//     static readonly DatabaseName: string = "image-packer";
//     static readonly Version: number = 1;
// 
//     // db: Dexie;
//     tasks!: Table<Task>;
// 
//     constructor() {
//         super(DownloadManager.DatabaseName);
//         this.version(DownloadManager.Version).stores({
//             groups: '++id, name, referer',
//             tasks: '++id, groupId, uri, fileName, status, totalLength, completedLength',
//             files: '++id, uri, content, downloadTime'
//         });
//         // this.db = new Dexie("image-packer");
//         // this.db.version(DownloadManager.version)
//     }
// }

import Task from '../models/Task';
import { GM_xmlhttpRequest } from '$';
import localForage from 'localforage';

export default class DownloadManager {
    static readonly DatabaseName: string = "image-packer";
    static readonly Version: number = 1;

    tasks: LocalForage;
    files: LocalForage;

    constructor() {
        this.tasks = localForage.createInstance({
            name: DownloadManager.DatabaseName,
            storeName: "tasks"
        });
        this.files = localForage.createInstance({
            name: DownloadManager.DatabaseName,
            storeName: "files"
        });
    }

    startDownload(task: Task, timeout: number = 5000) {
        GM_xmlhttpRequest({
            method: "GET",
            url: task.uri,
            timeout: timeout,
            responseType: "blob",
            onload: (resp) => {
                if (resp.status == 200) {
                    console.info("加载成功");
                    this.saveFile(task.uri, resp.response);
                    this.updateTask(task.id, Task.STATUS_COMPLETED, null, null);
                }
            },
            onprogress: (event) => {
                if (event.lengthComputable) {
                    this.updateTask(task.id, Task.STATUS_ACTIVE, event.loaded, event.total);
                }
            }
        })
    }

    saveFile(uri: string, blob: Blob) : Promise<Blob> {
        return this.files.setItem(
            uri,
            blob
        );
    }

    getFile(uri: string) : Promise<Blob|null> {
        return this.files.getItem(uri);
    }

    async updateTask(id: string, status: number, loaded: number|null, total: number|null) : Promise<Task|null> {
        let task: Task | null = await this.tasks.getItem(id);
        if (task != null) {
            task.update(status, loaded, total);
            return this.tasks.setItem(id, task);
        }
        return new Promise(() => {
            return null;
        });
    }
}
