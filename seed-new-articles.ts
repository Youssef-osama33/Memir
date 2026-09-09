import { PrismaClient, Category } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  const contentDir = path.join(process.cwd(), 'src/content/articles');
  const files = fs.readdirSync(contentDir);
  
  let count = 0;
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    
    const filePath = path.join(contentDir, file);
    const source = fs.readFileSync(filePath, 'utf8');
    const { data: metadata, content } = matter(source);
    
    const slug = file.replace(/\.mdx$/, '');
    
    const categoryMap: Record<string, Category> = {
      "ai-geopolitics": "AI_GEOPOLITICS",
      "cybersecurity": "CYBERSECURITY",
      "quantum-computing": "QUANTUM_COMPUTING",
      "energy": "ENERGY",
      "digital-infrastructure": "DIGITAL_INFRASTRUCTURE",
      "applied-modeling": "APPLIED_MODELING",
      "fiqh-al-waqi": "FIQH_AL_WAQI",
      "books": "BOOKS",
    };
    
    const categoryEnum = categoryMap[metadata.category] || "AI_GEOPOLITICS";
    
    await prisma.article.upsert({
      where: { slug: slug },
      update: {
        title: metadata.title,
        excerpt: metadata.excerpt,
        content: content,
        author: metadata.author,
        category: categoryEnum,
        isPremium: metadata.isPremium ?? false,
        publishedAt: new Date(metadata.publishedAt),
        bookAuthor: metadata.bookAuthor || null,
        ideaInOurTimeTitle: metadata.ideaInOurTimeTitle || null,
      },
      create: {
        slug: slug,
        title: metadata.title,
        excerpt: metadata.excerpt,
        content: content,
        author: metadata.author,
        authorSlug: "default-author",
        category: categoryEnum,
        isPremium: metadata.isPremium ?? false,
        publishedAt: new Date(metadata.publishedAt),
        createdAt: new Date(metadata.publishedAt),
        bookAuthor: metadata.bookAuthor || null,
        ideaInOurTimeTitle: metadata.ideaInOurTimeTitle || null,
      }
    });
    count++;
  }
  
  console.log(`Successfully migrated ${count} articles.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
