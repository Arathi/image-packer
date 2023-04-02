import Task from "../models/Task";

export default class TaskRepository {
    database?: IDBDatabase;

    constructor() {
        let request: IDBOpenDBRequest = window.indexedDB.open("image-packer", 1);
        request.onsuccess = (event) => {
            console.info("数据库打开成功");
            let db = request.result;
            this.setDatabase(db);
        };
        request.onerror = (event) => {
            console.error("数据库打开错误");
        }
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            console.info(`image-packer数据库版本更新：${event.oldVersion} -> ${event.newVersion}`);
            // @ts-ignore
            let db = event.target.result;
            this.setDatabase(db);
        }
    }

    setDatabase(db: IDBDatabase) {
        this.database = db;
    }

    addTask(task: Task) {

    }

    saveFile(uri: string, blob: any) {
        // this.database!.transaction("", IDBTransaction.)
    }
}