"use client"

import BlogPage from "../../pages/blogPage.mdx"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type ArticleData = {
    date: Date;
    title: string
    id: string
}

export default function Blog () {
    const [allArticleData, setAllArticleDate] = useState<ArticleData[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("/api/articles");
            const res : ArticleData[] = await response.json();
            setAllArticleDate(res);
        }
        
        fetchData();
    }, [])


    return (
        <main className="min-h-screen py-12 md:py-24 px-4 mx-auto max-w-[800px]">
            <BlogPage/>
            <section>
                <ul>
                    {allArticleData.map(({ id, date, title }) => (
                        <li
                            key={id}
                            className="flex justify-between items-center py-4"
                            onClick={() => {router.replace(`posts/${id}`)}}
                        >
                            <div className='font-medium hover:underline cursor-pointer'>
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
            </section>
        </main>
    )
}