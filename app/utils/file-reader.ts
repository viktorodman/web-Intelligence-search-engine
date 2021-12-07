import { readFile, readdir } from 'fs/promises'
import Page from '../models/page';
import PageDB from '../models/page-db';

export const readWordsFromFile = async (path: string): Promise<string[]> => {
    const wordsFromFile = await readFile(path, 'utf8');
    const words: string[] = wordsFromFile.split(' ');

    return words;
}


export const readFilenamesInDirs = async (paths: string[]): Promise<string[]> => {
    const filenames: string[] = [];

    for (const path of paths) {
        const filesInDir: string[] = await readdir(path, 'utf8');

        for (let i = 0; i < filesInDir.length; i++) {
            filesInDir[i] = (path + "/" + filesInDir[i]);
        }

        filenames.push(...filesInDir);
    }

    return filenames;
}