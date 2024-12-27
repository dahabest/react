const { translator } = require("./data");

async function translateParagraphs(paragraphs) {
  const text = paragraphs.join("");
  //const translatedText = await translator.translateText(text, "EN", "RU");
  const translatedText = "translated";
  return ["\r\n", translatedText, "\r\n"];
}

module.exports = {
  translateParagraphs,
};

/* const translatedParagraphs = translatedText?.text
  .split("\r\n")
  .filter(Boolean)
  .map((item) => `${item}\r\n`); */
