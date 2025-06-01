const { writeFile } = require("node:fs/promises");
const { getFileContent } = require("./libs/getFileContent");
const { topics } = require("./md/learn");

let fileName = topics.test;
const file = `./md/learn/${fileName}.md`;
const fileOutput = `./md/output/learn/${fileName}.md`;

const {
  //parseMarkdownFile,
  parseMarkdownFileOld,
  parseMarkdownForParagraph,
} = require("./libs/parseMarkdownFile");

async function readMdFileOld(fileName) {
  try {
    const content = await getFileContent(file);
    const paragraphs = await parseMarkdownForParagraph(content);
    const translatedMd = await parseMarkdownFileOld(paragraphs, fileOutput);

    //await writeFile(paragraphs, result);
    await writeFile(fileOutput, translatedMd);
  } catch (err) {
    console.log(err.message);
    console.log(err);
  }
}

readMdFileOld(fileName);
/* (async function () {
  const text = await getFileContent(file);
  const rCode = //
    console.log(text.match(rCode));
})(); */

// const rHeader = /(?<=^#{1,4} )[\s\S]*(?={)/gm;
