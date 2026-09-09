import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getArticleBySlug } from "@/src/lib/articles";
import { auth } from "@/src/lib/auth";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "يرجى تسجيل الدخول لاستخدام مساعد الذكاء الاصطناعي" }, { status: 401 });
    }

    // Optional: Only allow PREMIUM users to chat
    // if (!session.user.isPremium) {
    //   return NextResponse.json({ error: "هذه الميزة متاحة للمشتركين فقط" }, { status: 403 });
    // }

    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const systemInstruction = `
أنت مساعد ذكاء اصطناعي خبير ومحلل استراتيجي لمنصة "مِعمار".
مهمتك هي الإجابة على أسئلة المستخدم حول هذا التحليل الاستراتيجي.
يجب أن تكون إجاباتك دقيقة، احترافية، ومبنية على محتوى المقال المرفق.
إذا سأل المستخدم عن شيء غير موجود في المقال، يمكنك تقديم سياق عام ولكن وضح أن المقال لم يتطرق لذلك.
استخدم لغة عربية فصحى رصينة تليق بمركز أبحاث استراتيجي.

عنوان المقال: ${article.metadata.title}
تصنيف المقال: ${article.metadata.category}
المحتوى:
${article.content.replace(/<[^>]+>/g, '')}
`;

    const chatMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatMessages,
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("[ARTICLE_CHAT_API_ERR]", error);
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة طلبك" }, { status: 500 });
  }
}
