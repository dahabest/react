const { writeFile } = require("node:fs/promises");
const { markdown } = require("markdown");
const { getFileContent } = require("./getFileContent");

async function readMdFile(fileName) {
  try {
    const content = await getFileContent(fileName);
    const tree = markdown.parse(content);

    let lines = "";
    for (const node of tree) {
      console.log(JSON.stringify(node));
      lines = lines + JSON.stringify(node) + "\n";
    }
    const fileWithTree = await writeFile("./tree2.md", lines);
  } catch (err) {
    console.log(err.message);
  }
}

readMdFile("./test.md");
