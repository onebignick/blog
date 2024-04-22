import dynamic from 'next/dynamic';
import Link from 'next/link';

type Params = {
    id: string
}

type Props = {
    params: Params
}

export default async function Post ({params}: Props) {
    const BlogPost = dynamic(() => import(`../../articles/${params.id}.mdx`), {
        loading: () => <p>Loading ...</p>,
    });

    return (
        <main className="min-h-screen bg-zinc-50 p-24 dark:bg-zinc-950">
            <Link href='../blog'>Back</Link>
            <BlogPost/>
        </main>
    )
}