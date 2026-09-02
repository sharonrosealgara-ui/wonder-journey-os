const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync, spawn } = require('child_process');

const binDir = path.join(__dirname, '../bin');
const exeName = process.platform === 'win32' ? 'livekit-server.exe' : 'livekit-server';
const exePath = path.join(binDir, exeName);

async function downloadBinary() {
  if (fs.existsSync(exePath)) {
    console.log(`[LIVEKIT] Official server binary present at ${exePath}`);
    return exePath;
  }

  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }

  const isWin = process.platform === 'win32';
  const url = isWin
    ? 'https://github.com/livekit/livekit/releases/download/v1.13.5/livekit_1.13.5_windows_amd64.zip'
    : 'https://github.com/livekit/livekit/releases/download/v1.13.5/livekit_1.13.5_linux_amd64.tar.gz';

  const archivePath = path.join(binDir, isWin ? 'livekit.zip' : 'livekit.tar.gz');
  console.log(`[LIVEKIT] Downloading official LiveKit server v1.13.5 for ${process.platform}...`);

  await new Promise((resolve, reject) => {
    function fetchUrl(targetUrl) {
      https.get(targetUrl, { headers: { 'User-Agent': 'WonderJourneyLiveKitInstaller/1.0' } }, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          return fetchUrl(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to download LiveKit binary: HTTP ${res.statusCode}`));
        }
        const fileStream = fs.createWriteStream(archivePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close(() => {
            console.log('[LIVEKIT] Archive downloaded. Extracting...');
            try {
              if (isWin) {
                execSync(`powershell -Command "Expand-Archive -Path '${archivePath}' -DestinationPath '${binDir}' -Force"`, { stdio: 'ignore' });
              } else {
                execSync(`tar -xzf "${archivePath}" -C "${binDir}"`, { stdio: 'inherit' });
                execSync(`chmod +x "${exePath}"`);
              }
              console.log(`[LIVEKIT] Extracted successfully to ${exePath}`);
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        });
      }).on('error', reject);
    }
    fetchUrl(url);
  });

  return exePath;
}

async function startOfficialLiveKitServer(port = 7880) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("LIVEKIT_API_KEY and LIVEKIT_API_SECRET environment variables are required to start LiveKit server.");
  }

  try {
    const res = await fetch(`http://127.0.0.1:${port}/`);
    if (res.status === 200 || res.status === 404 || res.status === 400) {
      console.log(`[LIVEKIT] Official LiveKit server already active and healthy on ws://127.0.0.1:${port}`);
      return { kill: () => {}, pid: 0, isReused: true };
    }
  } catch (e) {}

  const binary = await downloadBinary();
  console.log(`[LIVEKIT] Launching official LiveKit server on port ${port}...`);

  // Write a dedicated livekit dev config to bind port and dynamic ephemeral keys
  const configPath = path.join(binDir, 'livekit-dev-config.yaml');
  const yamlContent = `port: ${port}
bind_addresses:
  - 127.0.0.1
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 50050
  use_external_ip: false
keys:
  ${apiKey}: ${apiSecret}
logging:
  level: info
`;
  fs.writeFileSync(configPath, yamlContent, 'utf8');

  const proc = spawn(binary, [
    '--config', configPath,
    '--dev',
  ], {
    stdio: 'pipe',
  });

  proc.stdout.on('data', () => {});
  proc.stderr.on('data', () => {});

  // Wait for LiveKit to become responsive
  const start = Date.now();
  let online = false;
  while (Date.now() - start < 15000) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`);
      if (res.status === 200 || res.status === 404 || res.status === 400) {
        online = true;
        break;
      }
    } catch (e) {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  if (online) {
    console.log(`[LIVEKIT] Official LiveKit server verified healthy and accepting connections on ws://127.0.0.1:${port}`);
  } else {
    console.log(`[LIVEKIT] LiveKit server process spawned (PID ${proc.pid}) on port ${port}`);
  }

  return proc;
}

module.exports = {
  downloadBinary,
  startOfficialLiveKitServer,
  getLiveKitBinaryPath: () => exePath,
};

if (require.main === module) {
  startOfficialLiveKitServer().then((proc) => {
    console.log(`LiveKit Server running with PID ${proc.pid}. Press Ctrl+C to stop.`);
  }).catch((err) => {
    console.error('Failed to start LiveKit server:', err.message);
    process.exit(1);
  });
}
