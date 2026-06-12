import { spawn } from "child_process";
import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

let cachedClaudePath: string | null = null;

function findClaude(): string {
  if (cachedClaudePath) return cachedClaudePath;

  // Explicit override first: set CLAUDE_CLI_PATH in .env.local if needed.
  if (process.env.CLAUDE_CLI_PATH && existsSync(process.env.CLAUDE_CLI_PATH)) {
    cachedClaudePath = process.env.CLAUDE_CLI_PATH;
    return cachedClaudePath;
  }

  const home = homedir();
  const candidates =
    process.platform === "win32"
      ? [
          join(home, ".local", "bin", "claude.exe"),
          join(home, ".local", "bin", "claude.cmd"),
          join(home, ".local", "bin", "claude"),
          join(home, "AppData", "Roaming", "npm", "claude.cmd"),
          join(home, "AppData", "Roaming", "npm", "claude.exe"),
          join(home, ".claude", "local", "claude.exe"),
          join(home, "scoop", "shims", "claude.exe"),
          join(home, "AppData", "Local", "Volta", "bin", "claude.exe"),
          "C:\\Program Files\\nodejs\\claude.cmd",
        ]
      : [
          join(home, ".local", "bin", "claude"),
          join(home, ".claude", "local", "claude"),
          "/usr/local/bin/claude",
          "/opt/homebrew/bin/claude",
        ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      cachedClaudePath = candidate;
      return cachedClaudePath;
    }
  }

  // Fall back to PATH lookup.
  return "claude";
}

export function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Strip Claude Code session vars so a nested CLI invocation doesn't
    // inherit flags/behavior from a parent session.
    const env = { ...process.env };
    for (const key of Object.keys(env)) {
      if (key.startsWith("CLAUDE_CODE_") || key === "CLAUDECODE") {
        delete env[key];
      }
    }

    const useShell = process.platform === "win32";
    const claudePath = findClaude();
    // .cmd shims on Windows require a shell to execute; quote the path in
    // case it contains spaces (the shell does no escaping for us).
    const command =
      useShell && claudePath.includes(" ") ? `"${claudePath}"` : claudePath;
    const child = spawn(command, ["--print", "--output-format", "text"], {
      env,
      shell: useShell,
      timeout: 180_000,
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));

    child.on("error", (err) => {
      reject(
        new Error(
          `Failed to launch claude CLI: ${err.message}. Is it installed and on PATH?`
        )
      );
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(
          new Error(
            `claude CLI (${claudePath}) exited with code ${code}: ${stderr || stdout}. ` +
              `If the CLI isn't being found, set CLAUDE_CLI_PATH to its full path in .env.local and restart the dev server.`
          )
        );
      }
    });

    // Pass the prompt via stdin to avoid arg-length limits and quoting issues.
    child.stdin.write(prompt);
    child.stdin.end();
  });
}

/**
 * Extract a JSON object/array from CLI output that may have prose around it
 * or a markdown code fence.
 */
export function extractJson<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.search(/[[{]/);
  if (start === -1) throw new Error("No JSON found in CLI output");
  // Walk back from the end to the last closing bracket.
  const end = Math.max(
    candidate.lastIndexOf("}"),
    candidate.lastIndexOf("]")
  );
  return JSON.parse(candidate.slice(start, end + 1)) as T;
}
