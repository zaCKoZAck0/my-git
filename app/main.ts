import { GitRepository } from "./repo";

const args = process.argv.slice(2);
const command = args[0];

enum Commands {
    INIT = "init",
    CAT_FILE = "cat-file",
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
        
    default:
        throw new Error(`Unknown command ${command}`);
}
