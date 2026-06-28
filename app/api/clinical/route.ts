import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { patientName, age, gender, weight, symptoms, duration, vitals, history_text } = body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are a clinical decision support system for doctors in Africa. Based on WHO guidelines and MSD Manual, analyze this case and respond ONLY in JSON format with no markdown.

Patient: ${patientName || "Unknown"}, Age: ${age || "Unknown"}, Gender: ${gender || "Unknown"}, Weight: ${weight || "Unknown"}kg
Symptoms: ${symptoms}
Duration: ${duration || "Not specified"}
Vitals: ${vitals || "Not recorded"}
Medical history: ${history_text || "None"}

Respond with this exact JSON structure:
{
  "diagnosis": "most likely diagnosis",
  "differentials": ["differential 1", "differential 2", "differential 3"],
  "urgency": "high/medium/low",
  "soap_note": "S: [subjective]\nO: [objective]\nA: [assessment]\nP: [plan]",
  "drug_guidance": "recommended treatment with dosages",
  "red_flags": ["red flag 1", "red flag 2"],
  "follow_up": "follow up recommendation"
}`
      }]
    })
  });

  const data = await response.json();
  const text = data.content[0].text;
  const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
  return NextResponse.json(parsed);
}
