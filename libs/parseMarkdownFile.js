const { markdown: md } = require("markdown");
const { translateParagraphs } = require("./translate");
const { writeFile } = require("node:fs/promises");

TAGS = ["Intro", "YouWillLearn", "Diagram", "Recap", "DeepDive", "Sandpack"];
CLOSE_TAGS = [...TAGS, "Sandpack"];
CODE_TAGS = ["Sandpack"];
EXCLUDES = ["[comment]", "[TODO]"];
OPEN_TAGS = TAGS.map((tag) => `<${tag}>`);

const rWord = /.*\w+/i;

const isOpenAnyTag = (paragraph) =>
  TAGS.find((tag) => paragraph.startsWith(`<${tag}`));

const isCloseTag = (paragraph, tag) => paragraph.includes(`</${tag}>`);
const isCloseAnyTag = (paragraph) =>
  TAGS.find((tag) => paragraph.includes(`</${tag}`));

const isHeader = (paragraph) => paragraph.startsWith("##");

const isCodeTag = (paragraph) =>
  CODE_TAGS.find((tag) => paragraph.startsWith(`<${tag}`));

const isOpenTag = (paragraph) =>
  isOpenAnyTag(paragraph) && !isCodeTag(paragraph);

const isNotExcludes = (paragraph) =>
  !EXCLUDES.find((e) => paragraph.includes(e));

/* IsStart is opened tag or header or closed tag
IsStart and (isHeader or isOpenTag or isCloseTag) and 
to translate.join().is word then need translate */
async function parseMarkdownFileOld(paragraphsOld, fileNameOutput) {
  let paragraphs = paragraphsOld; //.slice(10, 40);
  //console.log(paragraphs);

  let newFile = [];
  let isStart = false;
  let tag = null;
  let toTranslate = [];

  function reset() {
    isStart = false;
    tag = null;
    toTranslate = [];
  }

  function resetStart(paragraph) {}

  async function translate() {
    const closeTag = toTranslate.pop();
    const translatedParagraphs = await translateParagraphs(toTranslate);
    const wrappedEngParagraphs = wrapEngParagraphs(toTranslate);

    newFile = [
      ...newFile,
      ...translatedParagraphs,
      ...wrappedEngParagraphs,
      closeTag,
    ];
  }

  for (let key in paragraphs) {
    let paragraph = paragraphs[key];
    //console.log("interation", key, { isStart, tag, paragraph });
    if (isStart && isNotExcludes(paragraph)) {
      toTranslate.push(paragraph);
    }

    if (!isStart) newFile.push(paragraph);
    // No matter where - matter isStart and (header OR another any tag)
    if (
      isStart &&
      (isHeader(paragraph) ||
        isCloseAnyTag(paragraph) ||
        isOpenAnyTag(paragraph))
    ) {
      if (hasText(toTranslate)) {
        //console.log({ key });
        await translate();

        await writeFile(fileNameOutput, newFile);
      } else {
        newFile = [...newFile, ...toTranslate];
      }

      reset();

      if (!isCodeTag(paragraph)) isStart = true;
    }

    if (isOpenTag(paragraph)) {
      tag = isOpenTag(paragraph);

      if (!isCodeTag(paragraph)) isStart = true;
    }
  }
  // console.log("newFile", newFile);
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

/* const isCloseTagAndHeader = (paragraph, tag) => {
  //const isClose = TAGS.find((tag) => paragraph.startsWith(`</${tag}>`));
  return tag === "closed" && isHeader(paragraph);
}; */

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
