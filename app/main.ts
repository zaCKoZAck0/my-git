import { GitRepository } from "./repo";

const args = process.argv.slice(2);
const command = args[0];

enum Commands {
    INIT = "init",
    CAT_FILE = "cat-file",
    HASH_OBJECT = "hash-object",
    LS_TREE = "ls-tree",
}

const repo = new GitRepository();

switch (command) {
    case Commands.INIT:
        const success: boolean = repo.init();
        success ? 
            console.log("Initialized git repository") 
                : console.error("Failed to initialize git repository");
        break;

    case Commands.CAT_FILE:
        const hash = args[2];
        const contents: string =  repo.catFile(hash);
        process.stdout.write(contents);
        break;
    
    case Commands.HASH_OBJECT:
        const write = args.includes("--write") || args.includes("-w");
        const filePath = args[args.length - 1];
        const hashedObject: string = repo.hashObject(filePath, write);
        process.stdout.write(hashedObject);
        break;
    case Commands.LS_TREE:
        const nameOnly = args.includes("--name-only");
        const treeHash = args[args.length - 1];
        const tree: string = repo.lsTree(treeHash, nameOnly);
        process.stdout.write(tree);
        break;
    default:
        throw new Error(`Unknown command ${command}`);
}
