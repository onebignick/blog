const fs = require('fs');
const path = require('path');
const os = require('os');

const articlesDir = path.join(__dirname, '../src/app/articles');
const publicDir = path.join(__dirname, '../public');
const zettlekastenDir = path.join(os.homedir(), 'zettlekasten');

// Image pattern in markdown: ![alt](path)
const imagePattern = /!\[.*?\]\((.*?\.(?:png|jpg|jpeg|gif|svg|webp))\)/gi;

function copyArticleMedia() {
    const files = fs.readdirSync(articlesDir);
    const markdownFiles = files.filter(f => f.endsWith('.md'));

    markdownFiles.forEach(file => {
        const filePath = path.join(articlesDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        let match;
        while ((match = imagePattern.exec(content)) !== null) {
            const imagePath = match[1];
            // Try zettlekasten directory first, then articles directory
            let sourceImagePath = path.join(zettlekastenDir, imagePath);

            if (!fs.existsSync(sourceImagePath)) {
                sourceImagePath = path.join(articlesDir, imagePath);
            }

            if (fs.existsSync(sourceImagePath)) {
                const destPath = path.join(publicDir, imagePath);
                const destDir = path.dirname(destPath);

                // Create destination directory if it doesn't exist
                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir, { recursive: true });
                }

                // Copy the file
                fs.copyFileSync(sourceImagePath, destPath);
                console.log(`Copied: ${imagePath} -> public/${imagePath}`);
            } else {
                console.warn(`Warning: Image not found: ${imagePath}`);
            }
        }
    });

    console.log('Media copy complete!');
}

copyArticleMedia();
