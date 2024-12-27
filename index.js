const { writeFile } = require("node:fs/promises");
const { getFileContent } = require("./libs/getFileContent");
const { topics } = require("./md/learn");

const fileName = `./md/learn/${topics.learn.ui_tree}.md`;
const fileNameOutput = `./md/output/learn/${topics.learn.ui_tree}.md`;

const {
  //parseMarkdownFile,
  parseMarkdownFileOld,
  parseMarkdownForParagraph,
} = require("./libs/parseMarkdownFile");

async function readMdFileOld(fileName) {
  try {
    const content = await getFileContent(fileName);
    const paragraphs = await parseMarkdownForParagraph(content);
    const translatedMd = await parseMarkdownFileOld(paragraphs, fileNameOutput);

    //await writeFile(paragraphs, result);
    await writeFile(fileNameOutput, translatedMd);
  } catch (err) {
    console.log(err.message);
    console.log(err);
  }
}

readMdFileOld(fileName);
// const header = "## Your UI as a tree {/*your-ui-as-a-tree*/}";

// const rHeader = /(?<=^#{1,4} )[\s\S]*(?={)/gm;

// console.log(header.match(rHeader));
