import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('lib/mdx') && !filePath.includes('api/admin/migrate-mdx/route.ts')) {
      content = content.replace(/lib\/mdx/g, 'lib/articles');
      
      // Now add await to the function calls
      const funcs = ['getArticleBySlug', 'getAllArticles', 'getPublishedArticles', 'getArticlesByCategory', 'getArticlesByAuthor', 'toggleArticleDraft'];
      funcs.forEach(func => {
        const regex = new RegExp(`(?<!await\\s)(?<!function\\s)(?<!const\\s)(${func}\\()`, 'g');
        content = content.replace(regex, 'await $1');
      });

      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
