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

function doPost(e) {
    // --------------------------------------------------------------------------------
    // IMPORTANT: PASTE YOUR GOOGLE SHEET ID BELOW
    // The ID is the long string of characters in your Google Sheet URL
    // Example: https://docs.google.com/spreadsheets/d/1aBcD.../edit
    // You would copy: 1aBcD...
    // --------------------------------------------------------------------------------
    var SHEET_ID = '13rrzo2dvidl63DzF-A5NXB8P3gVOzis8dyq8RMQj9fM';

    var sheet;
    try {
        sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    } catch (err) {
        // If opening fails, try active (fallback) or log error
        try {
            sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        } catch (e) {
            return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Could not find spreadsheet. Please check SHEET_ID.' }))
                .setMimeType(ContentService.MimeType.JSON);
        }
    }

    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    var name = data.name;
    var email = data.email;
    var timestamp = new Date();

    // Send Welcome Email
    var emailStatus = "Sent";
    try {
        sendWelcomeEmail(name, email);
    } catch (error) {
        emailStatus = "Error: " + error.toString();
    }

    // Append to the sheet (Added Email Status column)
    sheet.appendRow([timestamp, name, email, emailStatus]);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'emailStatus': emailStatus }))
        .setMimeType(ContentService.MimeType.JSON);
}

function sendWelcomeEmail(name, email) {
    var subject = "Your Business Evolution Guide is Here! 🚀";

    // HTML Email Body
    var htmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; color: #333;">
      
      <!-- Header with Logo (Using Text as Fallback if Image fails) -->
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #A64B23;">
        <h1 style="color: #000; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">CAPE WEB</h1>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #000; margin-top: 0;">Hi ${name},</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for downloading <strong>The Business Evolution Guide</strong>. You've taken the first step towards transforming your business for the digital age.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Inside, you'll find actionable strategies to leverage AI and social media to scale your operations.
        </p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://capeweb.co.za/contact" style="background-color: #A64B23; color: #ffffff; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
            Book Your Free Discovery Call
          </a>
        </div>

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

function setup() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow(["Timestamp", "Name", "Email", "Email Status"]);
}

// -----------------------------------------------------------------------------
// RUN THIS FUNCTION ONCE TO AUTHORIZE EMAIL SENDING
// 1. Select "testEmail" from the dropdown menu in the toolbar.
// 2. Click "Run".
// 3. You will be asked to Review Permissions. Click "Review Permissions".
// 4. Select your account -> Advanced -> Go to (Project Name) (unsafe) -> Allow.
// -----------------------------------------------------------------------------
function testEmail() {
    sendWelcomeEmail("Test User", "your-email@example.com"); // Replace with your email if you want to test receipt
    Logger.log("Email permission authorized!");
}
