import fs from 'fs';

let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

content = content.replace(
  /const savedArticles: ArticlePreviewData\[\] = rawSaved\s*\.map\(\(item\) => {/g,
  'const savedArticlesTemp = await Promise.all(rawSaved.map(async (item) => {'
);
content = content.replace(
  /const likedArticles: ArticlePreviewData\[\] = rawLikes\s*\.map\(\(item\) => {/g,
  'const likedArticlesTemp = await Promise.all(rawLikes.map(async (item) => {'
);
content = content.replace(
  /const userComments: UserCommentData\[\] = rawComments\.map\(\(c\) => {/g,
  'const userComments: UserCommentData[] = await Promise.all(rawComments.map(async (c) => {'
);

// We also need to fix `.filter(Boolean) as ArticlePreviewData[];`
content = content.replace(
  /}\)\s*\.filter\(Boolean\) as ArticlePreviewData\[\];/g,
  '}));\n  const savedOrLiked = arguments.callee; // hacky, I will do a safer replace.'
);

fs.writeFileSync('src/app/dashboard/page.tsx', content, 'utf8');
