import { readFile, readdir, writeFile } from 'fs/promises'
import PageDB from '../models/page-db';
import { DirFiles } from '../types/read-dir';

export const readWordsFromFile = async (path: string): Promise<string[]> => {
    const wordsFromFile = await readFile(path, 'utf8');
    return wordsFromFile.split(' ');
}


export const readRowsFromFile = async (path: string): Promise<string[]> => {
    const wordsFromFile = await readFile(path, 'utf8');
    return wordsFromFile.split('\n');
}


export const readFilenamesInDirs = async (paths: string[]): Promise<DirFiles[]> => {
    const filenames: DirFiles[] = [];

    for (const path of paths) {
        const filesInDir: string[] = await readdir(path, 'utf8');
        const dirpaths = path.split("/");

        filenames.push({
            dirPath: path,
            dirName: dirpaths[dirpaths.length -1],
            filenames: filesInDir
        });
    }

    return filenames;
}