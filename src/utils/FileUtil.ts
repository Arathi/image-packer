export function getExtName(uri: string) {
    let url = new URL(uri);
    let path = url.pathname;
    let dotIndex = path.lastIndexOf(".");
    let extName = path.substring(dotIndex);
    return extName;
}

export function getFileName(uri: string) {
    let url = new URL(uri);
    let path = url.pathname;
    let index = path.lastIndexOf("/");
    let fileName = path.substring(index + 1);
    return fileName;
}

export function generateFileName(uri: string, seq: number, amount: number) {
    let length = Math.ceil(Math.log10(amount+1));
    let extName = getExtName(uri);
    let zeroAmount = length - `${seq}`.length;
    return `${'0'.repeat(zeroAmount)}${seq}${extName}`;
}
