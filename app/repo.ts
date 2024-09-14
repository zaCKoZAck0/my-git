import * as fs from 'fs';
import { unzipSync } from 'zlib';
import { createHash } from 'crypto';

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
        const nullByteIndex = decompressed.indexOf(0);
        process.stdout.write(decompressed.subarray(nullByteIndex + 1).toString()); 
    }

    hashObject(filePath: string, write: boolean) {
        const data = fs.readFileSync(filePath);
        const header = `blob ${data.length}\0`;
        const store = header + data;
        const hash = createHash('sha1').update(store).digest('hex');
        const objectPath = `.git/objects/${hash.slice(0, 2)}/${hash.slice(2)}`;
        // Check if the same object already exists in repository and if the write flag is set
        if (write && !fs.existsSync(objectPath)) {
            fs.mkdirSync(`.git/objects/${hash.slice(0, 2)}`, { recursive: true });
            fs.writeFileSync(objectPath, store);
        }
        process.stdout.write(hash);
    }
}