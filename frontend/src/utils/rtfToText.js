const SKIP_GROUPS = new Set(["fonttbl", "filetbl", "colortbl", "stylesheet", "listtable", "listoverridetable", "rsidtbl", "generator", "info", "pict", "object", "footer", "footerf", "footerl", "footerr", "header", "headerf", "headerl", "headerr", "xmlnstbl", "themedata", "colorschememapping", "latentstyles", "datastore", "shppict", "nonshppict", "bkmkstart", "bkmkend", "fldinst", "listtext", "pgptbl", "wgrffmtfilter", "panose", "revtbl", "xe", "tc", "field", "title", "subject", "author", "operator", "creatim", "revtim", "company", "category", "manager"]);
const CP1252 = {
  128: "\u20AC",
  130: "\u201A",
  131: "\u0192",
  132: "\u201E",
  133: "\u2026",
  134: "\u2020",
  135: "\u2021",
  136: "\u02C6",
  137: "\u2030",
  138: "\u0160",
  139: "\u2039",
  140: "\u0152",
  142: "\u017D",
  145: "\u2018",
  146: "\u2019",
  147: "\u201C",
  148: "\u201D",
  149: "\u2022",
  150: "\u2013",
  151: "\u2014",
  152: "\u02DC",
  153: "\u2122",
  154: "\u0161",
  155: "\u203A",
  156: "\u0153",
  158: "\u017E",
  159: "\u0178"
};
const decodeCp1252 = code => CP1252[code] || String.fromCharCode(code);
export function rtfToText(rtf) {
  const out = [];
  const skipStack = [false];
  const currentSkip = () => skipStack[skipStack.length - 1];
  const n = rtf.length;
  let i = 0;
  while (i < n) {
    const ch = rtf[i];
    if (ch === "{") {
      skipStack.push(currentSkip());
      i++;
      continue;
    }
    if (ch === "}") {
      if (skipStack.length > 1) skipStack.pop();
      i++;
      continue;
    }
    if (ch === "\\") {
      i++;
      if (i >= n) break;
      const c2 = rtf[i];
      if (c2 === "\\" || c2 === "{" || c2 === "}") {
        if (!currentSkip()) out.push(c2);
        i++;
        continue;
      }
      if (c2 === "'") {
        const hex = rtf.substr(i + 1, 2);
        i += 3;
        if (!currentSkip()) out.push(decodeCp1252(parseInt(hex, 16) || 0));
        continue;
      }
      if (c2 === "~") {
        i++;
        if (!currentSkip()) out.push("\u00A0");
        continue;
      }
      if (c2 === "_" || c2 === "-") {
        i++;
        if (!currentSkip()) out.push("-");
        continue;
      }
      if (c2 === "*") {
        skipStack[skipStack.length - 1] = true;
        i++;
        continue;
      }
      if (c2 === "\n" || c2 === "\r") {
        i++;
        continue;
      }
      const wordMatch = /^[a-zA-Z]+/.exec(rtf.slice(i));
      if (wordMatch) {
        const word = wordMatch[0];
        let j = i + word.length;
        const numMatch = /^-?\d+/.exec(rtf.slice(j));
        let num = null;
        if (numMatch) {
          num = parseInt(numMatch[0], 10);
          j += numMatch[0].length;
        }
        if (rtf[j] === " ") j++;
        i = j;
        if (word === "par" || word === "line" || word === "row") {
          if (!currentSkip()) out.push("\n");
        } else if (word === "tab") {
          if (!currentSkip()) out.push("\t");
        } else if (word === "page" || word === "sect") {
          if (!currentSkip()) out.push("\n\n");
        } else if (word === "u" && num !== null) {
          let code = num;
          if (code < 0) code += 65536;
          if (!currentSkip()) out.push(String.fromCharCode(code));
          if (rtf[i] === "?" || /[a-zA-Z0-9 .,;:!?'"()-]/.test(rtf[i] || "")) {
            i++;
          }
        } else if (SKIP_GROUPS.has(word)) {
          skipStack[skipStack.length - 1] = true;
        }
        continue;
      }
      i++;
      continue;
    }
    if (!currentSkip()) out.push(ch);
    i++;
  }
  return out.join("").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
