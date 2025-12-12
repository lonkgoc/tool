declare module 'adm-zip' {
  export default class AdmZip {
    constructor(filename?: string);
    addLocalFile(filename: string, zipPath?: string): void;
    addLocalFolder(folderPath: string, zipPath?: string): void;
    extractAllTo(targetPath: string, overwrite?: boolean): void;
    writeZip(filename?: string): void;
    getEntries(): any[];
  }
}
