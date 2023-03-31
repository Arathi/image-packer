import { getFileName } from '../utils/FileUtil';

export default class Task {
    static readonly STATUS_WAITING = 0;
    static readonly STATUS_ACTIVE = 1;
    static readonly STATUS_PAUSED = 2;
    static readonly STATUS_STOP = 3;
    static readonly STATUS_ERROR = 4;
    static readonly STATUS_COMPLETED = 5;

    uri: string;
    fileName: string;
    status: number = Task.STATUS_WAITING;
    totalLength: number = 0;
    completedLength: number = 0;

    constructor(uri: string, fileName?: string) {
        this.uri = uri;
        if (fileName == null) {
            fileName = getFileName(uri);
        }
        this.fileName = fileName;
    }

    update(completedLength: number, totalLength?: number) {
        this.completedLength = completedLength;
        if (totalLength != null) {
            this.totalLength = totalLength;
        }
        this.updateStatusByLengths();
    }

    updateStatusByLengths() {
        if (this.totalLength <= 0) {
            this.status = Task.STATUS_WAITING;
        }
        if (this.completedLength == this.totalLength) {
            this.status = Task.STATUS_COMPLETED;
        }
    }
}