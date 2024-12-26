const { markdown: md } = require("markdown");
const tags = require("./tags");

TAGS = ["Intro", "YouWillLearn", "Diagram", "DeepDive"];
OPEN_TAGS = TAGS.map((tag) => `<${tag}>`);

const rWord = /.*\w+/i;
const isOpenTag = (paragraph) =>
  TAGS.find((tag) => paragraph.includes(`<${tag}>`));

const isCloseTag = (paragraph, tag) => {
  //console.log({ paragraph, tag });
  return paragraph.includes(`</${tag}>`);
};

async function parseMarkdownFileOld(paragraphsOld) {
  let paragraphs = paragraphsOld.slice(0, 12);
  //console.log(paragraphs);
  let newFile = [];
  let isStart = false;
  let tag = null;
  let toTranslate = [];
  for (let key in paragraphs) {
    let paragraph = paragraphs[key];
    //console.log("interation", key, { isStart, tag, paragraph });
    // is process and even not words
    if (isStart) {
      toTranslate.push(paragraph);
    }

    if (!isStart) {
      newFile.push(paragraph);
    }

    if (isOpenTag(paragraph)) {
      tag = isOpenTag(paragraph);
      //console.log({ tag });
      isStart = true;
    }

    // after adding a close tag(</Tag>) into the File (exclude key)
    //console.log({ paragraph, tag, isCLose: isCloseTag(paragraph, tag) });
    if (isCloseTag(paragraph, tag)) {
      const closeTag = toTranslate.pop();
      const translatedParagraphs = translateParagraphs(toTranslate);
      const wrappedEngParagraphs = wrapEngParagraphs(toTranslate);
      newFile = [
        ...newFile,
        ...translatedParagraphs,
        ...wrappedEngParagraphs,
        closeTag,
      ];

      isStart = false;
      toTranslate = [];
      tag = null;
    }
  }

  // console.log("newFile", newFile);

  return newFile;
}
//console.log(newFile);
//newFile.push(ps[key]);
//let isWord = ps[key].match(rWord);
//const result = /(?<=^# .*?\n)([\s\S]*?)(?=\n<[^>]+>)/.exec(content);

function wrapEngParagraphs(paragraphs) {
  return [
    "\r\n",
    "<details>\r\n",
    "<summary><small>(eng)</small></summary>\r\n",
    ...paragraphs,
    "</details>\r\n",
    "\r\n",
  ];
}

function translateParagraphs(paragraphs) {
  return ["\r\n", "translated\r\n"];
}

module.exports = {
  parseMarkdownFile,
  parseMarkdownFileOld,
  parseMarkdownForParagraph,
};

async function parseMarkdownForParagraph(content) {
  let regex;

  regex = /^#{1,6}\s?([^\n]+)/gm;
  //paragraph
  regex = /([^\n]+\n?)/g;

  const result = content.match(regex);

  return result;
}

async function parseMarkdownFile(content) {
  const tree = md.parse(content);

  let translatedTree = [];
  let toTranslate = [];
  let isStart = false;
  let lines = "";
  for (const node of tree) {
    translatedTree.push(node);
    // Идет процесс подготовки к переводу, пара и уже есть перевод - сброс
    if (isStart && isPara(node) && isDetails(node)) {
      toTranslate = [];
      isStart = false;
    }
    // Идет процесс подготовки к переводу, пара и текст(не тэг) - продолжаем
    if (isStart && isPara(node) && !isTag(node)) {
      toTranslate.push(node);
    }

    if (isCloseIntro(node)) {
      isStart = false;
    }

    if (isOpenIntro(node) || isHeader(node)) {
      isStart = true;
    }
    lines = lines + JSON.stringify(node) + "\n";
  }

  //console.log(toTranslate.map((node) => JSON.stringify(node)).join("\n"));

  let translated = translatedTree
    .map((node) => JSON.stringify(node))
    .join("\n");

  console.log(md.renderJsonML(md.toHTMLTree(tree)));

  return [lines, translated];
}

/* const isPara = (node) =>
  Array.isArray(node) && node[0].toLowerCase() === "para";
const isHeader = (node) =>
  Array.isArray(node) && node[0].toLowerCase().includes("header");

const isTag = (node) => isPara(node) && String(node[1]).startsWith("<");
const isOpenTag = (node) => isTag(node) && !String(node[1]).startsWith("</");
const isCloseTag = (node) => isTag(node) && String(node[1]).startsWith("</");

const isOpenIntro = (node) => isOpenTag(node) && node[1].includes("Intro");
const isCloseIntro = (node) => isCloseTag(node) && node[1].includes("Intro");
const isDetails = (node) => isPara(node) && node[1].includes("details");

regex = new RegExp(`(?<=>)([\\s\\S]*)(?=</YouWillLearn>)`, "gim");
regex = new RegExp(`(?<=<YouWillLearn>)([\\s\\S]*)(?=</YouWillLearn>)`, "gim");
regex = new RegExp(
  `(?<=^#{1,3} .*\r?\n)([\\s\\S]*)(?=\r\n<Diagram name)`,
  "gim"
); */

regex = /(?<=^#{1,3} .*\r?\n)([\s\S]*\n)(?=<Diagram)/gim;
