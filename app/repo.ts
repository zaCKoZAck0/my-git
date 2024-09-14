import * as fs from 'fs';
import { unzipSync } from 'zlib';

export class GitRepository {
    init() {
        fs.mkdirSync(".git", { recursive: true });
        fs.mkdirSync(".git/objects", { recursive: true });
        fs.mkdirSync(".git/refs", { recursive: true });
        fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");
        console.log("Initialized git directory");
    }

    catFile(hash: string) {
        const object = fs.readFileSync(`.git/objects/${hash.slice(0, 2)}/${hash.slice(2)}`);
        const decompressed = unzipSync(object);
        process.stdout.write(decompressed.toString()); 
    }
}