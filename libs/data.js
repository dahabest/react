const deepl = require("deepl-node");

//const authKey = process.env.DL_API;
const authKey = "b3cc4f98-ab4c-429f-a168-ac12eabf5ef2:fx";
const translator = new deepl.Translator(authKey);

module.exports = {
  translator,
};
