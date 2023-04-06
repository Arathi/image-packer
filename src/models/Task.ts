import { getFileName } from '../utils/FileUtil';

export interface ITask {
    id?: number;
    uri: string;
    referer: string;
    fileName: string;
    status: number;
    loaded: number;
    total: number;
}

export class Task implements ITask {
    static readonly STATUS_WAITING = 0;
    static readonly STATUS_ACTIVE = 1;
    static readonly STATUS_PAUSED = 2;
    static readonly STATUS_STOP = 3;
    static readonly STATUS_ERROR = 4;
    static readonly STATUS_COMPLETED = 5;

    id?: number;
    uri: string;
    referer: string;
    fileName: string;
    status: number = Task.STATUS_WAITING;
    loaded: number = 0;
    total: number = 0;

    constructor(uri: string, referer: string, fileName?: string) {
        this.uri = uri;
        this.referer = referer;
        if (fileName == null) {
            fileName = getFileName(uri);
        }
        this.fileName = fileName;
    }

    update(status: number, loaded: number|null = null, total: number|null = null) {
        this.status = status;
        if (loaded != null) {
            this.loaded = loaded;
        }
        if (total != null) {
            this.total = total;
        }
    }
}