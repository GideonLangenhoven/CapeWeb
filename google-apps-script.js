// -----------------------------------------------------------------------------
// GOOGLE APPS SCRIPT CODE
// -----------------------------------------------------------------------------
// 1. Go to https://script.google.com/
// 2. Open your existing project
// 3. Paste the code below into the editor (replace existing code)
// 4. Click "Deploy" -> "Manage deployments"
// 5. Click the "Edit" (pencil) icon next to your existing deployment
// 6. Version: Select "New version" (CRITICAL STEP)
// 7. Click "Deploy"
// 8. The URL should remain the same, but the code is now updated.
// -----------------------------------------------------------------------------
// CONFIGURATION
// -----------------------------------------------------------------------------
var SHEET_ID = "1B_u7k_..._REPLACE_WITH_YOUR_SHEET_ID_..._"; // <--- REPLACE THIS
var LEADS_SHEET_NAME = "Leads";
var INTAKE_SHEET_NAME = "IntakeResponses";

// -----------------------------------------------------------------------------
// POST REQUEST HANDLER
// -----------------------------------------------------------------------------
function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var ss = SpreadsheetApp.openById(SHEET_ID);

        // Parse the incoming data
        var data = JSON.parse(e.postData.contents);
        var timestamp = new Date();
        var type = data.type || "lead"; // 'lead' (default) or 'intake'

        if (type === 'intake') {
            // --- HANDLE INTAKE FORM ---
            var intakeSheet = ss.getSheetByName(INTAKE_SHEET_NAME);
            if (!intakeSheet) {
                intakeSheet = ss.insertSheet(INTAKE_SHEET_NAME);
                intakeSheet.appendRow(["Timestamp", "Name", "Email", "Business Name", "Biggest Challenge", "Repetitive Processes", "AI Goals"]);
            }

            intakeSheet.appendRow([
                timestamp,
                data.name,
                data.email,
                data.businessName,
                data.biggestChallenge,
                data.repetitiveProcesses,
                data.aiGoals
            ]);

            return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'message': 'Intake received' }))
                .setMimeType(ContentService.MimeType.JSON);

        } else {
            // --- HANDLE LEAD GEN FORM ---
            var sheet = ss.getSheetByName(LEADS_SHEET_NAME);
            if (!sheet) {
                sheet = ss.insertSheet(LEADS_SHEET_NAME);
                // Header: Timestamp, Name, Email, Email Status, Guide Type, Follow-up Status
                sheet.appendRow(["Timestamp", "Name", "Email", "Email Status", "Guide Type", "Follow-up Status"]);
            }

            var name = data.name || "Friend";
            var email = data.email;
            var guideType = data.guideType || "business-evolution";
            var message = data.message || ""; // Capture message if present

            // Send Welcome Email
            var emailStatus = "Sent";
            try {
                sendWelcomeEmail(name, email, guideType, message);
            } catch (error) {
                emailStatus = "Error: " + error.toString();
            }

            // Append to the sheet
            // If it's a contact form, we might want to store the message too.
            // For simplicity, we'll append it to the "Guide Type" column or a new column if we wanted to be fancy,
            // but let's stick to the existing structure and maybe append message to name or just log it.
            // Actually, let's just append it as is. The sheet has fixed columns.
            // We'll put the message in the "Guide Type" column for now if it's a contact form, or just keep it simple.
            // Better approach: Just log it as "Contact Form" in guide type.

            sheet.appendRow([timestamp, name, email, emailStatus, guideType, "Pending"]);

            return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'emailStatus': emailStatus }))
                .setMimeType(ContentService.MimeType.JSON);
        }

    } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

