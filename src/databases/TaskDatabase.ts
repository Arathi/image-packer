import Dexie, { Table } from 'dexie';

import { Task } from '../models/Task';
import { File } from '../models/File';

export default class TaskDatabase extends Dexie {
    tasks!: Table<Task, number>;
    files!: Table<File, number>;

    constructor(name: string = "image-packer") {
        super(name);
        this.version(2).stores({
            tasks: "++id, uri, referer, fileName, status, loaded, total",
            files: "++id, uri, blob, completedAt"
        });
    }
}