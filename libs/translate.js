const { translator } = require("./data");

const rWord = /.*\w+/i;

async function translateParagraphs(toTranslate, header) {
  //console.log(toTranslate);
  const isTheEnd = (index) => Number(index) === toTranslate.length - 1;
  const isWord = (paragraph) => paragraph.match(rWord);
  const isHeader = (paragraph) => paragraph.match(/^#{1,6}/);

  try {
    let allParagraphs = [""];
    toTranslate.push("");

    for (const key in toTranslate) {
      const current = toTranslate[key];
      let text = allParagraphs.pop();

      if ((current.startsWith("```js") || isTheEnd(key)) && isWord(text)) {
        //text = `\r\ntranslated(${text})\r\n`;
        text = await translateText(text);
      }
      if (current.startsWith("```js")) {
        allParagraphs.push(text, current);
        continue;
      }
      if (current.startsWith("```")) {
        allParagraphs.push(`${text}${current}`, "");
        continue;
      }
      allParagraphs.push(`${text}${current}`);
    }
    //console.log(allParagraphs);
    return allParagraphs;
  } catch (error) {
    console.log("tried translating text:");
    console.log(toTranslate);
    console.log(error);
  }
}

async function translateText(text) {
  return `TRANSLATED( ${text} ) TRANSLATED`;
  // const translatedResult = await translator.translateText(text, "EN", "RU");
  // return translatedResult.text;
}

module.exports = {
  translateParagraphs,
  translateText,
};

/* if (isHeader(current)) {
  const headerTranslated = await translateText(current);
  allParagraphs.push(text, headerTranslated);
  continue;
} */
