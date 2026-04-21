import net from "net";

const ports = [8545, 3001, 5173];

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve({ port, free: false }));
    server.once("listening", () => {
      server.close(() => resolve({ port, free: true }));
    });
    server.listen(port, "127.0.0.1");
  });
}

const results = await Promise.all(ports.map(checkPort));
const busy = results.filter((x) => !x.free);

if (busy.length > 0) {
  console.error(
    `Busy ports: ${busy.map((x) => x.port).join(", ")}. Stop running processes and retry.`,
  );
  process.exit(1);
}

console.log(`Ports are free: ${ports.join(", ")}`);
