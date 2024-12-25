const { markdown } = require("markdown");
const tags = require("./tags");

const isPara = (node) =>
  Array.isArray(node) && node[0].toLowerCase() === "para";
const isHeader = (node) =>
  Array.isArray(node) && node[0].toLowerCase().includes("header");

const isTag = (node) => isPara(node) && String(node[1]).startsWith("<");
const isOpenTag = (node) => isTag(node) && !String(node[1]).startsWith("</");
const isCloseTag = (node) => isTag(node) && String(node[1]).startsWith("</");

const isOpenIntro = (node) => isOpenTag(node) && node[1].includes("Intro");
const isCloseIntro = (node) => isCloseTag(node) && node[1].includes("Intro");
const isDetails = (node) => isPara(node) && node[1].includes("details");

async function parseMarkdownFile(content) {
  const tree = markdown.parse(content);

  let toTranslate = [];
  let isStart = false;
  for (const node of tree) {
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

    if (isOpenIntro(node) && isHeader(node)) {
      isStart = true;
    }
  }

  console.log(toTranslate.map((node) => JSON.stringify(node)).join("\n"));

  return lines;
}
//lines = lines + JSON.stringify(node) + "\n";

module.exports = {
  parseMarkdownFile,
};
