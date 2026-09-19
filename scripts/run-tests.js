const fs = require("fs");
const path = require("path");
const Mocha = require("mocha");

const testDir = path.join(__dirname, "../__tests__");

const mocha = new Mocha({
  timeout: 60000,
  reporter: "spec",
});

fs.readdirSync(testDir)
  .filter((file) => file.endsWith(".js"))
  .sort()
  .forEach((file) => {
    mocha.addFile(path.join(testDir, file));
  });

mocha.run((failures) => {
  process.exit(failures > 0 ? 1 : 0);
});
