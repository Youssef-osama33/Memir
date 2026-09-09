import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";
import Navigation from "../../../components/navigation";
import ArticleEditor from "../../../components/writer/ArticleEditor";

export default async function NewArticlePage() {
  const session = await auth();
  if (!session || (session.user?.role !== "WRITER" && session.user?.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9]">
      <Navigation />
      <ArticleEditor />
    </div>
  );
}
