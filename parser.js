export const CONFIG = {
  READ_SPEED: 400,
};

export function normalizeNotionMarkdown(markdown) {
  let text = markdown;

  // Normalize bullet characters from Notion
  text = text.replace(/^\s*•\s+/gm, "- ");
  text = text.replace(/^\s*◦\s+/gm, "  - ");
  text = text.replace(/^\s*▪\s+/gm, "  - ");

  // Task lists
  text = text.replace(/^\s*[-*]\s*\[x\]\s+/gim, "- ✅ ");
  text = text.replace(/^\s*[-*]\s*\[\s\]\s+/gim, "- ☐ ");

  // Toggle blocks (degrade to headings)
  text = text.replace(/^\s*[-*]\s*[▸▶]\s+/gm, "### ");

  // Callout style: keep as blockquote, ensure prefix
  text = text.replace(/^\s*(💡|✅|⚠️|ℹ️|❗|📝)\s+/gm, "> $1 ");

  return text;
}

export function convertTablesToLists(markdown) {
  const lines = markdown.split("\n");
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.startsWith("|") && line.endsWith("|")) {
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (/^\|[\s\-:]+\|/.test(nextLine)) {
          const headers = line.slice(1, -1).split("|").map((h) => h.trim());
          i += 2;

          const tableRows = [];
          while (i < lines.length) {
            const rowLine = lines[i].trim();
            if (rowLine.startsWith("|") && rowLine.endsWith("|")) {
              const cells = rowLine.slice(1, -1).split("|").map((c) => c.trim());
              tableRows.push(cells);
              i += 1;
            } else {
              break;
            }
          }

          result.push("");
          for (const row of tableRows) {
            const parts = [];
            for (let j = 0; j < row.length; j += 1) {
              if (j < headers.length && row[j]) {
                parts.push(`**${headers[j]}**: ${row[j]}`);
              }
            }
            if (parts.length) {
              result.push(`- ${parts.join(" · ")}`);
            }
          }
          result.push("");
          continue;
        }
      }
    }

    result.push(lines[i]);
    i += 1;
  }

  return result.join("\n");
}

export function stripImages(markdown) {
  return markdown.replace(/!\[[^\]]*\]\([^)]+\)/g, "");
}

export function stripEmbeds(markdown) {
  // Notion often pastes standalone URLs for embeds
  return markdown.replace(/^https?:\/\/.+$/gm, (line) => `> 链接：${line}`);
}

export function replaceMermaidBlocks(markdown) {
  return markdown.replace(/```mermaid[\s\S]*?```/g, () => {
    return "> ⚠️ Mermaid 图表无法在 X Articles 渲染，请在此处插入截图/图片。";
  });
}

export function getXArticlesHtml(markdown, marked) {
  let processed = normalizeNotionMarkdown(markdown);
  processed = convertTablesToLists(processed);
  processed = stripImages(processed);
  processed = replaceMermaidBlocks(processed);
  processed = stripEmbeds(processed);

  let html = marked.parse(processed);
  html = html.replace(/ style="[^"]*"/g, "");
  return html;
}

export function getStats(markdown) {
  const text = markdown;
  const wordCount = text.replace(/\s+/g, "").length;
  const readTime = Math.ceil(wordCount / CONFIG.READ_SPEED);
  const paragraphCount = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  return { wordCount, readTime, paragraphCount };
}
