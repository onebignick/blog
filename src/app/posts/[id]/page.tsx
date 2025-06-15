import { getArticleDataById } from '@/app/lib/articles';
import dynamic from 'next/dynamic';
import Link from 'next/link';

type Params = {
    id: string
}

type Props = {
    params: Params
}

export default async function Post ({params}: Props) {
    const {title, date} = getArticleDataById(params.id);


    const BlogPost = dynamic(() => import(`../../articles/${params.id}.mdx`), {
        loading: () => <p>Loading ...</p>,
    });

    return (
        <main className="min-h-screen bg-zinc-50 p-24 dark:bg-zinc-950">
            <Link href='../blog'>Back</Link>
            <div className="flex justify-between items-end">
                <h1 className="text-3xl">{title}</h1>
                <p className="min-w-[100px]">
                    {date.toLocaleDateString("en-GB", {
                        day: 'numeric', month: 'short', year: 'numeric'
                    })}
                </p>
            </div>
            <BlogPost/>
            <Link href='../blog'>Back</Link>
        </main>
    )
}