// -----------------------------------------------------------------------------
// WELCOME EMAIL FUNCTION
// -----------------------------------------------------------------------------
function sendWelcomeEmail(name, email, guideType, message) {
    var subject = "";
    var bodyContent = "";

    if (guideType === "automation-playbook") {
        subject = "Your Automation Playbook is Inside! 🤖";
        bodyContent = `
            <p style="font-size: 16px; line-height: 1.6;">
              Thanks for grabbing <strong>The Automation Playbook</strong>. You're on your way to reclaiming 10+ hours a week.
            </p>
            
            <h3 style="color: #A64B23; margin-top: 25px;">Why Agentic AI?</h3>
            <p style="font-size: 16px; line-height: 1.6;">
              <strong>Agentic AI</strong> isn't just a chatbot. It's AI that can <em>do</em> things—like booking appointments, updating your CRM, and handling customer support autonomously.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              <strong>Automation</strong> is the backbone of a scalable business. By letting AI handle the repetitive "busy work," you free up your team to focus on strategy, creativity, and closing deals.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              This guide covers the high-impact tasks you should automate immediately to start seeing these results.
            </p>
        `;
    } else if (guideType === "contact-form") {
        subject = "We received your message! 📬";
        bodyContent = `
            <p style="font-size: 16px; line-height: 1.6;">
              Thanks for reaching out! We've received your message and our team is reviewing it.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              <strong>Your Message:</strong><br/>
              <em>"${message}"</em>
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              We typically reply within 24 hours. In the meantime, feel free to check out our <a href="https://capeweb.co.za/resources" style="color: #A64B23;">free resources</a>.
            </p>
        `;
    } else if (guideType === "footer-subscribe") {
        subject = "Welcome to the Cape Web Community! 🌟";
        bodyContent = `
            <p style="font-size: 16px; line-height: 1.6;">
              Thanks for subscribing to our newsletter! You're now on the list to receive the latest insights on AI, automation, and web development.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              We promise to keep it valuable and spam-free.
            </p>
        `;
    } else {
        // Default: Business Evolution Guide
        subject = "Your Business Evolution Guide is Here! 🚀";
        bodyContent = `
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for downloading <strong>The Business Evolution Guide</strong>. You've taken the first step towards transforming your business for the digital age.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              Inside, you'll find actionable strategies to leverage AI and social media to scale your operations.
            </p>
        `;
    }

    // List of all available resources
    var resources = [
        { id: "business-evolution", title: "Business Evolution Guide", url: "https://capeweb.co.za/business-evolution-guide.pdf" },
        { id: "automation-playbook", title: "Automation Playbook", url: "https://capeweb.co.za/The-Automation-Playbook.pdf" },
        { id: "time-money-trap", title: "Time-for-Money Trap", url: "https://capeweb.co.za/time-for-money-trap.pdf" },
        { id: "2026-extinction", title: "2026 Extinction Event", url: "https://capeweb.co.za/2026-survival-guide.pdf" },
        { id: "employee-never-sleeps", title: "The Employee Who Never Sleeps", url: "https://capeweb.co.za/ai-agent-guide.pdf" },
        { id: "whatsapp-goldmine", title: "The WhatsApp Goldmine", url: "https://capeweb.co.za/whatsapp-automation.pdf" },
        { id: "service-to-scale", title: "Service to Scale", url: "https://capeweb.co.za/service-to-scale.pdf" }
    ];

    // Generate HTML for other resources (excluding the current one)
    var otherResourcesHtml = "";
    var otherResources = resources.filter(function (r) { return r.id !== guideType; });

    if (otherResources.length > 0 && guideType !== "contact-form" && guideType !== "footer-subscribe") {
        otherResourcesHtml += `
            <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
                <h3 style="text-align: center; color: #333; margin-bottom: 20px;">Explore More Free Resources</h3>
                <div style="text-align: center;">
        `;

        otherResources.forEach(function (r) {
            otherResourcesHtml += `
                <a href="${r.url}" style="display: inline-block; margin: 10px; padding: 10px 20px; background-color: #240b36; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 14px;">
                    Download ${r.title}
                </a>
            `;
        });

        otherResourcesHtml += `
                </div>
            </div>
        `;
    }

    // HTML Email Body
    var htmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; color: #333;">
      
      <!-- Header with Logo -->
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #A64B23;">
        <h1 style="color: #000; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">CAPE WEB</h1>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #000; margin-top: 0;">Hi ${name},</h2>
        
        ${bodyContent}
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://calendly.com/capeweb/discovery-call" style="background-color: #A64B23; color: #ffffff; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
            Book Your Free Discovery Call
          </a>
        </div>

        ${otherResourcesHtml}

        <p style="font-size: 16px; line-height: 1.6;">
          If you're ready to implement these changes but don't know where to start, our team is here to help. Let's discuss your specific goals.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #888;">
        <p>&copy; 2025 Cape Web. All rights reserved.</p>
        <p>Cape Town, South Africa</p>
      </div>
    </div>
  `;

    MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: htmlBody
    });
}

// -----------------------------------------------------------------------------
// FOLLOW-UP EMAIL CHECKER (RUN THIS WITH A TIME-DRIVEN TRIGGER)
// -----------------------------------------------------------------------------
function checkFollowUps() {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(LEADS_SHEET_NAME);
    if (!sheet) return;

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var timestampIndex = headers.indexOf("Timestamp");
    var emailIndex = headers.indexOf("Email");
    var nameIndex = headers.indexOf("Name");
    var followUpIndex = headers.indexOf("Follow-up Status");

    // If Follow-up Status column doesn't exist, create it
    if (followUpIndex === -1) {
        sheet.getRange(1, headers.length + 1).setValue("Follow-up Status");
        followUpIndex = headers.length;
    }

    var now = new Date();
    var twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var timestamp = new Date(row[timestampIndex]);
        var email = row[emailIndex];
        var name = row[nameIndex] || "Friend";
        var status = row[followUpIndex];

        // Check if lead is older than 24h AND status is empty or "Pending"
        if (timestamp < twentyFourHoursAgo && (status === "" || status === "Pending")) {
            try {
                sendFollowUpEmail(name, email);
                sheet.getRange(i + 1, followUpIndex + 1).setValue("Sent");
                Logger.log("Sent follow-up to: " + email);
            } catch (e) {
                sheet.getRange(i + 1, followUpIndex + 1).setValue("Error: " + e.toString());
                Logger.log("Error sending follow-up to " + email + ": " + e.toString());
            }
        }
    }
}

function sendFollowUpEmail(name, email) {
    var subject = "Quick question about your automation journey... 🤔";
    var intakeLink = "https://capeweb.co.za/intake?email=" + encodeURIComponent(email);

    var htmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; color: #333;">
      
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #A64B23;">
        <h1 style="color: #000; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">CAPE WEB</h1>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #000; margin-top: 0;">Hi ${name},</h2>
        
        <p style="font-size: 16px; line-height: 1.6;">
          It's been 24 hours since you grabbed our guide. I wanted to check in—do you have any questions about AI, business automation, or website development?
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Every business is unique, and sometimes it's hard to know exactly <em>where</em> to start automating.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          <strong>Let's make this easier.</strong> Tell us a bit about your current challenges, and we'll help you identify the low-hanging fruit in your processes.
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${intakeLink}" style="background-color: #A64B23; color: #ffffff; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
            Complete Your Business Intake
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          This will give us the info we need to have a productive conversation about your specific needs.
        </p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #888;">
        <p>&copy; 2025 Cape Web. All rights reserved.</p>
      </div>
    </div>
  `;

    MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: htmlBody
    });
}

