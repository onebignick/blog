import { Button } from '@/components/ui/button';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return { 
        h1: (props) => <h1 {...props} className="mb-4 text-4xl font-bold" />,
        h2: (props) => <h2 {...props} className="invisible"/>,
        p: (props) => <p {...props} className="mb-4" />,
        pre: (props) => (
            <pre {...props} className="rounded-lg border-2 border-zinc-500 p-4 mb-4 overflow-y-scroll" />    
        ),
        a: (props) => (
            <a {...props} className="hover:underline"/>
        ),
        ...components 
    };
}