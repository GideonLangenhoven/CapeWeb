#!/usr/bin/env python3
"""
Generate AI Time-Saver Guide PDF for CapeWeb
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
import os

# CapeWeb brand colors
COLOR_PRIMARY = HexColor('#0A174E')  # Deep Space Blue
COLOR_SECONDARY = HexColor('#00D4FF')  # Electric Cyan
COLOR_ACCENT = HexColor('#6A00FF')  # Quantum Purple
COLOR_PINK = HexColor('#F35588')  # Hot Pink
COLOR_TEAL = HexColor('#05DFD7')  # Turquoise
COLOR_GREEN = HexColor('#A3F7BF')  # Soft Green

def create_cover_page(canvas_obj, doc):
    """Create a custom cover page"""
    canvas_obj.saveState()

    # Background gradient effect (using rectangles)
    canvas_obj.setFillColor(COLOR_PRIMARY)
    canvas_obj.rect(0, 0, A4[0], A4[1], fill=1)

    # Accent rectangle
    canvas_obj.setFillColor(COLOR_TEAL)
    canvas_obj.rect(0, A4[1] - 150, A4[0], 150, fill=1)

    # Title
    canvas_obj.setFillColor(COLOR_PRIMARY)
    canvas_obj.setFont("Helvetica-Bold", 42)
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] - 100, "AI TIME-SAVER")
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] - 135, "GUIDE")

    # Subtitle
    canvas_obj.setFillColor(COLOR_PRIMARY)
    canvas_obj.setFont("Helvetica", 16)
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] / 2 + 50, "5 Workflows That Save")
    canvas_obj.setFont("Helvetica-Bold", 22)
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] / 2 + 15, "10+ Hours Every Week")

    # Icon circles
    canvas_obj.setFillColor(COLOR_SECONDARY)
    canvas_obj.circle(A4[0] / 2 - 80, A4[1] / 2 - 60, 25, fill=1)
    canvas_obj.setFillColor(COLOR_ACCENT)
    canvas_obj.circle(A4[0] / 2, A4[1] / 2 - 60, 25, fill=1)
    canvas_obj.setFillColor(COLOR_PINK)
    canvas_obj.circle(A4[0] / 2 + 80, A4[1] / 2 - 60, 25, fill=1)

    # Bottom branding
    canvas_obj.setFillColor(COLOR_SECONDARY)
    canvas_obj.setFont("Helvetica-Bold", 24)
    canvas_obj.drawCentredString(A4[0] / 2, 150, "CAPEWEB")

    canvas_obj.setFillColor(colors.white)
    canvas_obj.setFont("Helvetica", 12)
    canvas_obj.drawCentredString(A4[0] / 2, 120, "AI-Powered Website Automation")
    canvas_obj.drawCentredString(A4[0] / 2, 105, "for Cape Town SMBs")

    canvas_obj.restoreState()

def create_pdf():
    """Create the AI Time-Saver Guide PDF"""
    filename = "CapeWeb_AI_TimeSaver_Guide.pdf"
    doc = SimpleDocTemplate(filename, pagesize=A4,
                            rightMargin=0.75*inch, leftMargin=0.75*inch,
                            topMargin=0.75*inch, bottomMargin=0.75*inch)

    # Container for the 'Flowable' objects
    elements = []

    # Define styles
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=COLOR_PRIMARY,
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )

    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=20,
        textColor=COLOR_PRIMARY,
        spaceAfter=12,
        spaceBefore=20,
        fontName='Helvetica-Bold'
    )

    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=16,
        textColor=COLOR_SECONDARY,
        spaceAfter=10,
        spaceBefore=15,
        fontName='Helvetica-Bold'
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        textColor=colors.HexColor('#333333'),
        spaceAfter=10,
        leading=16,
        fontName='Helvetica'
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['BodyText'],
        fontSize=12,
        textColor=COLOR_PRIMARY,
        spaceAfter=10,
        leftIndent=20,
        rightIndent=20,
        fontName='Helvetica-Bold'
    )

    # Cover page (will be added via onFirstPage callback)
    elements.append(Spacer(1, 3*inch))
    elements.append(PageBreak())

    # Introduction page
    elements.append(Paragraph("Welcome to Your AI Time-Saver Guide", title_style))
    elements.append(Spacer(1, 0.3*inch))

    intro_text = """
    As a Cape Town SMB owner, your time is your most valuable asset. Yet most business owners
    spend 10-15 hours per week on repetitive tasks that AI could handle in minutes.
    """
    elements.append(Paragraph(intro_text, body_style))
    elements.append(Spacer(1, 0.2*inch))

    intro_text2 = """
    This guide reveals five proven AI workflows that CapeWeb uses with clients to reclaim
    10+ hours every week—time you can reinvest in growth, strategy, or simply getting your life back.
    """
    elements.append(Paragraph(intro_text2, body_style))
    elements.append(Spacer(1, 0.3*inch))

    # What You'll Learn box
    elements.append(Paragraph("What You'll Learn:", subheading_style))

    learn_data = [
        ['✓', 'How to automate lead capture and qualification 24/7'],
        ['✓', 'AI-powered customer support that never sleeps'],
        ['✓', 'Automated content creation for social media'],
        ['✓', 'Smart email follow-ups that convert'],
        ['✓', 'Meeting scheduling without the back-and-forth'],
    ]

    learn_table = Table(learn_data, colWidths=[0.3*inch, 6*inch])
    learn_table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_TEAL),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))

    elements.append(learn_table)
    elements.append(Spacer(1, 0.3*inch))

    callout_text = """
    "After implementing just 3 of these workflows, I got back 12 hours per week.
    It's like hiring an assistant without the overhead." - Local Cape Town Business Owner
    """
    elements.append(Paragraph(callout_text, callout_style))

    elements.append(PageBreak())

    # Workflow 1
    elements.append(Paragraph("Workflow #1", heading_style))
    elements.append(Paragraph("AI Chatbot for Lead Qualification", subheading_style))
    elements.append(Spacer(1, 0.1*inch))

    wf1_text = """
    <b>The Problem:</b> You're spending 5-8 hours per week answering the same questions from potential
    clients: pricing, services, availability. Most inquiries aren't qualified, wasting your time.
    """
    elements.append(Paragraph(wf1_text, body_style))

    wf1_solution = """
    <b>The AI Solution:</b> Deploy a custom-trained chatbot on your website that:
    """
    elements.append(Paragraph(wf1_solution, body_style))

    wf1_features = [
        ['•', 'Answers FAQs instantly (pricing, services, process)'],
        ['•', 'Qualifies leads with smart questions (budget, timeline, needs)'],
        ['•', 'Books discovery calls directly in your calendar'],
        ['•', 'Collects contact info and integrates with your CRM'],
        ['•', 'Works 24/7, including weekends and after hours'],
    ]

    wf1_table = Table(wf1_features, colWidths=[0.3*inch, 6*inch])
    wf1_table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_SECONDARY),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (1, 0), (1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))

    elements.append(wf1_table)
    elements.append(Spacer(1, 0.15*inch))

    wf1_result = """
    <b>Time Saved:</b> 5-8 hours/week | <b>Tools:</b> Chatbase, Intercom AI, or custom ChatGPT integration
    """
    elements.append(Paragraph(wf1_result, body_style))

    elements.append(PageBreak())

    # Workflow 2
    elements.append(Paragraph("Workflow #2", heading_style))
    elements.append(Paragraph("Automated Social Media Content", subheading_style))
    elements.append(Spacer(1, 0.1*inch))

    wf2_text = """
    <b>The Problem:</b> Creating fresh content for Instagram, LinkedIn, and Facebook eats up
    3-4 hours weekly. By the time you're done, you're too exhausted to engage with your audience.
    """
    elements.append(Paragraph(wf2_text, body_style))

    wf2_solution = """
    <b>The AI Solution:</b> Build a content engine that:
    """
    elements.append(Paragraph(wf2_solution, body_style))

    wf2_features = [
        ['•', 'Generates post ideas based on trending topics in your industry'],
        ['•', 'Writes captions in your brand voice (trained on your best content)'],
        ['•', 'Suggests hashtags and optimal posting times'],
        ['•', 'Creates image concepts (pair with Canva or Midjourney)'],
        ['•', 'Schedules posts automatically across all platforms'],
    ]

    wf2_table = Table(wf2_features, colWidths=[0.3*inch, 6*inch])
    wf2_table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_SECONDARY),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (1, 0), (1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))

    elements.append(wf2_table)
    elements.append(Spacer(1, 0.15*inch))

    wf2_result = """
    <b>Time Saved:</b> 3-4 hours/week | <b>Tools:</b> ChatGPT + Buffer/Hootsuite, or Jasper AI
    """
    elements.append(Paragraph(wf2_result, body_style))

    elements.append(PageBreak())

    # Workflow 3
    elements.append(Paragraph("Workflow #3", heading_style))
    elements.append(Paragraph("Smart Email Follow-Up Sequences", subheading_style))
    elements.append(Spacer(1, 0.1*inch))

    wf3_text = """
    <b>The Problem:</b> Leads go cold because you forget to follow up, or your generic emails
    get ignored. Manual follow-ups take 2-3 hours weekly and have low response rates.
    """
    elements.append(Paragraph(wf3_text, body_style))

    wf3_solution = """
    <b>The AI Solution:</b> Create intelligent email sequences that:
    """
    elements.append(Paragraph(wf3_solution, body_style))

    wf3_features = [
        ['•', 'Trigger automatically based on user behavior (downloads, page visits, cart abandonment)'],
        ['•', 'Personalize content using lead data (name, industry, pain points)'],
        ['•', 'Adjust timing and messaging based on engagement'],
        ['•', 'A/B test subject lines and content automatically'],
        ['•', 'Alert you when a high-value lead is ready to talk'],
    ]

    wf3_table = Table(wf3_features, colWidths=[0.3*inch, 6*inch])
    wf3_table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_SECONDARY),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (1, 0), (1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))

    elements.append(wf3_table)
    elements.append(Spacer(1, 0.15*inch))

    wf3_result = """
    <b>Time Saved:</b> 2-3 hours/week | <b>Tools:</b> ActiveCampaign, HubSpot, or Mailchimp with AI features
    """
    elements.append(Paragraph(wf3_result, body_style))

    elements.append(PageBreak())

    # Workflow 4
    elements.append(Paragraph("Workflow #4", heading_style))
    elements.append(Paragraph("AI-Powered Meeting Scheduler", subheading_style))
    elements.append(Spacer(1, 0.1*inch))

    wf4_text = """
    <b>The Problem:</b> The "when are you available?" email tennis wastes 1-2 hours per week.
    Coordinating across time zones and multiple stakeholders is even worse.
    """
    elements.append(Paragraph(wf4_text, body_style))

    wf4_solution = """
    <b>The AI Solution:</b> Implement a smart scheduling assistant that:
    """
    elements.append(Paragraph(wf4_solution, body_style))

    wf4_features = [
        ['•', 'Syncs with your calendar and finds mutual availability automatically'],
        ['•', 'Sends booking links embedded in emails and chatbot conversations'],
        ['•', 'Offers buffer time between meetings to prevent burnout'],
        ['•', 'Sends automated reminders and follow-up emails'],
        ['•', 'Integrates with Zoom/Teams to create meeting links automatically'],
    ]

    wf4_table = Table(wf4_features, colWidths=[0.3*inch, 6*inch])
    wf4_table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_SECONDARY),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (1, 0), (1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))

    elements.append(wf4_table)
    elements.append(Spacer(1, 0.15*inch))

    wf4_result = """
    <b>Time Saved:</b> 1-2 hours/week | <b>Tools:</b> Calendly, Acuity Scheduling, or Cal.com
    """
    elements.append(Paragraph(wf4_result, body_style))

    elements.append(PageBreak())

    # Workflow 5
    elements.append(Paragraph("Workflow #5", heading_style))
    elements.append(Paragraph("Automated Customer Support & FAQ", subheading_style))
    elements.append(Spacer(1, 0.1*inch))

    wf5_text = """
    <b>The Problem:</b> Customer support emails and DMs interrupt your focus 20+ times per day.
    Most are simple questions you've answered hundreds of times: shipping, returns, account issues.
    """
    elements.append(Paragraph(wf5_text, body_style))

    wf5_solution = """
    <b>The AI Solution:</b> Deploy AI support that:
    """
    elements.append(Paragraph(wf5_solution, body_style))

    wf5_features = [
        ['•', 'Handles 60-80% of support queries automatically (trained on your knowledge base)'],
        ['•', 'Provides instant answers to common questions'],
        ['•', 'Escalates complex issues to you with full conversation context'],
        ['•', 'Works across email, chat, WhatsApp, and social DMs'],
        ['•', 'Learns from every interaction to improve over time'],
    ]

    wf5_table = Table(wf5_features, colWidths=[0.3*inch, 6*inch])
    wf5_table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_SECONDARY),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (1, 0), (1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))

    elements.append(wf5_table)
    elements.append(Spacer(1, 0.15*inch))

    wf5_result = """
    <b>Time Saved:</b> 3-5 hours/week | <b>Tools:</b> Zendesk AI, Freshdesk, or custom GPT integration
    """
    elements.append(Paragraph(wf5_result, body_style))

    elements.append(PageBreak())

    # Next Steps
    elements.append(Paragraph("Your Next Steps", heading_style))
    elements.append(Spacer(1, 0.2*inch))

    next_text = """
    You've just discovered five proven workflows that could save you 10+ hours every week.
    But knowing and doing are two different things. Here's how to get started:
    """
    elements.append(Paragraph(next_text, body_style))
    elements.append(Spacer(1, 0.2*inch))

    steps_data = [
        ['1', '<b>Pick One Workflow</b>', 'Choose the workflow that would have the biggest immediate impact on your business. Start small—you can always add more later.'],
        ['2', '<b>Book a Free Strategy Call</b>', 'We\'ll help you map out exactly how to implement this workflow in your business, including tool recommendations and estimated ROI.'],
        ['3', '<b>Implement in 30 Days</b>', 'With our help, you can have your first AI workflow live in 2-4 weeks. That means reclaiming those hours by next month.'],
    ]

    for step in steps_data:
        step_num_style = ParagraphStyle(
            'StepNum',
            parent=body_style,
            fontSize=16,
            textColor=COLOR_SECONDARY,
            fontName='Helvetica-Bold'
        )
        elements.append(Paragraph(step[0], step_num_style))
        elements.append(Paragraph(step[1], subheading_style))
        elements.append(Paragraph(step[2], body_style))
        elements.append(Spacer(1, 0.15*inch))

    elements.append(Spacer(1, 0.3*inch))

    # CTA Box
    cta_text = """
    <b>Ready to Reclaim Your Time?</b><br/>
    Book a free 45-minute strategy call with CapeWeb.<br/>
    We'll identify which workflows will work best for your business<br/>
    and create a custom 90-day automation roadmap.
    """
    elements.append(Paragraph(cta_text, callout_style))
    elements.append(Spacer(1, 0.2*inch))

    cta_button = """
    <b>📅 BOOK YOUR FREE STRATEGY CALL →</b><br/>
    capeweb.co.za/strategy-call
    """
    cta_button_style = ParagraphStyle(
        'CTAButton',
        parent=callout_style,
        fontSize=14,
        textColor=COLOR_SECONDARY,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    elements.append(Paragraph(cta_button, cta_button_style))

    elements.append(PageBreak())

    # About CapeWeb
    elements.append(Paragraph("About CapeWeb", heading_style))
    elements.append(Spacer(1, 0.2*inch))

    about_text = """
    CapeWeb is a Cape Town-based digital agency specializing in AI-powered website automation
    for SMBs. We help local businesses stop losing leads to slow websites and manual processes.
    """
    elements.append(Paragraph(about_text, body_style))
    elements.append(Spacer(1, 0.15*inch))

    about_text2 = """
    <b>Our Services:</b>
    """
    elements.append(Paragraph(about_text2, body_style))

    services_data = [
        ['•', 'High-performance websites that convert'],
        ['•', 'AI chatbots and automation for 24/7 lead capture'],
        ['•', 'SEO and organic growth strategies'],
        ['•', 'Brand identity and visual design'],
        ['•', 'Social media marketing with AI content engines'],
    ]

    services_table = Table(services_data, colWidths=[0.3*inch, 6*inch])
    services_table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_TEAL),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (1, 0), (1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))

    elements.append(services_table)
    elements.append(Spacer(1, 0.3*inch))

    contact_text = """
    <b>Get in Touch:</b><br/>
    🌐 capeweb.co.za<br/>
    📧 hello@capeweb.co.za<br/>
    📍 Cape Town, South Africa
    """
    elements.append(Paragraph(contact_text, body_style))

    # Build PDF with custom cover page
    def add_page_number(canvas_obj, doc):
        """Add page number to each page (except cover)"""
        canvas_obj.saveState()
        if doc.page > 1:  # Skip cover page
            canvas_obj.setFont('Helvetica', 9)
            canvas_obj.setFillColor(colors.grey)
            page_num = canvas_obj.getPageNumber() - 1  # Adjust for cover page
            text = f"Page {page_num}"
            canvas_obj.drawRightString(A4[0] - 0.75*inch, 0.5*inch, text)
        canvas_obj.restoreState()

    # First page callback (cover)
    def on_first_page(canvas_obj, doc):
        create_cover_page(canvas_obj, doc)

    # Later pages callback (with page numbers)
    def on_later_pages(canvas_obj, doc):
        add_page_number(canvas_obj, doc)

    doc.build(elements, onFirstPage=on_first_page, onLaterPages=on_later_pages)
    print(f"✓ Created {filename}")
    return filename

if __name__ == "__main__":
    # Change to digital-products directory
    os.chdir('/home/user/CapeWeb/digital-products')
    create_pdf()
