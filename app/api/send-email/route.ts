import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, type } = body;

    if (!email || !type) {
      return NextResponse.json({ error: "Missing email or type" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const firstName = name?.split(" ")[0] || "Doctor";

    const templates: Record<string, { subject: string; html: string }> = {
      welcome: {
        subject: "Welcome to Healthpost 🏥",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto;">
            <div style="background: #1a3556; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #fff; margin: 0; font-size: 22px;">🏥 Healthpost</h1>
            </div>
            <div style="padding: 28px; background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1a3556; font-size: 18px;">Welcome, Dr. ${firstName}!</h2>
              <p style="color: #334155; line-height: 1.6;">Thank you for joining Healthpost — the hospital operating system built for medical professionals across Africa and beyond.</p>
              <p style="color: #334155; line-height: 1.6;">Here's what you can do right now:</p>
              <ul style="color: #334155; line-height: 1.8;">
                <li>🏥 Manage your OPD queue with intelligent triage</li>
                <li>🧠 Get AI-powered clinical decision support</li>
                <li>💊 Track your pharmacy stock and dispensing</li>
                <li>👤 Keep complete patient records</li>
              </ul>
              <a href="https://healthpost.africa/dashboard" style="display: inline-block; background: #1a3556; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 12px;">Go to Dashboard →</a>
              <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">Your first 3 months are completely free. No credit card required.</p>
            </div>
          </div>
        `,
      },
      day3: {
        subject: "Have you registered your first OPD patient?",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto;">
            <div style="background: #1a3556; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #fff; margin: 0; font-size: 22px;">🏥 Healthpost</h1>
            </div>
            <div style="padding: 28px; background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1a3556; font-size: 18px;">Hi Dr. ${firstName},</h2>
              <p style="color: #334155; line-height: 1.6;">It's been 3 days since you joined Healthpost. Have you tried registering your first OPD patient yet?</p>
              <p style="color: #334155; line-height: 1.6;">It takes less than 60 seconds and your team will immediately see the benefit of digital triage and queue management.</p>
              <a href="https://healthpost.africa/opd" style="display: inline-block; background: #1a3556; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 12px;">Register a Patient →</a>
            </div>
          </div>
        `,
      },
      day7: {
        subject: "Try the Clinical AI for your next case",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto;">
            <div style="background: #1a3556; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #fff; margin: 0; font-size: 22px;">🏥 Healthpost</h1>
            </div>
            <div style="padding: 28px; background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1a3556; font-size: 18px;">Hi Dr. ${firstName},</h2>
              <p style="color: #334155; line-height: 1.6;">A week in! Have you tried our Clinical AI yet? It's powered by WHO guidelines and the MSD Manual, giving you differential diagnoses, drug guidance, and SOAP notes in seconds.</p>
              <a href="https://healthpost.africa/clinical" style="display: inline-block; background: #1a3556; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 12px;">Try Clinical AI →</a>
            </div>
          </div>
        `,
      },
      day14: {
        subject: "Set up your pharmacy in Healthpost",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto;">
            <div style="background: #1a3556; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #fff; margin: 0; font-size: 22px;">🏥 Healthpost</h1>
            </div>
            <div style="padding: 28px; background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1a3556; font-size: 18px;">Hi Dr. ${firstName},</h2>
              <p style="color: #334155; line-height: 1.6;">Have you set up your in-house pharmacy yet? Track stock levels, get low-stock and expiry alerts, and dispense directly to patient records.</p>
              <a href="https://healthpost.africa/pharmacy" style="display: inline-block; background: #1a3556; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 12px;">Set Up Pharmacy →</a>
            </div>
          </div>
        `,
      },
      day28: {
        subject: "Your free trial is ending soon",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto;">
            <div style="background: #1a3556; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #fff; margin: 0; font-size: 22px;">🏥 Healthpost</h1>
            </div>
            <div style="padding: 28px; background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1a3556; font-size: 18px;">Hi Dr. ${firstName},</h2>
              <p style="color: #334155; line-height: 1.6;">You've been with Healthpost for a month now! We hope you've found it valuable for your practice.</p>
              <p style="color: #334155; line-height: 1.6;">Your free trial continues for 2 more months. After that, choose a plan that fits your facility.</p>
              <a href="https://healthpost.africa/pricing" style="display: inline-block; background: #1a3556; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 12px;">View Plans →</a>
            </div>
          </div>
        `,
      },
    };

    const template = templates[type];
    if (!template) {
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    const { data: result, error } = await resend.emails.send({
      from: "Healthpost <onboarding@resend.dev>",
      to: email,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error("Resend error:", error.message);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result?.id });
  } catch (error) {
    console.error("Send email error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
