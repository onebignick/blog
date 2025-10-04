import { Button } from '@/components/ui/button';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return { 
        h1: (props) => <h1 {...props} className="mb-4 text-4xl font-bold" />,
        h2: (props) => <h2 {...props} className="invisible"/>,
        h3: (props) => <h2 {...props} className="mb-4 text-2xl font-bold" />,
        h4: (props) => <h3 {...props} className="mb-4 text-l font-bold" />,
        ol: (props) => <ol {...props} className="list-decimal"/>,
        li: (props) => <li {...props}/>,
        p: (props) => <p {...props} className="mb-4" />,
        pre: (props) => (
            <pre {...props} className="rounded-lg border-2 border-zinc-500 p-4 mb-4 overflow-y-scroll" />    
        ),
        a: (props) => (
            <a {...props} className="underline hover:opacity-60"/>
        ),
        ...components 
    };
}