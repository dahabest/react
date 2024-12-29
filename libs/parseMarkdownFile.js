const { translateParagraphs } = require("./translate");
const { writeFile } = require("node:fs/promises");

const TAGS = [
  "Intro",
  "YouWillLearn",
  "Diagram",
  "Recap",
  "DeepDive",
  "Sandpack",
  "LearnMore",
  "Pitfall",
  "Challenges",
  "Solution",
];
const CODE_TAGS = ["Sandpack"];
const EXCLUDES = ["[comment]", "[TODO]"];

const rWord = /.*\w+/i;
const rHeader = /(?<=^#{1,4} )[\s\S]*(?={)/gm;

const isOpenAnyTag = (paragraph) =>
  TAGS.find((tag) => paragraph.startsWith(`<${tag}`));

const isCloseAnyTag = (paragraph) =>
  TAGS.find((tag) => paragraph.includes(`</${tag}`));

const isHeader = (paragraph) => paragraph.startsWith("##");

const isCodeOpenTag = (paragraph) =>
  CODE_TAGS.find((tag) => paragraph.startsWith(`<${tag}`));

const isOpenTag = (paragraph) =>
  isOpenAnyTag(paragraph) && !isCodeOpenTag(paragraph);

const isExclude = (paragraph) => EXCLUDES.find((e) => paragraph.startsWith(e));

/* IsStart is opened tag or header or closed tag
IsStart and (isHeader or isOpenTag or isCloseTag) and 
to translate.join().is word then need translate */
async function parseMarkdownFileOld(paragraphsOld, fileNameOutput) {
  let paragraphs = [...paragraphsOld.slice(3), "\r\n"];
  //console.log(paragraphs);

  let newFile = paragraphsOld.slice(0, 3);
  let isStart = true;
  let toTranslate = [];
  let header = "";

  const isEnd = (key) => key == paragraphs.length - 1;

  function reset() {
    isStart = false;
    toTranslate = [];
    header = "";
  }
  async function translate() {
    const last = toTranslate.pop();
    const wrappedEngParagraphs = wrapEngParagraphs(toTranslate, header);
    const translatedParagraphs = await translateParagraphs(toTranslate);

    newFile = [
      ...newFile,
      ...translatedParagraphs,
      ...wrappedEngParagraphs,
      last,
    ];
  }

  for (let key in paragraphs) {
    let paragraph = paragraphs[key];
    //console.log("interation", key, { isStart, tag, paragraph });

    if (isExclude(paragraph)) continue;

    if (isStart) toTranslate.push(paragraph);

    if (!isStart) newFile.push(paragraph);

    if (
      isStart &&
      (isHeader(paragraph) ||
        isCloseAnyTag(paragraph) ||
        isOpenAnyTag(paragraph) ||
        isEnd(key))
    ) {
      if (hasText(toTranslate)) {
        //console.log({ key });
        await translate();
        await writeFile(fileNameOutput, newFile);
      } else {
        newFile = [...newFile, ...toTranslate];
      }
      reset();
      if (!isCodeOpenTag(paragraph)) isStart = true;
    }

    if (
      isOpenTag(paragraph) ||
      isCloseAnyTag(paragraph) ||
      isHeader(paragraph)
    ) {
      isStart = true;
    }

    if (isHeader(paragraph)) {
      header = paragraph.match(rHeader);
    }
  }

  return newFile;
}

// check toTranslate except the last tag (#, <>, /<>)
function hasText(toTranslate) {
  const paragraphs = toTranslate.slice(0, toTranslate.length - 1);
  return paragraphs.some((paragraph) => {
    //console.log(paragraph, { isWord: paragraph.match(rWord) });
    return paragraph.match(rWord);
  });
}

function wrapEngParagraphs(toTranslate, header) {
  return [
    "\r\n",
    "<details>\r\n",
    "<summary><small>(eng)</small></summary>\r\n",
    ...(header ? [`\r\n<b>${header}</b>\r\n`] : []),
    ...toTranslate,
    "</details>\r\n",
    "\r\n",
  ];
}

async function parseMarkdownForParagraph(content) {
  let regex;

  regex = /^#{1,6}\s?([^\n]+)/gm;
  //paragraphs
  regex = /([^\n]+\n?)/g;

  const result = content.match(regex);

  return result;
}

module.exports = {
  //parseMarkdownFile,
  parseMarkdownFileOld,
  parseMarkdownForParagraph,
};

//const isExcludes = (paragraphs) => paragraphs.find((p) => isExclude(p));
// if (isExclude(paragraph)) {
//   newFile.push(paragraph);
//   continue;
// }

// if (isOpenTag(paragraph)) {
//   tag = isOpenTag(paragraph);

//   if (!isCodeTag(paragraph)) isStart = true;
// }

//const CLOSE_TAGS = [...TAGS, "Sandpack"];
//const OPEN_TAGS = TAGS.map((tag) => `<${tag}>`);

//const isCloseTag = (paragraph, tag) => paragraph.includes(`</${tag}>`);
/* const isCloseTagAndHeader = (paragraph, tag) => {
  //const isClose = TAGS.find((tag) => paragraph.startsWith(`</${tag}>`));
  return tag === "closed" && isHeader(paragraph);
}; */

//console.log(newFile);
//newFile.push(ps[key]);
//let isWord = ps[key].match(rWord);
//const result = /(?<=^# .*?\n)([\s\S]*?)(?=\n<[^>]+>)/.exec(content);
