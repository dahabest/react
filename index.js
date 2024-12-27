const { writeFile } = require("node:fs/promises");
const { getFileContent } = require("./libs/getFileContent");
const { topics } = require("./md/learn");

const fileName = `./md/learn/${topics.learn.ui_tree}.md`;
const fileNameOutput = `./md/learn/output/${topics.learn.ui_tree}.md`;

const {
  //parseMarkdownFile,
  parseMarkdownFileOld,
  parseMarkdownForParagraph,
} = require("./libs/parseMarkdownFile");

async function readMdFileOld(fileName) {
  try {
    const content = await getFileContent(fileName);
    const paragraphs = await parseMarkdownForParagraph(content);
    const result = await parseMarkdownFileOld(paragraphs);

    await writeFile("./output/test.md", result);
  } catch (err) {
    console.log(err.message);
  }
}

readMdFileOld(fileName);
