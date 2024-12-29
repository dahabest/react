const { translator } = require("./data");

async function translateParagraphs(toTranslate) {
  //console.log(toTranslate);
  const isTheEnd = (index) => index === toTranslate.length - 1;
  try {
    const translatedParagraphs = toTranslate.reduce(
      (prev, current, currentIndex) => {
        let text = prev.pop();

        if (current.startsWith("```js") || isTheEnd(currentIndex)) {
          text = `\r\ntranslated(${text})\r\n`;
          //const translatedResult = await translator.translateText(text, "EN", "RU");
          //const translatedText = translatedResult.text;
        }

        if (current.startsWith("```js")) {
          return [...prev, text, current];
        }
        if (current.startsWith("```")) {
          return [...prev, `${text}${current}`, ""];
        }
        return [...prev, `${text}${current}`];
      },
      [""]
    );

    /*console.log("translatedParagraphs\n");
    console.log(translatedParagraphs); */
    return translatedParagraphs;
  } catch (error) {
    console.log("tried translating text:");
    console.log(toTranslate);
    console.log(error);
  }
}

module.exports = {
  translateParagraphs,
};

/* const translatedParagraphs = translatedText?.text
  .split("\r\n")
  .filter(Boolean)
  .map((item) => `${item}\r\n`); */
