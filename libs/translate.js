const { translator } = require("./data");

async function translateParagraphs(paragraphs) {
  try {
    const text = paragraphs.join("");
    //const translatedText = await translator.translateText(text, "EN", "RU");
    const translatedText = text;
    return translatedText;
  } catch (error) {
    console.log("tried translating text:");
    console.log(text);
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
