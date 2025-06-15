import { getSortedArticleData } from "@/app/lib/articles";

export async function GET(request: Request) {
    const articleData = await getSortedArticleData();
    return Response.json(articleData);
}