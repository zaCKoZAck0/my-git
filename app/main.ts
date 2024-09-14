import { GitRepository } from "./repo";

const args = process.argv.slice(2);
const command = args[0];

enum Commands {
    INIT = "init",
    CAT_FILE = "cat-file",
    HASH_OBJECT = "hash-object",
}

const repo = new GitRepository();

switch (command) {
    case Commands.INIT:
        repo.init();
        break;

    case Commands.CAT_FILE:
        const hash = args[2];
        repo.catFile(hash);
        break;
    
    case Commands.HASH_OBJECT:
        const write = args.includes("--write") || args.includes("-w");
        const filePath = args[args.length - 1];
        repo.hashObject(filePath, write);
        break;
    default:
        throw new Error(`Unknown command ${command}`);
}
