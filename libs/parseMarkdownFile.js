const { markdown: md } = require("markdown");

TAGS = ["Intro", "YouWillLearn", "Diagram", "Recap"];
OPEN_TAGS = TAGS.map((tag) => `<${tag}>`);
const rWord = /.*\w+/i;

const isOpenTag = (paragraph) =>
  TAGS.find((tag) => paragraph.startsWith(`<${tag}`));

const isCloseTag = (paragraph, tag) => paragraph.includes(`</${tag}>`);
const isHeader = (paragraph) => paragraph.startsWith("##");

/* IsStart is opened tag or header or closed tag

IsStart and (isHeader or isOpenTag or isCloseTag) and 
to translate.join().is word then need transkate */
async function parseMarkdownFileOld(paragraphsOld) {
  let paragraphs = paragraphsOld; //.slice(10, 40);
  console.log(paragraphs);

  let newFile = [];
  let isStart = false;
  let tag = null;
  let toTranslate = [];

  function reset() {
    isStart = false;
    tag = null;
    toTranslate = [];
  }

  function translate() {
    const closeTag = toTranslate.pop();
    const translatedParagraphs = translateParagraphs(toTranslate);
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
    // is process and even not words
    if (isStart) toTranslate.push(paragraph);

    if (!isStart) newFile.push(paragraph);

    // No matter where - matter isStart and (header OR another any tag)
    if (
      isStart &&
      (isHeader(paragraph) ||
        isCloseTag(paragraph, tag) ||
        isOpenTag(paragraph))
    ) {
      if (hasText(toTranslate)) {
        translate();
      } else {
        newFile = [...newFile, ...toTranslate];
      }

      reset();

      isStart = true;
    }

    if (isOpenTag(paragraph)) {
      tag = isOpenTag(paragraph);
      //console.log({ tag });
      isStart = true;
    }

    // after adding a close tag(</Tag>) into the File (exclude key)
    //console.log({ paragraph, tag, isCLose: isCloseTag(paragraph, tag) });
    /*  if (isCloseTag(paragraph, tag)) {
      translate();
      reset();

      isStart = true;
      tag = "closed";
    } */
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

function translateParagraphs(paragraphs) {
  return ["\r\n", "translated\r\n"];
}

async function parseMarkdownForParagraph(content) {
  let regex;

  regex = /^#{1,6}\s?([^\n]+)/gm;
  //paragraph
  regex = /([^\n]+\n?)/g;

  const result = content.match(regex);

  return result;
}

module.exports = {
  //parseMarkdownFile,
  parseMarkdownFileOld,
  parseMarkdownForParagraph,
};
