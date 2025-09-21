import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkToc from 'remark-toc'
import {unified} from 'unified'

export const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(remarkToc)
  .use(rehypeStringify);

export async function markdownToHtml(text: string) {
  const html = await processor
    .process(text)

  return String(html);
}
