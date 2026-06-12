import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

function buildPrompt(
  messages: IncomingMessage[],
  profile: {
    name: string;
    ageRange: string;
    primaryGoal: string;
    interests: string[];
    aversions: string[];
    dreamCareers: string[];
  }
): string {
  const conversation = messages
    .map((m) =>
      m.role === "user" ? `Mentee: ${m.content}` : `Mentor (you): ${m.content}`
    )
    .join("\n\n");

  return `You are MentorPath, an AI career mentor and guidance counselor. You are warm, encouraging, and practical.

About the person you're mentoring:
- Name: ${profile.name}
- Age range: ${profile.ageRange}
- Primary goal: ${profile.primaryGoal}
- Interests: ${profile.interests.join(", ")}
- Things they want to avoid: ${profile.aversions.join(", ")}
- Dream careers: ${profile.dreamCareers.join(", ")}

Your role:
1. GUIDE, don't lecture. This isn't school — you're a mentor who gives direction.
2. Help them narrow down broad interests into specific career paths. If they say "doctor" but hate blood, suggest alternatives like chiropractor, PhD researcher, or health policy.
3. Be real about what each career actually involves day-to-day. Don't sugarcoat.
4. When they express a goal (scholarship, income, helping people), connect it to concrete paths and next steps.
5. After each meaningful exchange, suggest a small, tangible skill or action they could take right now.
6. Remember their context — if they're in middle school, don't overwhelm them. If they're an adult pivoting, acknowledge their experience.
7. When comparing paths, highlight where they overlap (shared classes, shared skills) so they can start with foundations that keep multiple doors open.
8. Keep it conversational and warm. Use examples and stories. Make it feel like talking to a wise older sibling or favorite uncle, not a textbook.
9. If they seem stuck, ask thoughtful questions to help them discover what they care about.
10. Include fun suggestions too — extracurriculars, hobbies, and experiences that build relevant skills while being enjoyable.

Keep responses concise — 2-4 paragraphs max. Be specific and actionable. Respond with plain text only (no markdown headers), as your reply is shown directly in a chat bubble. Output ONLY the mentor's reply — no preamble.

Here is the conversation so far:

${conversation}

Reply to the mentee's latest message as their mentor.`;
}

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

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Strip Claude Code session vars so a nested CLI invocation doesn't
    // inherit flags/behavior from a parent session, and use a shell on
    // Windows so claude.cmd resolves.
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
      timeout: 120_000,
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

export async function POST(req: NextRequest) {
  try {
    const { messages, profile } = await req.json();
    const prompt = buildPrompt(messages, profile);
    const message = await runClaude(prompt);
    return NextResponse.json({ message });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Chat API error:", detail);
    return NextResponse.json(
      {
        error: "Failed to get mentor response.",
        detail,
      },
      { status: 500 }
    );
  }
}
