import Dexie, { Table } from 'dexie';

import { ITask, Task } from '../models/Task';
import { IFile, File } from '../models/File';

export default class TaskDatabase extends Dexie {
    tasks!: Table<Task, number>;
    files!: Table<File, number>;

    constructor(name: string = "image-packer") {
        super(name);
        this.version(1).stores({
            tasks: "++id, uri, referer, fileName, status, loaded, total",
            files: "++id, uri, blob"
        });
    }
}