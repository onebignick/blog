import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const filePath = '/src/app/articles';
const fileSyncEncoding = 'utf8';
const articleDirectory = path.join(process.cwd(), filePath);

export function getSortedArticleData() {
    const fileNames = fs.readdirSync(articleDirectory);
    const allArticleData = fileNames.map((filename) => {
        const id = filename.replace(/\.md$/, '')
        const fullPath = path.join(articleDirectory, filename)
        const fileContents = fs.readFileSync(fullPath, fileSyncEncoding);
        const matterResult = matter(fileContents)
        
        return {
            id,
            ...(matterResult.data as { date: Date; title: string }),
        }
    })
    console.log(allArticleData)
    return allArticleData.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getArticleDataById(id: string) {
    const fullPath = path.join(articleDirectory, id + ".md");
    const fileContents = fs.readFileSync(fullPath, fileSyncEncoding);
    const matterResult = matter(fileContents)

    return {
        id,
        content: matterResult.content,
        ...(matterResult.data as { date: Date; title: string }),
    }
}

export function getAllArticleIds() {
    const fileNames = fs.readdirSync(articleDirectory)

    return fileNames.map((filename) => {
        return {
            params: {
                id: filename.replace(/\.md$/, ''),
            },
        }
    })
}