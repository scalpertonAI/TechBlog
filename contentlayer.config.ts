import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { readingTime } from './lib/utils';

/** @type {import('contentlayer2/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: 'string',
    resolve: (doc: any) => doc._raw.flattenedPath.replace(/^posts\//, ''),
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc: any) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
  },
  readingTime: {
    type: 'json',
    resolve: (doc: any) => readingTime(doc.body.raw),
  },
  url: {
    type: 'string',
    resolve: (doc: any) => `/blog/${doc._raw.flattenedPath.replace(/^posts\//, '')}`,
  },
};

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'A short description or excerpt',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The publish date',
      required: true,
    },
    published: {
      type: 'boolean',
      description: 'Whether the post is published',
      default: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Tags for the post',
      default: [],
    },
    authors: {
      type: 'list',
      of: { type: 'string' },
      description: 'Authors of the post',
      default: ['Admin'],
    },
    heroImage: {
      type: 'string',
      description: 'Hero image URL',
      required: false,
    },
    featured: {
      type: 'boolean',
      description: 'Whether the post is featured',
      default: false,
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          onVisitLine(node: any) {
            // Prevent lines from collapsing in `display: grid` mode
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push('line--highlighted');
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ['word--highlighted'];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
});
