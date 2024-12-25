const { readFile } = require("node:fs/promises");
const { resolve } = require("node:path");

async function getFileContent(fileName) {
  try {
    const filePath = resolve(fileName);
    const content = await readFile(filePath, "utf8");
    return content;
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = {
  getFileContent,
};
