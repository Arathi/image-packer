export interface IFile {
    // 编号（自动）
    id?: number;

    // URI
    uri: string;

    // 数据
    blob: Blob;

    // 完成时间
    completedAt: Date;
}

export class File implements IFile {
    id?: number;
    uri: string;
    blob: Blob;
    completedAt: Date;

    constructor(uri: string, blob: Blob) {
        this.uri = uri;
        this.blob = blob;
        this.completedAt = new Date();
    }
}
