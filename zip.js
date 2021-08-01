const fs = require("fs");
const archiver = require("archiver");

const path_firefox_source = fs.createWriteStream(
  __dirname + "/firefox_source.zip"
);
const path_chrome_source = fs.createWriteStream(
  __dirname + "/chrome_source.zip"
);
const path_firefox_addon = fs.createWriteStream(
  __dirname + "/firefox_addon.zip"
);
const path_chrome_addon = fs.createWriteStream(__dirname + "/chrome_addon.zip");

const archive_firefox_source = archiver("zip", {
  zlib: { level: 9 },
});
const archive_chrome_source = archiver("zip", {
  zlib: { level: 9 },
});
const archive_firefox_addon = archiver("zip", {
  zlib: { level: 9 },
});
const archive_chrome_addon = archiver("zip", {
  zlib: { level: 9 },
});

archive_firefox_source.directory("./firefox/src", "src");
archive_firefox_source.file("./firefox/FORREVIEWER.md", { name: "README.md" });
archive_firefox_source.file("./firefox/rollup.config.js", {
  name: "rollup.config.js",
});
archive_firefox_source.file("./firefox/svelte.config.js", {
  name: "svelte.config.js",
});
archive_firefox_source.file("./firefox/tsconfig.json", {
  name: "tsconfig.json",
});
archive_firefox_source.file("./firefox/package.json", { name: "package.json" });

archive_chrome_source.directory("./chrome/src", "src");
archive_chrome_source.file("./chrome/FORREVIEWER.md", { name: "README.md" });
archive_chrome_source.file("./chrome/rollup.config.js", {
  name: "rollup.config.js",
});
archive_chrome_source.file("./chrome/svelte.config.js", {
  name: "svelte.config.js",
});
archive_chrome_source.file("./chrome/tsconfig.json", { name: "tsconfig.json" });
archive_chrome_source.file("./chrome/package.json", { name: "package.json" });

archive_firefox_addon.directory("./firefox/public", false);
archive_chrome_addon.directory("./chrome/public", false);

archive_firefox_source.pipe(path_firefox_source);
archive_chrome_source.pipe(path_chrome_source);
archive_firefox_addon.pipe(path_firefox_addon);
archive_firefox_addon.pipe(path_chrome_addon);

archive_firefox_source.finalize();
archive_chrome_source.finalize();
archive_firefox_addon.finalize();
archive_chrome_addon.finalize();

console.log("finite");

//mi povus malpligrandigi ĉi tion sed mi ne havas tempon nun.
