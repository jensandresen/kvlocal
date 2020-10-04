const fs = require("fs");
const path = require("path");

class TableOfContents {
  constructor(options) {
    this.filePath = options.filePath;
    this.entries = options.entries;

    this.flush = this.flush.bind(this);
  }

  flush() {
    return new Promise((resolve) => {
      const content = JSON.stringify(this.entries, null, 2);
      fs.writeFile(this.filePath, content, () => resolve());
    });
  }

  static loadFrom(filePath) {
    const content = fs.readFileSync(filePath, {
      encoding: "utf8",
    });

    return new TableOfContents({
      filePath: filePath,
      entries: JSON.parse(content),
    });
  }
}

class FileSystemBasedProvider {
  constructor(options) {
    this.dataDir = options.dataDir;
    this.toc = options.toc;

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.exists = this.exists.bind(this);
  }

  async get(key) {
    path.resolve(this.dataDir);
  }

  async set(key, value, type) {
    const tocEntry = await this.toc.set(key, {
      type: type,
      valuePath: path.resolve(this.dataDir, key),
    });
  }

  static create() {
    const dataDir = process.env.KVLOCAL_DATA_DIR;

    if (!dataDir) {
      throw new Error("Data dir has not been defined!");
    }

    return new FileSystemBasedProvider({
      dataDir: path.resolve(dataDir),
      toc: TableOfContents.loadFrom(path.resolve(dataDir, ".toc")),
    });
  }
}

class Store {
  constructor(options) {
    this.provider = options.provider || FileSystemBasedProvider.create();

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.exists = this.exists.bind(this);
  }

  async get(key) {
    const value = await this.provider.get(key);

    if (value === null) {
      return undefined;
    }

    return value;
  }

  async set(key, value) {
    await this.provider.set(key, value);
  }

  async exists(key) {
    const result = await this.provider.exists(key);
    return result;
  }
}

module.exports = Store;