// -----------------------------------------------------------------------------
// SETUP FUNCTION
// -----------------------------------------------------------------------------
function setup() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Setup Leads Sheet
    var leadsSheet = ss.getSheetByName(LEADS_SHEET_NAME);
    if (!leadsSheet) {
        leadsSheet = ss.insertSheet(LEADS_SHEET_NAME);
        leadsSheet.appendRow(["Timestamp", "Name", "Email", "Email Status", "Guide Type", "Follow-up Status"]);
    } else {
        // Ensure headers exist if sheet exists
        var headers = leadsSheet.getRange(1, 1, 1, 6).getValues()[0];
        if (headers[5] !== "Follow-up Status") {
            leadsSheet.getRange(1, 6).setValue("Follow-up Status");
        }
    }

    // Setup Intake Sheet
    var intakeSheet = ss.getSheetByName(INTAKE_SHEET_NAME);
    if (!intakeSheet) {
        intakeSheet = ss.insertSheet(INTAKE_SHEET_NAME);
        intakeSheet.appendRow(["Timestamp", "Name", "Email", "Business Name", "Biggest Challenge", "Repetitive Processes", "AI Goals"]);
    }
}

function testEmail() {
    sendWelcomeEmail("Test User", "your-email@example.com", "automation-playbook");
    Logger.log("Email permission authorized!");
}
