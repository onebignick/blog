"use client"

import { useEffect, useState } from 'react';

type Heading = {
    id: string;
    text: string;
    level: number;
};

type TableOfContentsProps = {
    headings: Heading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66%' }
        );

        const headingElements = headings.map(({ id }) =>
            document.getElementById(id)
        ).filter((el): el is HTMLElement => el !== null);

        headingElements.forEach((el) => observer.observe(el));

        return () => {
            headingElements.forEach((el) => observer.unobserve(el));
        };
    }, [headings]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="hidden md:block fixed right-8 top-32 w-64 max-h-[calc(100vh-200px)] overflow-y-auto">
            <h3 className="text-sm font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                On this page
            </h3>
            <ul className="space-y-2 text-sm border-l-2 border-zinc-200 dark:border-zinc-800">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        style={{ paddingLeft: `${(heading.level - 2) * 12 + 12}px` }}
                    >
                        <button
                            onClick={() => scrollToHeading(heading.id)}
                            className={`
                                text-left w-full transition-colors hover:text-zinc-900 dark:hover:text-zinc-100
                                ${activeId === heading.id
                                    ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                                    : 'text-zinc-600 dark:text-zinc-400'
                                }
                            `}
                        >
                            {heading.text}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
