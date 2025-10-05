import { getArticleDataById } from '@/app/lib/articles';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from '@/components/CodeBlock';
import { TableOfContents } from '@/components/TableOfContents';
import Image from 'next/image';

type Params = {
    id: string
}

type Props = {
    params: Params
}

export default async function Post ({params}: Props) {
    const {title, datePosted, content, headings} = getArticleDataById(params.id);

    return (
        <main className="py-8 px-4 mx-auto max-w-[800px] relative">
            <TableOfContents headings={headings} />
            <Link href='../blog' className="underline hover:opacity-60">Back</Link>
            <div className="flex justify-between items-end mt-6">
                <h1 className="text-xl md:text-3xl">{title}</h1>
                <p className="min-w-[100px]">
                    {new Date(datePosted).toLocaleDateString("en-GB", {
                        day: 'numeric', month: 'short', year: 'numeric'
                    })}
                </p>
            </div>
            <article className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    components={{
                        h2: ({ node, children, ...props }: any) => {
                            const text = children?.toString() || '';
                            const id = text
                                .toLowerCase()
                                .replace(/[^\w\s-]/g, '')
                                .replace(/\s+/g, '-');
                            return <h2 id={id} {...props}>{children}</h2>
                        },
                        h3: ({ node, children, ...props }: any) => {
                            const text = children?.toString() || '';
                            const id = text
                                .toLowerCase()
                                .replace(/[^\w\s-]/g, '')
                                .replace(/\s+/g, '-');
                            return <h3 id={id} {...props}>{children}</h3>
                        },
                        h4: ({ node, children, ...props }: any) => {
                            const text = children?.toString() || '';
                            const id = text
                                .toLowerCase()
                                .replace(/[^\w\s-]/g, '')
                                .replace(/\s+/g, '-');
                            return <h4 id={id} {...props}>{children}</h4>
                        },
                        code: ({ node, inline, className, children, ...props }: any) => {
                            if (inline) {
                                return <code className={className} {...props}>{children}</code>
                            }
                            return <code className={className} {...props}>{children}</code>
                        },
                        pre: ({ node, children, ...props }: any) => {
                            return <CodeBlock {...props}>{children}</CodeBlock>
                        },
                        img: ({ node, src, alt, ...props }: any) => {
                            // Convert relative paths to absolute paths starting with /
                            const imageSrc = src?.startsWith('http') || src?.startsWith('/')
                                ? src
                                : `/${src}`;

                            return (
                                <span className="block my-6 relative w-full h-auto">
                                    <Image
                                        src={imageSrc}
                                        alt={alt || ''}
                                        width={800}
                                        height={600}
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