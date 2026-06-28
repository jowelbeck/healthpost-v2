import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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
          content: `You are a clinical decision support system for doctors in Africa. Based on WHO guidelines and MSD Manual, analyze this case and respond ONLY in valid JSON format with no markdown or extra text.

Patient: ${patientName || "Unknown"}, Age: ${age || "Unknown"}, Gender: ${gender || "Unknown"}, Weight: ${weight || "Unknown"}kg
Symptoms: ${symptoms}
Duration: ${duration || "Not specified"}
Vitals: ${vitals || "Not recorded"}
Medical history: ${history_text || "None"}

Return ONLY this JSON object, nothing else:
{"diagnosis":"string","differentials":["string","string","string"],"urgency":"high","soap_note":"string","drug_guidance":"string","red_flags":["string"],"follow_up":"string"}`
        }]
      })
    });

    const data = await response.json();
    console.log("Anthropic response status:", response.status);
    console.log("Anthropic data:", JSON.stringify(data).substring(0, 200));
    
    if (!data.content || !data.content[0]) {
      console.error("No content in response:", data);
      return NextResponse.json({ error: "No content" }, { status: 500 });
    }
    
    const text = data.content[0].text;
    console.log("Text response:", text.substring(0, 200));
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Clinical API error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
