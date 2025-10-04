"use client"

import BlogPage from "../../pages/blogPage.mdx"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

type ArticleData = {
    date: Date;
    title: string
    id: string
}

export default function Blog () {
    const [allArticleData, setAllArticleDate] = useState<ArticleData[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("/api/articles");
            const res : ArticleData[] = await response.json();
            setAllArticleDate(res);
        }

        fetchData();
    }, [])

    const filteredArticles = allArticleData.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="py-8 px-4 mx-auto max-w-[800px]">
            <BlogPage/>
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                />
            </div>
            <section>
                <ul>
                    {filteredArticles.map(({ id, date, title }) => (
                        <li
                            key={id}
                            className="flex justify-between items-center py-4"
                            onClick={() => {router.replace(`posts/${id}`)}}
                        >
                            <div className='font-medium underline hover:opacity-60 cursor-pointer'>
                                <p>{title}</p>
                            </div>
                            <p className="min-w-[100px]">
                                {new Date(date).toLocaleDateString("en-GB", {
                                    day: 'numeric', month: 'short', year: 'numeric'
                                })}
                            </p>
                        </li>
                    ))}
                </ul>
                {filteredArticles.length === 0 && (
                    <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">No articles found</p>
                )}
            </section>
        </main>
    )
}