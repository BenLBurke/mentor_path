import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, profile } = await req.json();

    const systemPrompt = `You are MentorPath, an AI career mentor and guidance counselor. You are warm, encouraging, and practical.

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

Keep responses concise — 2-4 paragraphs max. Be specific and actionable. Respond with plain text only (no markdown headers), as your reply is shown directly in a chat bubble.`;

    // The claude CLI is single-prompt, so serialize the conversation
    // history into the prompt to preserve multi-turn context.
    const conversation = (messages as IncomingMessage[])
      .map((m) =>
        m.role === "user" ? `Mentee: ${m.content}` : `Mentor (you): ${m.content}`
      )
      .join("\n\n");

    const prompt = `Here is the conversation so far:\n\n${conversation}\n\nReply to the mentee's latest message as their mentor.`;

    const { stdout } = await execFileAsync(
      "claude",
      [
        "-p",
        prompt,
        "--system-prompt",
        systemPrompt,
        "--output-format",
        "text",
      ],
      { timeout: 120_000, maxBuffer: 1024 * 1024 }
    );

    return NextResponse.json({ message: stdout.trim() });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to get mentor response. Make sure the `claude` CLI is installed and authenticated (run `claude` once to log in).",
      },
      { status: 500 }
    );
  }
}
