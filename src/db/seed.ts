import { existsSync } from "fs";
import { resolve } from "path";

const filename = process.argv[2];

if (!filename) {
  console.error("Please provide filename");
  process.exit(1);
}

const path = resolve(__dirname, `./seeders/${filename}.ts`);

if (!existsSync(path)) {
  console.error(`File '${filename}' not found`);
  process.exit(1);
}

(async () => {
  try {
    const seeder = require(path);
    if (seeder && typeof seeder?.run !== "function") {
      throw new Error(
        `Seeder '${filename}' must have an exportable 'run' function`,
      );
    }

    await seeder.run();
    console.log("done");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
