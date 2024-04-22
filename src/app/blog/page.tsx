import Link from "next/link"
import BlogPage from "../../pages/blogPage.mdx"
import { getSortedArticleData } from "../lib/articles"

type AllArticleData = {
    date: string
    title: string
    id: string
}[]

export default function Blog () {
    const allArticleData: AllArticleData = getSortedArticleData();
    return (
        <main className="min-h-screen bg-zinc-50 p-24 dark:bg-zinc-950">
            <BlogPage/>
            <section>
                <ul>
                    {allArticleData.map(({ id, date, title }) => (
                        <li key={id}>
                            <div className='font-medium mb-1 mt-5'>
                                <Link href={`/posts/${id}`}>{title}</Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    )
}