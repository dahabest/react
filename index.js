const { writeFile } = require("node:fs/promises");
const { getFileContent } = require("./libs/getFileContent");
const {
  parseMarkdownFile,
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

readMdFileOld("./md/test.md");

async function readMdFile(fileName) {
  try {
    const content = await getFileContent(fileName);

    const result = await parseMarkdownFile(content);

    await writeFile("./output/tree1.md", result[0]);
    await writeFile("./output/translated1.md", result[1]);
  } catch (err) {
    console.log(err.message);
  }
}
