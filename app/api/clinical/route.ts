import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { patientName, age, gender, weight, symptoms, duration, vitals, history_text } = await req.json();

    if (!symptoms) return NextResponse.json({ error: "Symptoms required" }, { status: 400 });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content: "You are a clinical decision support system for doctors in Africa. Based on WHO guidelines and MSD Manual, analyze cases and respond ONLY in valid JSON format with no markdown or extra text."
          },
          {
            role: "user",
            content: `Analyze this clinical case and respond ONLY with valid JSON, no markdown.
Patient: ${patientName || "Unknown"}, Age: ${age || "Unknown"}, Gender: ${gender || "Unknown"}, Weight: ${weight || "Unknown"}kg
Symptoms: ${symptoms}
Duration: ${duration || "Not specified"}
Vitals: ${vitals || "Not recorded"}
Medical history: ${history_text || "None"}

Return ONLY this JSON object:
{"diagnosis":"string","differentials":["string","string","string"],"urgency":"high|medium|low","soap_note":"string","drug_guidance":"string","red_flags":["string"],"follow_up":"string"}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error("No choices in response:", data);
      return NextResponse.json({ error: "No content" }, { status: 500 });
    }

    const text = data.choices[0].message.content;
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Clinical API error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
