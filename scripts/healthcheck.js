const backendUrl = process.env.BACKEND_HEALTH_URL || "http://127.0.0.1:3001/health";
const frontendUrl = process.env.FRONTEND_HEALTH_URL || "http://127.0.0.1:5173";
const fallbackFrontendUrl = process.env.FRONTEND_HEALTH_URL_FALLBACK || "http://127.0.0.1:5174";

async function checkBackend() {
  const res = await fetch(backendUrl);
  if (!res.ok) throw new Error(`Backend health failed: ${res.status}`);
  const data = await res.json();
  if (!data.ok) throw new Error("Backend health payload invalid");
}

async function checkFrontend() {
  const urls = [frontendUrl, fallbackFrontendUrl];
  let lastError = null;

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Frontend health failed: ${res.status} (${url})`);
      const html = await res.text();
      if (!html.includes('id="root"')) throw new Error(`Frontend HTML is invalid (${url})`);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

try {
  await checkBackend();
  await checkFrontend();
  console.log("Healthcheck passed: backend and frontend are reachable.");
} catch (error) {
  console.error(`Healthcheck failed: ${error.message}`);
  process.exit(1);
}
