import * as fs from 'fs';
import { deflateSync, inflateSync, unzipSync,  } from 'zlib';
import { createHash } from 'crypto';

export class GitRepository {
    init(): boolean {
        try {
        fs.mkdirSync(".git", { recursive: true });
        fs.mkdirSync(".git/objects", { recursive: true });
        fs.mkdirSync(".git/refs", { recursive: true });
        fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");
        return true;
        } catch (error) {
            console.error("Failed to initialize git directory", error);
            return false;
        }
    }

    catFile(hash: string): string {
        const object = fs.readFileSync(`.git/objects/${hash.slice(0, 2)}/${hash.slice(2)}`);
        const decompressed = inflateSync(object);
        const nullByteIndex = decompressed.indexOf(0);
        return decompressed.subarray(nullByteIndex + 1).toString(); 
    }

    hashObject(filePath: string, write: boolean): string {
        const data = fs.readFileSync(filePath);
        const header = `blob ${data.length}\0`;
        const store = header + data;
        const hash = createHash('sha1').update(store).digest('hex');
        const objectPath = `.git/objects/${hash.slice(0, 2)}/${hash.slice(2)}`;
        // Check if the same object already exists in repository and if the write flag is set
        if (write && !fs.existsSync(objectPath)) {
            const compressed = deflateSync(store);
            fs.mkdirSync(`.git/objects/${hash.slice(0, 2)}`, { recursive: true });
            fs.writeFileSync(objectPath, compressed);
        }
        return hash;
    }

    lsTree(hash: string, nameOnly: boolean): string {
        const tree = fs.readFileSync(`.git/objects/${hash.slice(0, 2)}/${hash.slice(2)}`);
        const uncompressed = inflateSync(tree);
        const entries = uncompressed
            .toString()
            .split('\0')
            .slice(1, -1)
            .reduce((acc: string[], entry: string) => {
                const [mode, name, hash] = entry.split(' ');
                acc.push(nameOnly ? name : `${mode} ${hash} ${name}`);
                return acc;
            }, [])
            ;
        return entries.join("\n");
    }

    writeTree(): string {
        const tree = fs.readdirSync(".")
        console.log(tree)
        return ""
    } 
}