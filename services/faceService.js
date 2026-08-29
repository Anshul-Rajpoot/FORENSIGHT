const { spawn } = require("child_process");
const path = require("path");
const crypto = require("crypto");

const pythonCommand =
  process.env.PYTHON_CMD || (process.platform === "win32" ? "python" : "python3");
const scriptPath = path.join(__dirname, "..", "python_service", "face_service.py");

let worker = null;
let buffer = "";
const pending = new Map();
let restartTimer = null;

function startWorker() {
  if (worker) return;

  worker = spawn(pythonCommand, [scriptPath], {
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
  });

  worker.stdout.on("data", (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const message = JSON.parse(line);
        const job = pending.get(message.id);
        if (!job) continue;
        pending.delete(message.id);
        if (message.ok) job.resolve(message.embedding);
        else job.reject(new Error(message.error || "Face service failed"));
      } catch (err) {
        console.error("Face service response error:", err.message);
      }
    }
  });

  worker.stderr.on("data", (chunk) => {
    console.error("[face-service]", chunk.toString().trim());
  });

  worker.on("error", (err) => {
    console.error("Could not start Python face service:", err.message);
  });

  worker.on("exit", (code) => {
    for (const [, job] of pending) job.reject(new Error("Face service stopped"));
    pending.clear();
    worker = null;
    buffer = "";
    if (restartTimer) clearTimeout(restartTimer);
    restartTimer = setTimeout(() => startWorker(), 1000);
    console.error(`Face service exited with code ${code}.`);
  });
}

function getEmbedding(fileBuffer) {
  startWorker();
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    pending.set(id, { resolve, reject });

    const payload = JSON.stringify({
      id,
      image: fileBuffer.toString("base64"),
    });

    try {
      worker.stdin.write(payload + "\n");
    } catch (err) {
      pending.delete(id);
      reject(err);
    }
  });
}

function stopWorker() {
  if (worker) worker.kill();
}

process.on("exit", stopWorker);

module.exports = { getEmbedding };
