import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, sep, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

let projectRoot;
try {
    projectRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
} catch (e) {
    console.error("\x1b[31mError: Not a git repository\x1b[0m");
    process.exit(1);
}

const fileExtensions = /\.(ts|js|html)$/;
const ignoredFolders = ['node_modules', '.angular', 'dist'];

try {
    const rawOutput = execSync('git diff --cached --name-only', {
        encoding: 'utf8',
        cwd: projectRoot
    });

    const stagedFiles = rawOutput
        .split('\n')
        .map(file => file.trim())
        .filter(file => {
            if (!file) return false;

            const fullPath = normalize(join(projectRoot, file));
            const isIgnored = ignoredFolders.some(folder => file.split(sep).includes(folder));
            const isSelf = fullPath === normalize(__filename);

            return fileExtensions.test(file) && existsSync(fullPath) && !isIgnored && !isSelf;
        });

    let foundLogs = false;

    stagedFiles.forEach(file => {
        const fullPath = join(projectRoot, file);
        const lines = readFileSync(fullPath, 'utf8').split('\n');
        const logRegex = /^(?!\s*\/\/).*console\.log/;

        lines.forEach((lineContent, index) => {
            if (logRegex.test(lineContent)) {
                const lineNumber = index + 1;
                const columnNumber = lineContent.indexOf('console.log') + 1;
                console.error(`\x1b[31mError: 'console.log' found in ${file}:${lineNumber}:${columnNumber}\x1b[0m`);
                foundLogs = true;
            }
        });
    });

    if (foundLogs) {
        process.exit(1);
    }

} catch (err) {
    console.error('Error running hook:', err.message);
    process.exit(1);
}