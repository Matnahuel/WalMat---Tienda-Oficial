const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const srcIndex = path.join(projectRoot, 'src', 'index.js');
const rootIndex = path.join(projectRoot, 'index.js');
const backupIndex = srcIndex + '.backup-from-start-script';

function fileExists(p) {
  try {
    return fs.existsSync(p);
  } catch (e) {
    return false;
  }
}

let backedUp = false;
let createdCopy = false;

try {
  if (!fileExists(rootIndex)) {
    console.error('Error: no se encontró `index.js` en la raíz del proyecto:', rootIndex);
    process.exit(1);
  }

  if (fileExists(srcIndex)) {
    // Move existing src/index.js aside so we can restore it later
    fs.renameSync(srcIndex, backupIndex);
    backedUp = true;
    console.log('Se hizo backup de `src/index.js` a', backupIndex);
  }

  // Read root index.js, rewrite imports that point to './src/...' to './...'
  // so the file works when placed under `src/`.
  let content = fs.readFileSync(rootIndex, 'utf8');
  // Replace Common patterns: from './src/...', from "./src/...", require('./src/...')
  content = content.replace(/from\s+['"]\.\/src\//g, "from './");
  content = content.replace(/require\(\s*['"]\.\/src\//g, "require('./");
  // Also handle double quotes
  content = content.replace(/from\s+\"\.\/src\//g, 'from "./');

  fs.writeFileSync(srcIndex, content, 'utf8');
  createdCopy = true;
  console.log('Copiado temporalmente `index.js` a `src/index.js` (imports ajustadas)');
} catch (err) {
  console.error('Error al preparar archivo temporal:', err);
  cleanupAndExit(1);
}

// Resolve react-scripts start script and run it with node
let reactStartPath;
try {
  reactStartPath = require.resolve('react-scripts/scripts/start', { paths: [projectRoot] });
} catch (err) {
  console.error('No se pudo resolver `react-scripts`. Asegúrate de haber ejecutado `npm install`.', err);
  cleanupAndExit(1);
}

const child = spawn(process.execPath, [reactStartPath], { stdio: 'inherit' });

child.on('exit', (code, signal) => {
  cleanupAndExit(code);
});

child.on('error', (err) => {
  console.error('Error al ejecutar react-scripts start:', err);
  cleanupAndExit(1);
});

function cleanupAndExit(code) {
  try {
    if (createdCopy && fileExists(srcIndex)) {
      fs.unlinkSync(srcIndex);
      console.log('Eliminado `src/index.js` temporal');
    }
    if (backedUp && fileExists(backupIndex)) {
      fs.renameSync(backupIndex, srcIndex);
      console.log('Restaurado backup de `src/index.js`');
    }
  } catch (err) {
    console.warn('Advertencia: error durante la limpieza:', err);
  }
  process.exit(typeof code === 'number' ? code : 0);
}

// Forward signals to the child process so react-scripts can handle them
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((sig) => {
  process.on(sig, () => {
    if (child && child.pid) {
      try { child.kill(sig); } catch (e) {}
    }
  });
});
