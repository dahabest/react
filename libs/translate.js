const { translator } = require("./data");

const rWord = /.*\w+/i;

async function translateParagraphs(toTranslate) {
  //console.log(toTranslate);
  const isTheEnd = (index) => Number(index) === toTranslate.length - 1;
  const isWord = (paragraph) => paragraph.match(rWord);
  try {
    let allParagraphs = [""];
    toTranslate.push("");

    for (const key in toTranslate) {
      const current = toTranslate[key];
      let text = allParagraphs.pop();

      if ((current.startsWith("```js") || isTheEnd(key)) && isWord(text)) {
        text = `\r\ntranslated(${text})\r\n`;
        /* const translatedResult = await translator.translateText(
            text,
            "EN",
            "RU"
          );
          text = translatedResult.text; */
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

module.exports = {
  translateParagraphs,
};

// const translatedParagraphs = toTranslate.reduce(
//   (prev, current, currentIndex) => {
//     let text = prev.pop();

//     if (
//       (current.startsWith("```js") || isTheEnd(currentIndex)) &&
//       isWord(text)
//     ) {
//       text = `\r\ntranslated(${text})\r\n`;
//       /* const translatedResult = await translator.translateText(
//         text,
//         "EN",
//         "RU"
//       );
//       text = translatedResult.text; */
//     }

//     if (current.startsWith("```js")) {
//       return [...prev, text, current];
//     }
//     if (current.startsWith("```")) {
//       return [...prev, `${text}${current}`, ""];
//     }
//     return [...prev, `${text}${current}`];
//   },
//   [""]
// );
// return translatedParagraphs;
