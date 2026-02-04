import { build } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../');
const browser = process.env.BROWSER || 'chrome';
const mode = process.env.NODE_ENV || 'development';
const isProd = mode === 'production';
const distDir = path.resolve(projectRoot, `dist/${mode}/${browser}`);

console.log(`Building for ${browser} in ${mode} mode...`);

// Ensure dist dir exists
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Build 1: Main Scripts (IIFE) - Build each input separately
const inputs = {
    background: path.resolve(projectRoot, `src/background/${browser}.js`),
    content: path.resolve(projectRoot, `src/content_scripts/${browser}.js`),
    'pages/frontend': path.resolve(projectRoot, `src/content_scripts/ui/frontend.js`),
    'pages/start': path.resolve(projectRoot, 'src/content_scripts/start.js'),
    'pages/ace': path.resolve(projectRoot, 'src/content_scripts/ace.js'),
};

if (browser !== "safari") {
    inputs['pages/markdown'] = path.resolve(projectRoot, 'src/content_scripts/markdown.js');
}

for (const [name, entryPath] of Object.entries(inputs)) {
    console.log(`Building ${name}...`);
    try {
        await build({
            root: projectRoot,
            configFile: false,
            logLevel: 'info',
            build: {
                outDir: distDir,
                emptyOutDir: false,
                minify: isProd,
                sourcemap: !isProd,
                target: 'es2020',
                rollupOptions: {
                    input: { [name]: entryPath },
                    external: (id) => {
                        // console.log('External check:', id);
                        if (id.includes('./ace.js') || id.includes('./pages/options.js')) {
                            return true;
                        }
                        return false;
                    },
                    output: {
                        format: name === 'pages/ace' ? 'es' : 'iife',
                        entryFileNames: '[name].js',
                        name: 'SurfingKeys_' + name.replace(/[\/-]/g, '_'),
                        extend: true,
                    },
                    onwarn(warning, warn) {
                        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
                        warn(warning);
                    }
                }
            }
        });
    } catch (e) {
        console.error(`Build failed (${name}):`, e);
        process.exit(1);
    }
}

// Build 2: Options (ESM)
try {
    await build({
        root: projectRoot,
        configFile: false,
        logLevel: 'info',
        build: {
            outDir: path.resolve(distDir, 'pages'),
            emptyOutDir: false,
            minify: isProd,
            sourcemap: !isProd,
            target: 'es2020',
            lib: {
                entry: path.resolve(projectRoot, 'src/content_scripts/options.js'),
                formats: ['es'],
                fileName: () => 'options.js'
            },
            rollupOptions: {
                external: ['ace'], // Just in case
            }
        }
    });
} catch (e) {
    console.error("Build failed (Options):", e);
    process.exit(1);
}

// Copy logic
console.log('Copying assets...');

function shouldIgnore(name, ignores) {
    for (const pattern of ignores) {
        if (pattern.startsWith('**/')) {
            const suffix = pattern.substring(3); // e.g. "neovim.*"
            if (suffix.endsWith('.*')) {
                const prefix = suffix.slice(0, -2); // "neovim"
                if (name.startsWith(prefix)) return true;
            } else if (name === suffix) {
                return true;
            }
        }
    }
    return false;
}

const pagesIgnore = ['**/neovim.*', '**/pdf_viewer.html'];
if (browser === "safari") {
    pagesIgnore.push('**/markdown.html', '**/donation.png');
}

// Copy pages with filter
fs.cpSync(path.resolve(projectRoot, 'src/pages'), path.resolve(distDir, 'pages'), {
    recursive: true,
    filter: (src) => {
        const basename = path.basename(src);
        return !shouldIgnore(basename, pagesIgnore);
    }
});

// Other copies
const specificCopies = [
    { from: 'src/content_scripts/ui/frontend.html', to: 'pages/frontend.html' },
    { from: 'src/content_scripts/ui/frontend.css', to: 'pages/frontend.css' },
    { from: 'node_modules/ace-builds/src-noconflict/worker-javascript.js', to: 'pages/worker-javascript.js' },
    { from: 'src/icons', to: 'icons', isDir: true },
    { from: 'src/content_scripts/content.css', to: 'content.css' }
];

for (const { from, to, isDir } of specificCopies) {
    const srcPath = path.resolve(projectRoot, from);
    const destPath = path.resolve(distDir, to);
    if (fs.existsSync(srcPath)) {
        // Ensure dest dir exists
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

        if (isDir) {
            fs.cpSync(srcPath, destPath, { recursive: true });
        } else {
             fs.cpSync(srcPath, destPath);
        }
    } else {
        console.warn(`Warning: Source file not found: ${from}`);
    }
}

// Manifest
try {
    const manifestBuffer = fs.readFileSync(path.resolve(projectRoot, 'src/manifest.json'));
    const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));
    let manifest = JSON.parse(manifestBuffer.toString());

    manifest.version = pkg.version;

    if (browser === "firefox") {
        manifest.options_ui = { page: "pages/options.html" };
    } else if (browser === "safari") {
        manifest.incognito = "split";
        manifest.options_page = "pages/options.html";
        manifest.background.persistent = false;
    } else {
        manifest.permissions.push("downloads.shelf");
        manifest.background.persistent = false;
        manifest.incognito = "split";
        manifest.options_page = "pages/options.html";
        if (mode === "development") {
            manifest.key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAneIRqYRqG/0RoYzpWoyeeO8KxxvWZvIabABbeQyHQ2PFOf81j/O5J28HGAEQJ56AptKMTcTeG2qZga9B2u9k98OmRcGp8BDco6fh1vD6/x0fWfehPeub5IcEcQmCd1lBuVa8AtUqV3C+He5rS4g8dB8g8GRlSPPSiDSVNMv+iwKAk7TbM3TKz6DyFO8eCtWXr6wJCcYeJA+Mub7o8DKIHKgv8XH8+GbJGjeeIUBU7mlGlyS7ivdsG1V6D2/Ldx0O1e6sRn7f9jiC4Xy1N+zgZ7BshYbnlbwedomg1d5kuo5m4rS+8BgTchPPkhkvEs62MI4e+fmQd0oGgs7PtMSrTwIDAQAb";
        }
    }

    fs.writeFileSync(path.resolve(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
} catch (e) {
    console.error("Manifest modification failed:", e);
    process.exit(1);
}

console.log('Build complete.');
