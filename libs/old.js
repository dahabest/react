/* const isPara = (node) =>
  Array.isArray(node) && node[0].toLowerCase() === "para";
const isHeader = (node) =>
  Array.isArray(node) && node[0].toLowerCase().includes("header");

const isTag = (node) => isPara(node) && String(node[1]).startsWith("<");
const isOpenTag = (node) => isTag(node) && !String(node[1]).startsWith("</");
const isCloseTag = (node) => isTag(node) && String(node[1]).startsWith("</");

const isOpenIntro = (node) => isOpenTag(node) && node[1].includes("Intro");
const isCloseIntro = (node) => isCloseTag(node) && node[1].includes("Intro");
const isDetails = (node) => isPara(node) && node[1].includes("details");

regex = new RegExp(`(?<=>)([\\s\\S]*)(?=</YouWillLearn>)`, "gim");
regex = new RegExp(`(?<=<YouWillLearn>)([\\s\\S]*)(?=</YouWillLearn>)`, "gim");
regex = new RegExp(
  `(?<=^#{1,3} .*\r?\n)([\\s\\S]*)(?=\r\n<Diagram name)`,
  "gim"
); */

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

regex = /(?<=^#{1,3} .*\r?\n)([\s\S]*\n)(?=<Diagram)/gim;

async function parseMarkdownFile(content) {
  const tree = md.parse(content);

  let translatedTree = [];
  let toTranslate = [];
  let isStart = false;
  let lines = "";
  for (const node of tree) {
    translatedTree.push(node);
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

    if (isOpenIntro(node) || isHeader(node)) {
      isStart = true;
    }
    lines = lines + JSON.stringify(node) + "\n";
  }

  //console.log(toTranslate.map((node) => JSON.stringify(node)).join("\n"));

  let translated = translatedTree
    .map((node) => JSON.stringify(node))
    .join("\n");

  console.log(md.renderJsonML(md.toHTMLTree(tree)));

  return [lines, translated];
}
