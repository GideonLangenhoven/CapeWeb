#!/usr/bin/env python3
"""
Generate Automation ROI Calculator Guide PDF for CapeWeb
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
import os

# CapeWeb brand colors
COLOR_PRIMARY = HexColor('#0A174E')
COLOR_SECONDARY = HexColor('#00D4FF')
COLOR_ACCENT = HexColor('#6A00FF')
COLOR_PINK = HexColor('#F35588')
COLOR_TEAL = HexColor('#05DFD7')
COLOR_GREEN = HexColor('#A3F7BF')
COLOR_YELLOW = HexColor('#FFF591')

def create_cover_page(canvas_obj, doc):
    """Create a custom cover page"""
    canvas_obj.saveState()

    # Background
    canvas_obj.setFillColor(COLOR_PRIMARY)
    canvas_obj.rect(0, 0, A4[0], A4[1], fill=1)

    # Top accent
    canvas_obj.setFillColor(COLOR_PINK)
    canvas_obj.rect(0, A4[1] - 200, A4[0], 200, fill=1)

    # Title
    canvas_obj.setFillColor(COLOR_PRIMARY)
    canvas_obj.setFont("Helvetica-Bold", 36)
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] - 70, "AUTOMATION")
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] - 110, "ROI CALCULATOR")

    # Subtitle
    canvas_obj.setFont("Helvetica", 16)
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] - 160, "Calculate Your Time & Money Savings")

    # Dollar sign illustration
    canvas_obj.setFillColor(COLOR_SECONDARY)
    canvas_obj.setFont("Helvetica-Bold", 120)
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] / 2 - 30, "$")

    # Benefits badges
    canvas_obj.setFillColor(COLOR_TEAL)
    canvas_obj.circle(A4[0] / 2 - 100, A4[1] / 2 - 130, 35, fill=1)
    canvas_obj.setFillColor(COLOR_PRIMARY)
    canvas_obj.setFont("Helvetica-Bold", 11)
    canvas_obj.drawCentredString(A4[0] / 2 - 100, A4[1] / 2 - 135, "SAVE")
    canvas_obj.drawCentredString(A4[0] / 2 - 100, A4[1] / 2 - 125, "TIME")

    canvas_obj.setFillColor(COLOR_GREEN)
    canvas_obj.circle(A4[0] / 2 + 100, A4[1] / 2 - 130, 35, fill=1)
    canvas_obj.setFillColor(COLOR_PRIMARY)
    canvas_obj.drawCentredString(A4[0] / 2 + 100, A4[1] / 2 - 135, "SAVE")
    canvas_obj.drawCentredString(A4[0] / 2 + 100, A4[1] / 2 - 125, "MONEY")

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
    """Create the Automation ROI Calculator PDF"""
    filename = "CapeWeb_Automation_ROI_Calculator.pdf"
    doc = SimpleDocTemplate(filename, pagesize=A4,
                            rightMargin=0.75*inch, leftMargin=0.75*inch,
                            topMargin=0.75*inch, bottomMargin=0.75*inch)

    elements = []
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
        fontName='Helvetica-Bold',
        alignment=TA_CENTER
    )

    # Cover page
    elements.append(Spacer(1, 3*inch))
    elements.append(PageBreak())

    # Introduction
    elements.append(Paragraph("The True Cost of Manual Work", title_style))
    elements.append(Spacer(1, 0.3*inch))

    intro_text = """
    Every hour you spend on repetitive tasks is an hour you're not spending on growth,
    strategy, or building relationships. But most business owners don't realize just
    how much time—and money—they're losing to manual processes.
    """
    elements.append(Paragraph(intro_text, body_style))
    elements.append(Spacer(1, 0.2*inch))

    intro_text2 = """
    This calculator helps you quantify the real ROI of automation. By the end,
    you'll know exactly how much you could save (in both time and money) by automating
    just a few key workflows in your business.
    """
    elements.append(Paragraph(intro_text2, body_style))
    elements.append(Spacer(1, 0.3*inch))

    callout_text = """
    "I didn't realize I was spending R15,000 per month on tasks<br/>
    a chatbot could do for R500. The ROI was instant."<br/>
    - Cape Town Service Business Owner
    """
    elements.append(Paragraph(callout_text, callout_style))

    elements.append(PageBreak())

    # How It Works
    elements.append(Paragraph("How This Calculator Works", heading_style))
    elements.append(Spacer(1, 0.2*inch))

    how_text = """
    We'll walk through five common manual tasks that automation can handle.
    For each task, you'll estimate:
    """
    elements.append(Paragraph(how_text, body_style))
    elements.append(Spacer(1, 0.15*inch))

    how_list = [
        ['1.', '<b>Time spent per week</b> - How many hours you or your team spend on this task'],
        ['2.', '<b>Hourly cost</b> - What that time is worth (your rate or your team member\'s salary)'],
        ['3.', '<b>Automation potential</b> - What percentage AI could handle (we\'ll provide estimates)'],
    ]

    how_table = Table(how_list, colWidths=[0.3*inch, 6*inch])
    how_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (0, -1), 12),
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_SECONDARY),
        ('FONTSIZE', (1, 0), (1, -1), 11),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))

    elements.append(how_table)
    elements.append(Spacer(1, 0.2*inch))

    formula_text = """
    <b>The Formula:</b><br/>
    Annual Savings = (Hours/Week × Hourly Cost × Automation % × 52 weeks) - Automation Cost
    """
    elements.append(Paragraph(formula_text, body_style))

    elements.append(PageBreak())

    # Task 1: Lead Qualification
    elements.append(Paragraph("Task 1: Lead Qualification & Response", heading_style))
    elements.append(Spacer(1, 0.1*inch))

    task1_desc = """
    <b>What it includes:</b> Answering inquiry emails, qualifying leads, scheduling calls,
    following up with prospects, answering FAQ questions.
    """
    elements.append(Paragraph(task1_desc, body_style))
    elements.append(Spacer(1, 0.15*inch))

    # Worksheet table
    task1_data = [
        ['<b>Your Numbers</b>', '<b>Fill In</b>', '<b>Example</b>'],
        ['Hours per week on this task', '____', '6 hours'],
        ['Hourly cost (your rate or staff rate)', 'R ____', 'R 500/hr'],
        ['<b>Weekly cost (hours × rate)</b>', '<b>R ____</b>', '<b>R 3,000</b>'],
        ['<b>Monthly cost (× 4.3 weeks)</b>', '<b>R ____</b>', '<b>R 12,900</b>'],
        ['<b>Annual cost (× 52 weeks)</b>', '<b>R ____</b>', '<b>R 156,000</b>'],
    ]

    task1_table = Table(task1_data, colWidths=[3*inch, 1.5*inch, 1.8*inch])
    task1_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_TEAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#CCCCCC')),
        ('BACKGROUND', (0, 3), (-1, 5), colors.HexColor('#F0F8FF')),
        ('FONTNAME', (0, 3), (0, 5), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))

    elements.append(task1_table)
    elements.append(Spacer(1, 0.2*inch))

    # Automation potential
    auto1_text = """
    <b>Automation Potential:</b> 70-80% (AI chatbots can handle most inquiries)<br/>
    <b>Annual Savings Estimate:</b> R 109,200 - R 124,800 (based on example above)<br/>
    <b>Automation Cost:</b> R 500-2,000/month for chatbot + setup
    """
    elements.append(Paragraph(auto1_text, body_style))

    elements.append(PageBreak())

    # Task 2: Social Media Management
    elements.append(Paragraph("Task 2: Social Media Content Creation", heading_style))
    elements.append(Spacer(1, 0.1*inch))

    task2_desc = """
    <b>What it includes:</b> Writing posts, creating graphics, scheduling content,
    responding to comments and DMs.
    """
    elements.append(Paragraph(task2_desc, body_style))
    elements.append(Spacer(1, 0.15*inch))

    task2_data = [
        ['<b>Your Numbers</b>', '<b>Fill In</b>', '<b>Example</b>'],
        ['Hours per week on this task', '____', '4 hours'],
        ['Hourly cost (your rate or staff rate)', 'R ____', 'R 400/hr'],
        ['<b>Weekly cost (hours × rate)</b>', '<b>R ____</b>', '<b>R 1,600</b>'],
        ['<b>Monthly cost (× 4.3 weeks)</b>', '<b>R ____</b>', '<b>R 6,880</b>'],
        ['<b>Annual cost (× 52 weeks)</b>', '<b>R ____</b>', '<b>R 83,200</b>'],
    ]

    task2_table = Table(task2_data, colWidths=[3*inch, 1.5*inch, 1.8*inch])
    task2_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_TEAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#CCCCCC')),
        ('BACKGROUND', (0, 3), (-1, 5), colors.HexColor('#F0F8FF')),
        ('FONTNAME', (0, 3), (0, 5), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))

    elements.append(task2_table)
    elements.append(Spacer(1, 0.2*inch))

    auto2_text = """
    <b>Automation Potential:</b> 60-70% (AI generates content, you review and approve)<br/>
    <b>Annual Savings Estimate:</b> R 49,920 - R 58,240<br/>
    <b>Automation Cost:</b> R 300-1,000/month for AI content tools
    """
    elements.append(Paragraph(auto2_text, body_style))

    elements.append(PageBreak())

    # Task 3: Email Follow-ups
    elements.append(Paragraph("Task 3: Email Follow-Ups & Nurturing", heading_style))
    elements.append(Spacer(1, 0.1*inch))

    task3_desc = """
    <b>What it includes:</b> Writing follow-up emails, checking in with leads,
    sending reminders, nurturing prospects through the sales funnel.
    """
    elements.append(Paragraph(task3_desc, body_style))
    elements.append(Spacer(1, 0.15*inch))

    task3_data = [
        ['<b>Your Numbers</b>', '<b>Fill In</b>', '<b>Example</b>'],
        ['Hours per week on this task', '____', '3 hours'],
        ['Hourly cost (your rate or staff rate)', 'R ____', 'R 500/hr'],
        ['<b>Weekly cost (hours × rate)</b>', '<b>R ____</b>', '<b>R 1,500</b>'],
        ['<b>Monthly cost (× 4.3 weeks)</b>', '<b>R ____</b>', '<b>R 6,450</b>'],
        ['<b>Annual cost (× 52 weeks)</b>', '<b>R ____</b>', '<b>R 78,000</b>'],
    ]

    task3_table = Table(task3_data, colWidths=[3*inch, 1.5*inch, 1.8*inch])
    task3_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_TEAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#CCCCCC')),
        ('BACKGROUND', (0, 3), (-1, 5), colors.HexColor('#F0F8FF')),
        ('FONTNAME', (0, 3), (0, 5), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))

    elements.append(task3_table)
    elements.append(Spacer(1, 0.2*inch))

    auto3_text = """
    <b>Automation Potential:</b> 80-90% (triggered sequences based on behavior)<br/>
    <b>Annual Savings Estimate:</b> R 62,400 - R 70,200<br/>
    <b>Automation Cost:</b> R 200-800/month for email automation platform
    """
    elements.append(Paragraph(auto3_text, body_style))

    elements.append(PageBreak())

    # Task 4: Meeting Scheduling
    elements.append(Paragraph("Task 4: Meeting Coordination", heading_style))
    elements.append(Spacer(1, 0.1*inch))

    task4_desc = """
    <b>What it includes:</b> Back-and-forth emails to find meeting times, sending
    calendar invites, sending reminders, rescheduling.
    """
    elements.append(Paragraph(task4_desc, body_style))
    elements.append(Spacer(1, 0.15*inch))

    task4_data = [
        ['<b>Your Numbers</b>', '<b>Fill In</b>', '<b>Example</b>'],
        ['Hours per week on this task', '____', '2 hours'],
        ['Hourly cost (your rate or staff rate)', 'R ____', 'R 500/hr'],
        ['<b>Weekly cost (hours × rate)</b>', '<b>R ____</b>', '<b>R 1,000</b>'],
        ['<b>Monthly cost (× 4.3 weeks)</b>', '<b>R ____</b>', '<b>R 4,300</b>'],
        ['<b>Annual cost (× 52 weeks)</b>', '<b>R ____</b>', '<b>R 52,000</b>'],
    ]

    task4_table = Table(task4_data, colWidths=[3*inch, 1.5*inch, 1.8*inch])
    task4_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_TEAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#CCCCCC')),
        ('BACKGROUND', (0, 3), (-1, 5), colors.HexColor('#F0F8FF')),
        ('FONTNAME', (0, 3), (0, 5), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))

    elements.append(task4_table)
    elements.append(Spacer(1, 0.2*inch))

    auto4_text = """
    <b>Automation Potential:</b> 95% (fully automated with booking links)<br/>
    <b>Annual Savings Estimate:</b> R 49,400<br/>
    <b>Automation Cost:</b> R 0-200/month (many free options available)
    """
    elements.append(Paragraph(auto4_text, body_style))

    elements.append(PageBreak())

    # Task 5: Customer Support
    elements.append(Paragraph("Task 5: Customer Support Inquiries", heading_style))
    elements.append(Spacer(1, 0.1*inch))

    task5_desc = """
    <b>What it includes:</b> Answering support emails, responding to common questions,
    troubleshooting basic issues, providing order updates.
    """
    elements.append(Paragraph(task5_desc, body_style))
    elements.append(Spacer(1, 0.15*inch))

    task5_data = [
        ['<b>Your Numbers</b>', '<b>Fill In</b>', '<b>Example</b>'],
        ['Hours per week on this task', '____', '5 hours'],
        ['Hourly cost (your rate or staff rate)', 'R ____', 'R 350/hr'],
        ['<b>Weekly cost (hours × rate)</b>', '<b>R ____</b>', '<b>R 1,750</b>'],
        ['<b>Monthly cost (× 4.3 weeks)</b>', '<b>R ____</b>', '<b>R 7,525</b>'],
        ['<b>Annual cost (× 52 weeks)</b>', '<b>R ____</b>', '<b>R 91,000</b>'],
    ]

    task5_table = Table(task5_data, colWidths=[3*inch, 1.5*inch, 1.8*inch])
    task5_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_TEAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#CCCCCC')),
        ('BACKGROUND', (0, 3), (-1, 5), colors.HexColor('#F0F8FF')),
        ('FONTNAME', (0, 3), (0, 5), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))

    elements.append(task5_table)
    elements.append(Spacer(1, 0.2*inch))

    auto5_text = """
    <b>Automation Potential:</b> 60-70% (AI handles common questions)<br/>
    <b>Annual Savings Estimate:</b> R 54,600 - R 63,700<br/>
    <b>Automation Cost:</b> R 500-1,500/month for AI support tools
    """
    elements.append(Paragraph(auto5_text, body_style))

    elements.append(PageBreak())

    # Total ROI Summary
    elements.append(Paragraph("Your Total Automation ROI", heading_style))
    elements.append(Spacer(1, 0.2*inch))

    summary_text = """
    Now let's add it all up. Based on the example numbers we used, here's the potential
    ROI from automating these five common tasks:
    """
    elements.append(Paragraph(summary_text, body_style))
    elements.append(Spacer(1, 0.2*inch))

    # Summary table
    summary_data = [
        ['<b>Task</b>', '<b>Annual Cost</b>', '<b>Automation %</b>', '<b>Annual Savings</b>'],
        ['Lead Qualification', 'R 156,000', '75%', 'R 117,000'],
        ['Social Media', 'R 83,200', '65%', 'R 54,080'],
        ['Email Follow-ups', 'R 78,000', '85%', 'R 66,300'],
        ['Meeting Scheduling', 'R 52,000', '95%', 'R 49,400'],
        ['Customer Support', 'R 91,000', '65%', 'R 59,150'],
        ['', '', '', ''],
        ['<b>TOTAL</b>', '<b>R 460,200</b>', '', '<b>R 345,930</b>'],
    ]

    summary_table = Table(summary_data, colWidths=[2.2*inch, 1.6*inch, 1.3*inch, 1.5*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, 5), 1, colors.HexColor('#CCCCCC')),
        ('BACKGROUND', (0, 6), (-1, 6), COLOR_SECONDARY),
        ('TEXTCOLOR', (0, 6), (-1, 6), COLOR_PRIMARY),
        ('FONTNAME', (0, 6), (-1, 6), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 6), (-1, 6), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))

    elements.append(summary_table)
    elements.append(Spacer(1, 0.3*inch))

    # Cost breakdown
    cost_text = """
    <b>Minus Automation Costs:</b><br/>
    Estimated monthly automation costs: R 2,000 - R 5,000<br/>
    Annual automation costs: R 24,000 - R 60,000<br/><br/>

    <b>Net Annual ROI: R 285,930 - R 321,930</b>
    """
    cost_style = ParagraphStyle(
        'Cost',
        parent=body_style,
        fontSize=12,
        textColor=COLOR_PRIMARY,
        fontName='Helvetica-Bold',
        leftIndent=20,
        rightIndent=20,
    )
    elements.append(Paragraph(cost_text, cost_style))

    elements.append(Spacer(1, 0.2*inch))

    roi_callout = """
    That's R 285,000+ back in your pocket each year—or 20 hours per week<br/>
    you can spend growing your business instead of drowning in admin.
    """
    elements.append(Paragraph(roi_callout, callout_style))

    elements.append(PageBreak())

    # Next Steps
    elements.append(Paragraph("Ready to Start Saving?", heading_style))
    elements.append(Spacer(1, 0.2*inch))

    next_text = """
    The numbers speak for themselves. The question isn't whether you can afford
    to automate—it's whether you can afford not to.
    """
    elements.append(Paragraph(next_text, body_style))
    elements.append(Spacer(1, 0.2*inch))

    steps_text = """
    <b>Here's How to Get Started with CapeWeb:</b><br/><br/>

    <b>Step 1: Book Your Free ROI Workshop</b><br/>
    We'll go through this calculator together using your actual numbers, identify your
    biggest time-wasters, and map out a custom automation plan.<br/><br/>

    <b>Step 2: Get Your Custom Proposal</b><br/>
    We'll provide a detailed proposal with exact costs, timeline, and ROI projections
    for your specific business.<br/><br/>

    <b>Step 3: Start Saving Within 30 Days</b><br/>
    We implement your first automation workflow and you start reclaiming your time
    (and money) within the first month.
    """
    elements.append(Paragraph(steps_text, body_style))
    elements.append(Spacer(1, 0.3*inch))

    # CTA
    cta_text = """
    <b>See Your Real Numbers</b><br/>
    Book a free 45-minute ROI workshop with CapeWeb.<br/>
    We'll calculate your exact savings potential and show you<br/>
    exactly which workflows to automate first.
    """
    elements.append(Paragraph(cta_text, callout_style))
    elements.append(Spacer(1, 0.15*inch))

    cta_button = """
    <b>💰 BOOK YOUR FREE ROI WORKSHOP →</b><br/>
    capeweb.co.za/roi-workshop
    """
    cta_button_style = ParagraphStyle(
        'CTAButton',
        parent=callout_style,
        fontSize=14,
        textColor=COLOR_SECONDARY,
        fontName='Helvetica-Bold'
    )
    elements.append(Paragraph(cta_button, cta_button_style))

    elements.append(Spacer(1, 0.4*inch))

    # About
    about_text = """
    <b>About CapeWeb</b><br/>
    CapeWeb is Cape Town's leading agency for AI-powered website automation.
    We help SMBs stop losing leads to slow websites and manual processes—and start
    reclaiming 10-20 hours per week through intelligent automation.<br/><br/>

    <b>Our Services:</b> High-performance websites • AI chatbots • Email automation •
    SEO & content • Social media marketing • Brand identity<br/><br/>

    🌐 capeweb.co.za<br/>
    📧 hello@capeweb.co.za<br/>
    📍 Cape Town, South Africa
    """
    elements.append(Paragraph(about_text, body_style))

    # Build PDF
    def add_page_number(canvas_obj, doc):
        canvas_obj.saveState()
        if doc.page > 1:
            canvas_obj.setFont('Helvetica', 9)
            canvas_obj.setFillColor(colors.grey)
            page_num = canvas_obj.getPageNumber() - 1
            text = f"Page {page_num}"
            canvas_obj.drawRightString(A4[0] - 0.75*inch, 0.5*inch, text)
        canvas_obj.restoreState()

    def on_first_page(canvas_obj, doc):
        create_cover_page(canvas_obj, doc)

    def on_later_pages(canvas_obj, doc):
        add_page_number(canvas_obj, doc)

    doc.build(elements, onFirstPage=on_first_page, onLaterPages=on_later_pages)
    print(f"✓ Created {filename}")
    return filename

if __name__ == "__main__":
    os.chdir('/home/user/CapeWeb/digital-products')
    create_pdf()
