const { writeFile } = require("node:fs/promises");
const { getFileContent } = require("./libs/getFileContent");
const { topics } = require("./md/learn");

fileName = topics.learn.describing;
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
// const header = "## Your UI as a tree {/*your-ui-as-a-tree*/}";

// const rHeader = /(?<=^#{1,4} )[\s\S]*(?={)/gm;

// console.log(header.match(rHeader));
