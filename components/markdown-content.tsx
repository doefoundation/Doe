import Link from 'next/link'
import type { ReactNode } from 'react'
import { parseMarkdown, type Block, type Inline } from '@/lib/markdown'

function renderInline(nodes: Inline[]): ReactNode[] {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text':
        return node.value
      case 'br':
        return <br key={index} />
      case 'strong':
        return <strong key={index} className="font-semibold text-[#1a1917]">{renderInline(node.children)}</strong>
      case 'em':
        return <em key={index}>{renderInline(node.children)}</em>
      case 'code':
        return <code key={index} className="rounded bg-[#1a1917]/8 px-1.5 py-0.5 font-mono text-[0.9em]">{node.value}</code>
      case 'link': {
        const external = /^https?:\/\//i.test(node.href)
        return (
          <Link
            key={index}
            href={node.href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="font-semibold text-[#d70063] underline underline-offset-4 hover:no-underline"
          >
            {renderInline(node.children)}
          </Link>
        )
      }
    }
  })
}

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case 'heading': {
      const className =
        block.level === 2
          ? 'mt-4 font-serif text-3xl leading-tight tracking-[-0.03em] text-[#1a1917] sm:text-4xl'
          : block.level === 3
            ? 'mt-2 font-serif text-2xl leading-tight tracking-[-0.02em] text-[#1a1917]'
            : 'mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#d70063]'
      const Tag = block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h4'
      return <Tag key={index} className={className}>{renderInline(block.children)}</Tag>
    }
    case 'paragraph':
      return <p key={index}>{renderInline(block.children)}</p>
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag key={index} className={`flex flex-col gap-2 pl-6 ${block.ordered ? 'list-decimal' : 'list-disc'} marker:text-[#d70063]`}>
          {block.items.map((item, itemIndex) => <li key={itemIndex} className="pl-1">{renderInline(item)}</li>)}
        </Tag>
      )
    }
    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-[#d70063] pl-5 font-serif text-xl italic leading-relaxed text-[#1a1917]/80">
          {renderInline(block.children)}
        </blockquote>
      )
    case 'image':
      return (
        <figure key={index} className="my-2">
          <img src={block.src} alt={block.alt} loading="lazy" className="w-full rounded-2xl object-cover" />
          {block.alt && <figcaption className="mt-2 text-center text-sm text-[#1a1917]/55">{block.alt}</figcaption>}
        </figure>
      )
    case 'code':
      return <pre key={index} className="overflow-x-auto rounded-xl bg-[#1a1917] p-4 font-mono text-sm leading-relaxed text-white"><code>{block.value}</code></pre>
    case 'hr':
      return <hr key={index} className="my-2 border-[#1a1917]/15" />
  }
}

export function MarkdownContent({ source }: { source: string }) {
  const blocks = parseMarkdown(source)
  return <div className="flex flex-col gap-6 text-lg leading-relaxed text-[#1a1917]/85">{blocks.map(renderBlock)}</div>
    }
