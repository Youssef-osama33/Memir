import { spawn } from 'child_process';

const args = process.argv.slice(2);
const cleanArgs = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--host') {
    if (args[i + 1] && !args[i + 1].startsWith('-')) {
      cleanArgs.push('-H', args[i + 1]);
      i++;
    }
  } else if (args[i].startsWith('--host=')) {
    cleanArgs.push('-H', args[i].split('=')[1]);
  } else {
    cleanArgs.push(args[i]);
  }
}

const child = spawn('npx', ['next', 'dev', ...cleanArgs], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
