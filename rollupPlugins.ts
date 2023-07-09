import hljs from "highlight.js";
import { marked } from "marked";

const FILE_MATCH_REGEX = /.md$/;

marked.setOptions({
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    const highlighted = hljs.highlight(code, { language }).value;
    return highlighted;
  },
});

export function markdown() {
  return {
    name: "raw-text-import",
    // @ts-ignore
    transform(source, id) {
      if (FILE_MATCH_REGEX.test(id)) {
        const rawText = source.toString();
        const html = marked(rawText);

        return {
          code: `export default ${JSON.stringify(html)}`,
          map: null,
        };
      }

      return null;
    },
  };
}
