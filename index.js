const { writeFile } = require("node:fs/promises");
const { getFileContent } = require("./libs/getFileContent");
const { parseMarkdownFile } = require("./libs/parseMarkdownFile");

async function readMdFile(fileName) {
  try {
    const content = await getFileContent(fileName);

    const translated = await parseMarkdownFile(content);

    //const fileWithTree = await writeFile("./output/tree2.md", translated);
  } catch (err) {
    console.log(err.message);
  }
}

readMdFile("./md/test.md");
