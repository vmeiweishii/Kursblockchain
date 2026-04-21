import { execSync } from "node:child_process";

const ports = [8545, 3001, 5173, 5174];

function pidsByPort(port) {
  try {
    const out = execSync(`ss -ltnp '( sport = :${port} )'`, { encoding: "utf8" });
    const matches = [...out.matchAll(/pid=(\d+)/g)];
    return [...new Set(matches.map((m) => Number(m[1])))];
  } catch {
    return [];
  }
}

const allPids = [...new Set(ports.flatMap(pidsByPort))];

if (allPids.length === 0) {
  console.log("No local stack processes found.");
  process.exit(0);
}

for (const pid of allPids) {
  try {
    process.kill(pid, "SIGTERM");
    console.log(`Stopped PID ${pid}`);
  } catch (error) {
    console.warn(`Could not stop PID ${pid}: ${error.message}`);
  }
}

console.log("Stop signal sent to local stack processes.");
