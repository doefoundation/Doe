/**
 * Tiny, dependency-free Markdown parser for news articles.
 * It only produces data (no HTML), so nothing the editor types can inject
 * scripts or raw HTML into the site.
 *
 * Supported: ## headings, **bold**, *italic*, [links](url), - bullet lists,
 * 1. numbered lists, > quotes, --- dividers, 

![image](url)

, `code`, and
 * ``` code blocks. Plain text with blank lines between paragraphs still works.
 */

export type Inline =
  | { type: 'text'; value: string }
  | { type: 'br' }
  | { type: 'strong'; children: Inline[] }
  | { type: 'em'; children: Inline[] }
  | { type: 'code'; value: string }
  | { type: 'link'; href: string; children: Inline[] }

export type Block =
  | { type: 'heading'; level: 2 | 3 | 4; children: Inline[] }
  | { type: 'paragraph'; children: Inline[] }
  | { type: 'list'; ordered: boolean; items: Inline[][] }
  | { type: 'quote'; children: Inline[] }
  | { type: 'image'; src: string; alt: string }
  | { type: 'code'; value: string }
  | { type: 'hr' }

const SAFE_LINK = /^(https?:\/\/|\/|#|mailto:|tel:)/i
const SAFE_IMAGE = /^(https:\/\/|\/)/i

export function isSafeLink(url: string) {
  return SAFE_LINK.test(url)
}

export function isSafeImage(url: string) {
  return SAFE_IMAGE.test(url)
}

const isAlnum = (char: string | undefined) => Boolean(char && /[\p{L}\p{N}]/u.test(char))

export function parseInline(input: string): Inline[] {
  const nodes: Inline[] = []
  let buffer = ''
  let i = 0

  const flush = () => {
    if (buffer) nodes.push({ type: 'text', value: buffer })
    buffer = ''
  }

  while (i < input.length) {
    const char = input[i]

    // Backslash escapes: \* \_ \[ \] \( \) \` \\ \#
    if (char === '\\' && i + 1 < input.length && /[\\`*_[\]()#>!-]/.test(input[i + 1])) {
      buffer += input[i + 1]
      i += 2
      continue
    }

    if (char === '\n') {
      flush()
      nodes.push({ type: 'br' })
      i += 1
      continue
    }

    if (char === '`') {
      const end = input.indexOf('`', i + 1)
      if (end > i + 1) {
        flush()
        nodes.push({ type: 'code', value: input.slice(i + 1, end) })
        i = end + 1
        continue
      }
    }

    if (char === '*' && input[i + 1] === '*') {
      const end = input.indexOf('**', i + 2)
      if (end > i + 2 && !/^\s/.test(input[i + 2])) {
        flush()
        nodes.push({ type: 'strong', children: parseInline(input.slice(i + 2, end)) })
        i = end + 2
        continue
      }
    }

    if (char === '*' && input[i + 1] !== '*' && input[i + 1] !== undefined && !/\s/.test(input[i + 1])) {
      let end = i + 1
      while ((end = input.indexOf('*', end)) !== -1 && input[end + 1] === '*') end += 2
      if (end > i + 1 && !/\s/.test(input[end - 1])) {
        flush()
        nodes.push({ type: 'em', children: parseInline(input.slice(i + 1, end)) })
        i = end + 1
        continue
      }
    }

    if (char === '_' && !isAlnum(input[i - 1]) && input[i + 1] !== undefined && !/\s/.test(input[i + 1])) {
      let end = input.indexOf('_', i + 1)
      while (end !== -1 && isAlnum(input[end + 1])) end = input.indexOf('_', end + 1)
      if (end > i + 1 && !/\s/.test(input[end - 1])) {
        flush()
        nodes.push({ type: 'em', children: parseInline(input.slice(i + 1, end)) })
        i = end + 1
        continue
      }
    }

    if (char === '[') {
      const match = /^\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/.exec(input.slice(i))
      if (match) {
        flush()
        const [whole, label, href] = match
        if (isSafeLink(href)) nodes.push({ type: 'link', href, children: parseInline(label) })
        else nodes.push(...parseInline(label))
        i += whole.length
        continue
      }
    }

    buffer += char
    i += 1
  }

  flush()
  return nodes
}

const HEADING = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/
const HR = /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/
const FENCE = /^\s{0,3}```/
const QUOTE = /^\s{0,3}>\s?(.*)$/
const BULLET = /^\s{0,3}[-*+]\s+(.*)$/
const NUMBERED = /^\s{0,3}\d{1,3}[.)]\s+(.*)$/
const IMAGE_ONLY = /^\s*!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*$/

function startsNewBlock(line: string) {
  return HEADING.test(line) || HR.test(line) || FENCE.test(line) || QUOTE.test(line) || BULLET.test(line) || NUMBERED.test(line) || IMAGE_ONLY.test(line)
}

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) {
      i += 1
      continue
    }

    if (FENCE.test(line)) {
      const body: string[] = []
      i += 1
      while (i < lines.length && !FENCE.test(lines[i])) body.push(lines[i++])
      i += 1
      blocks.push({ type: 'code', value: body.join('\n') })
      continue
    }

    const heading = HEADING.exec(line)
    if (heading) {
      const level = Math.min(Math.max(heading[1].length, 2), 4) as 2 | 3 | 4
      blocks.push({ type: 'heading', level, children: parseInline(heading[2]) })
      i += 1
      continue
    }

    if (HR.test(line)) {
      blocks.push({ type: 'hr' })
      i += 1
      continue
    }

    const image = IMAGE_ONLY.exec(line)
    if (image) {
      if (isSafeImage(image[2])) blocks.push({ type: 'image', alt: image[1].trim(), src: image[2] })
      i += 1
      continue
    }

    if (QUOTE.test(line)) {
      const quoted: string[] = []
      while (i < lines.length && QUOTE.test(lines[i])) quoted.push(QUOTE.exec(lines[i++])![1])
      blocks.push({ type: 'quote', children: parseInline(quoted.join('\n').trim()) })
      continue
    }

    const listPattern = BULLET.test(line) ? BULLET : NUMBERED.test(line) ? NUMBERED : null
    if (listPattern) {
      const items: Inline[][] = []
      const ordered = listPattern === NUMBERED
      while (i < lines.length) {
        const current = lines[i]
        const match = listPattern.exec(current)
        if (match) {
          items.push(parseInline(match[1]))
          i += 1
          continue
        }
        if (!current.trim()) {
          // A blank line only continues the list when the next item has the same marker.
          let next = i + 1
          while (next < lines.length && !lines[next].trim()) next += 1
          if (next < lines.length && listPattern.test(lines[next])) {
            i = next
            continue
          }
          break
        }
        if (startsNewBlock(current) || !items.length) break
        // Wrapped continuation line of the previous item.
        const last = items[items.length - 1]
        last.push({ type: 'text', value: ' ' }, ...parseInline(current.trim()))
        i += 1
      }
      blocks.push({ type: 'list', ordered, items })
      continue
    }

    const paragraph: string[] = [line]
    i += 1
    while (i < lines.length && lines[i].trim() && !startsNewBlock(lines[i])) paragraph.push(lines[i++])
    blocks.push({ type: 'paragraph', children: parseInline(paragraph.map((l) => l.trim()).join('\n')) })
  }

  return blocks
}
