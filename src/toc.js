const fs = require("fs");
const path = require("path");

class TableOfContents {
  constructor(options) {
    this.filePath = options.filePath;
    this.entries = new Map();

    // fill up entries map
    if (options.entries) {
      for (let key in options.entries) {
        this.entries.set(key, options.entries[key]);
      }
    }

    this.flush = this.flush.bind(this);
    this.set = this.set.bind(this);
    this.keys = this.keys.bind(this);
    this.get = this.get.bind(this);
  }

  flush() {
    return new Promise((resolve) => {
      const data = {};
      this.entries.forEach((value, key) => (data[key] = value));

      const content = JSON.stringify(data, null, 2);
      fs.writeFile(this.filePath, content, () => resolve());
    });
  }

  async set(key, metaData) {
    this.entries.set(key, metaData);
    await this.flush();
  }

  keys() {
    return new Promise((resolve) => {
      resolve(this.entries.keys());
    });
  }

  get(key) {
    return new Promise((resolve) => {
      const result = this.entries.get(key);
      resolve(result);
    });
  }

  static loadFrom(filePath) {
    let content = "{}";
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, {
        encoding: "utf8",
      });
    }

    return new TableOfContents({
      filePath: filePath,
      entries: JSON.parse(content),
    });
  }
}

module.exports = TableOfContents;
