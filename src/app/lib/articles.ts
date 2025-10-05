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

        // Extract H1 title from content
        const titleMatch = matterResult.content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : id;

        return {
            id,
            title,
            ...(matterResult.data as { datePosted: string; dateUpdated: string; aliases: string[]; tags: string[] }),
        }
    })
    console.log(allArticleData)
    return allArticleData.sort((a, b) => {
        return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
    });
}

export function getArticleDataById(id: string) {
    const fullPath = path.join(articleDirectory, id + ".md");
    const fileContents = fs.readFileSync(fullPath, fileSyncEncoding);
    const matterResult = matter(fileContents)

    // Extract H1 title from content
    const titleMatch = matterResult.content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : id;

    // Remove H1 title from content to avoid duplication
    const contentWithoutTitle = matterResult.content.replace(/^#\s+.+$/m, '').trim();

    // Extract all headings (H2, H3, H4) for table of contents
    const headingRegex = /^(#{2,4})\s+(.+)$/gm;
    const headings: { id: string; text: string; level: number }[] = [];
    let match;

    while ((match = headingRegex.exec(contentWithoutTitle)) !== null) {
        const level = match[1].length;
        const text = match[2];
        const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

        headings.push({ id, text, level });
    }

    return {
        id,
        title,
        content: contentWithoutTitle,
        headings,
        ...(matterResult.data as { datePosted: string; dateUpdated: string; aliases: string[]; tags: string[] }),
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