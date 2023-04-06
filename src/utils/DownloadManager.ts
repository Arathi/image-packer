import { Task } from '../models/Task';
import { File } from '../models/File';
import Logger from '../utils/Logger';
import TaskDatabase from '../databases/TaskDatabase';
import { GM_xmlhttpRequest } from '$';

let logger = Logger.getLogger("DownloadManager");

export default class DownloadManager {
    static readonly DatabaseName: string = "image-packer";
    static readonly Version: number = 1;

    db: TaskDatabase;

    constructor(db: TaskDatabase) {
        this.db = db;
    }

    startDownload(task: Task, timeout: number = 5000) {
        if (task.id == null) {
            logger.warn("任务ID不存在，任务无法开始。");
            return;
        }
        
        GM_xmlhttpRequest({
            method: "GET",
            url: task.uri,
            timeout: timeout,
            responseType: "blob",
            onload: (resp) => {
                if (resp.status == 200) {
                    logger.info(`${task.uri} 下载完成`);
                    this.saveFile(task.uri, resp.response);
                    this.updateTask(task.id!, Task.STATUS_COMPLETED, null, null);
                }
            },
            onreadystatechange: (event) => {
                if (event.readyState == XMLHttpRequest.OPENED) {
                    logger.info(`${task.uri} 开始下载`);
                }
                else if (event.readyState == XMLHttpRequest.HEADERS_RECEIVED) {
                    logger.info(`${task.uri} Headers已接收`);
                }
                else if (event.readyState == XMLHttpRequest.LOADING) {
                    logger.info(`${task.uri} 正在下载`);
                    this.updateTask(task.id!, Task.STATUS_ACTIVE, null, null);
                }
                else if (event.readyState == XMLHttpRequest.DONE) {
                    logger.info(`${task.uri} 下载完成`);
                    this.updateTask(task.id!, Task.STATUS_COMPLETED, null, null);
                }
            },
            onprogress: (event) => {
                if (event.lengthComputable) {
                    this.updateTask(task.id!, null, event.loaded, event.total);
                }
            }
        });
    }

    saveFile(uri: string, blob: Blob) : Promise<number> {
        let file = new File(
            uri,
            blob
        );
        return this.db.files.add(file);
    }

    getFile(uri: string) : Promise<Blob|null> {
        return new Promise<Blob|null>(() => {
            this.db.files.where("uri").equals(uri).first().then((file) => {
                if (file != null) {
                    return  file.blob;
                }
                return null;
            });
        });
    }

    updateTask(id: number, status: number|null, loaded: number|null, total: number|null) : Promise<number> {
        let changes: any = {};
        if (status != null) {
            changes.status = status;
        }
        if (loaded != null) {
            changes.loaded = loaded;
        }
        if (total != null) {
            changes.total = total;
        }
        return this.db.tasks.update(id, changes);
    }
}
