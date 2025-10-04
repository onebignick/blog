import { getArticleDataById } from '@/app/lib/articles';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from '@/components/CodeBlock';
import Image from 'next/image';

type Params = {
    id: string
}

type Props = {
    params: Params
}

export default async function Post ({params}: Props) {
    const {title, date, content} = getArticleDataById(params.id);

    return (
        <main className="py-8 px-4 mx-auto max-w-[800px]">
            <Link href='../blog' className="underline hover:opacity-60">Back</Link>
            <div className="flex justify-between items-end mt-6">
                <h1 className="text-xl md:text-3xl">{title}</h1>
                <p className="min-w-[100px]">
                    {date.toLocaleDateString("en-GB", {
                        day: 'numeric', month: 'short', year: 'numeric'
                    })}
                </p>
            </div>
            <article className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    components={{
                        pre: ({ node, children, ...props }: any) => {
                            return <CodeBlock {...props}>{children}</CodeBlock>
                        },
                        img: ({ node, src, alt, ...props }: any) => {
                            return (
                                <span className="block my-6">
                                    <img
                                        src={src || ''}
                                        alt={alt || ''}
                                        className="rounded-lg shadow-md w-full h-auto"
                                        {...props}
                                    />
                                </span>
                            )
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </article>
            <Link href='../blog' className="underline hover:opacity-60">Back</Link>
        </main>
    )
}