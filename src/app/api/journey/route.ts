import { NextRequest, NextResponse } from "next/server";
import { runClaude, extractJson } from "@/lib/claude-cli";
import { Journey, JourneyMilestone } from "@/lib/types";

interface RawJourney {
  startingPoint: string;
  endState: string;
  totalDuration: string;
  milestones: Omit<JourneyMilestone, "id">[];
}

export async function POST(req: NextRequest) {
  try {
    const { target, profile } = await req.json();

    const prompt = `You are MentorPath, an AI career mentor. Build a realistic, motivating learning journey for this person toward their target career.

About them:
- Name: ${profile.name}
- Age range: ${profile.ageRange}
- Primary goal: ${profile.primaryGoal}
- Interests: ${profile.interests.join(", ")}
- Things they want to avoid: ${profile.aversions.join(", ")}

Target career / outcome: ${target}

Create a step-by-step journey from where they are RIGHT NOW (given their age range) to working in that career. Rules:
- 5 to 8 milestones, in chronological order.
- Milestone 1 is something they can start THIS WEEK. The last milestone is landing/succeeding in the target career.
- Be realistic about timeframes for their age (a middle schooler's journey looks different from an adult career-changer's).
- Each milestone needs concrete actions, not vague advice. Respect their aversions when choosing routes.
- Include the fun: each milestone has a "funFactor" — an enjoyable activity, hobby, or experience tied to that stage (the 80/20 rule: growth should include play).

Respond with ONLY a JSON object, no prose, in exactly this shape:
{
  "startingPoint": "one short sentence describing where they are today",
  "endState": "one short sentence describing the destination",
  "totalDuration": "e.g. '6-8 years' or '18 months'",
  "milestones": [
    {
      "title": "short milestone name",
      "timeframe": "e.g. 'Months 1-3' or 'Freshman year'",
      "description": "2-3 sentences on what this stage is about and why it matters",
      "actions": ["3-4 concrete actions"],
      "skills": ["2-3 skills gained"],
      "funFactor": "one enjoyable activity for this stage"
    }
  ]
}`;

    const output = await runClaude(prompt);
    const raw = extractJson<RawJourney>(output);

    const journey: Journey = {
      target,
      startingPoint: raw.startingPoint,
      endState: raw.endState,
      totalDuration: raw.totalDuration,
      milestones: raw.milestones.map((m, i) => ({ ...m, id: `m${i}` })),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ journey });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Journey API error:", detail);
    return NextResponse.json(
      { error: "Failed to generate journey.", detail },
      { status: 500 }
    );
  }
}
