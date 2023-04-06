export interface IFile {
    id?: number;
    uri: string;
    blob: Blob;
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
