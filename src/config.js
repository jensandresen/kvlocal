const path = require("path");

function getDataDir() {
  const dataDir = process.env.KVLOCAL_DATA_DIR;

  if (!dataDir) {
    throw new Error("Data dir has not been defined!");
  }

  return path.resolve(dataDir);
}

function getTOCFilePath() {
  return path.resolve(getDataDir(), "toc.json");
}

exports.getDataDir = getDataDir;
exports.getTOCFilePath = getTOCFilePath;
