import hljs from "highlight.js";
import { marked } from "marked";

const FILE_MATCH_REGEX = /.md$/;

function headingTextToId(text: string) {
  return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
}

export type MarkdownTOCNode = {
  depth: number;
  text: string;
  hash: string;
  children: MarkdownTOCNode[];
};

marked.setOptions({
  mangle: false,
  headerIds: false,
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    const highlighted = hljs.highlight(code, { language }).value;
    return highlighted;
  },
});

marked.use({
  renderer: {
    heading(text, level) {
      const id = headingTextToId(text);
      return `<h${level} id="${id}">${text}</h${level}>`;
    },
    image(href, title, text) {
      return `<figure><img src="${href}" alt="${text}" title="${title}" class="rounded-lg"></figure>`;
    },
  },
});

export function markdown() {
  return {
    name: "raw-text-import",
    // @ts-ignore
    transform(source, id) {
      if (FILE_MATCH_REGEX.test(id)) {
        const rawText = source.toString();

        const tokens = marked.lexer(rawText);
        const html = marked.parser(tokens);

        const headings = tokens.filter(
          (token): token is marked.Tokens.Heading => token.type === "heading"
        );

        const toc: MarkdownTOCNode[] = [];
        let stack: MarkdownTOCNode[] = [];

        let firstDepth: number | null = null;
        for (const heading of headings) {
          const { depth, text } = heading;
          const hash = headingTextToId(text);
          const node: MarkdownTOCNode = { text, hash, depth, children: [] };

          if (firstDepth === null) {
            firstDepth = depth;
          }

          if (depth === firstDepth) {
            toc.push(node);
            stack = [node];
          } else if (depth > stack[stack.length - 1].depth) {
            stack[stack.length - 1].children.push(node);
            stack.push(node);
          } else {
            while (stack[stack.length - 1].depth >= depth) {
              stack.pop();
            }
            stack[stack.length - 1].children.push(node);
            stack.push(node);
          }
        }

        return {
          code: `
export default ${JSON.stringify(html)};
export const toc = ${JSON.stringify(toc)};
`.trim(),
          map: null,
        };
      }

      return null;
    },
  };
}
