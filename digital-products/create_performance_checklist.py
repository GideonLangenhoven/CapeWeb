#!/usr/bin/env python3
"""
Generate Website Performance Checklist PDF for CapeWeb
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
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
COLOR_YELLOW = HexColor('#FFF591')  # Soft Yellow

def create_cover_page(canvas_obj, doc):
    """Create a custom cover page"""
    canvas_obj.saveState()

    # Background
    canvas_obj.setFillColor(COLOR_PRIMARY)
    canvas_obj.rect(0, 0, A4[0], A4[1], fill=1)

    # Top accent
    canvas_obj.setFillColor(COLOR_GREEN)
    canvas_obj.rect(0, A4[1] - 180, A4[0], 180, fill=1)

    # Title
    canvas_obj.setFillColor(COLOR_PRIMARY)
    canvas_obj.setFont("Helvetica-Bold", 38)
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] - 80, "WEBSITE")
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] - 120, "PERFORMANCE")
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] - 160, "CHECKLIST")

    # Subtitle box
    canvas_obj.setFillColor(COLOR_SECONDARY)
    canvas_obj.rect(50, A4[1] / 2 - 20, A4[0] - 100, 80, fill=1)

    canvas_obj.setFillColor(COLOR_PRIMARY)
    canvas_obj.setFont("Helvetica-Bold", 16)
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] / 2 + 30, "The 15-Minute Audit")
    canvas_obj.setFont("Helvetica", 14)
    canvas_obj.drawCentredString(A4[0] / 2, A4[1] / 2 + 5, "to Boost Conversions & Speed")

    # Checkboxes illustration
    checkbox_y = A4[1] / 2 - 100
    for i in range(3):
        canvas_obj.setStrokeColor(COLOR_TEAL)
        canvas_obj.setLineWidth(3)
        canvas_obj.rect(A4[0] / 2 - 80 + i * 50, checkbox_y, 30, 30, fill=0)

        # Checkmark
        canvas_obj.setStrokeColor(COLOR_TEAL)
        canvas_obj.line(A4[0] / 2 - 75 + i * 50, checkbox_y + 15,
                       A4[0] / 2 - 68 + i * 50, checkbox_y + 8)
        canvas_obj.line(A4[0] / 2 - 68 + i * 50, checkbox_y + 8,
                       A4[0] / 2 - 55 + i * 50, checkbox_y + 22)

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
    """Create the Website Performance Checklist PDF"""
    filename = "CapeWeb_Website_Performance_Checklist.pdf"
    doc = SimpleDocTemplate(filename, pagesize=A4,
                            rightMargin=0.75*inch, leftMargin=0.75*inch,
                            topMargin=0.75*inch, bottomMargin=0.75*inch)

    elements = []

    # Define styles
    styles = getSampleStyleSheet()

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
        fontSize=18,
        textColor=COLOR_PRIMARY,
        spaceAfter=12,
        spaceBefore=20,
        fontName='Helvetica-Bold'
    )

    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=14,
        textColor=COLOR_SECONDARY,
        spaceAfter=8,
        spaceBefore=12,
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

    score_style = ParagraphStyle(
        'Score',
        parent=styles['BodyText'],
        fontSize=10,
        textColor=colors.HexColor('#666666'),
        spaceAfter=8,
        fontName='Helvetica-Oblique'
    )

    # Cover page
    elements.append(Spacer(1, 3*inch))
    elements.append(PageBreak())

    # Introduction
    elements.append(Paragraph("Why Website Performance Matters", title_style))
    elements.append(Spacer(1, 0.2*inch))

    intro_text = """
    Your website is often the first impression potential customers have of your business.
    A slow, confusing, or mobile-unfriendly site can cost you thousands in lost revenue.
    """
    elements.append(Paragraph(intro_text, body_style))

    stat_text = """
    <b>The Numbers Don't Lie:</b><br/>
    • 53% of mobile users abandon sites that take longer than 3 seconds to load<br/>
    • A 1-second delay in page load time can reduce conversions by 7%<br/>
    • 88% of online consumers are less likely to return after a bad experience
    """
    elements.append(Paragraph(stat_text, body_style))
    elements.append(Spacer(1, 0.2*inch))

    how_to_text = """
    <b>How to Use This Checklist:</b><br/>
    Set aside 15 minutes. Go through each section and honestly assess your website.
    For each item, mark Yes (✓) or No (✗). At the end, tally your score to see how you're doing.
    """
    elements.append(Paragraph(how_to_text, body_style))

    elements.append(PageBreak())

    # Section 1: Speed & Performance
    elements.append(Paragraph("Section 1: Speed & Performance", heading_style))
    elements.append(Paragraph("Target: 5/5 points", score_style))
    elements.append(Spacer(1, 0.1*inch))

    speed_items = [
        ['☐', '<b>Homepage loads in under 3 seconds</b><br/>Test with Google PageSpeed Insights or GTmetrix', '1 pt'],
        ['☐', '<b>Images are optimized and compressed</b><br/>Use WebP format, lazy loading, proper sizing', '1 pt'],
        ['☐', '<b>No render-blocking resources</b><br/>CSS/JS files are minified and deferred', '1 pt'],
        ['☐', '<b>Mobile performance score above 80</b><br/>Check Core Web Vitals in PageSpeed Insights', '1 pt'],
        ['☐', '<b>Using a CDN or fast hosting</b><br/>Content delivery network for faster global access', '1 pt'],
    ]

    speed_table = Table(speed_items, colWidths=[0.3*inch, 5.5*inch, 0.5*inch])
    speed_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (0, -1), 16),
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_TEAL),
        ('FONTSIZE', (1, 0), (1, -1), 10),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('FONTSIZE', (2, 0), (2, -1), 9),
        ('TEXTCOLOR', (2, 0), (2, -1), COLOR_SECONDARY),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, colors.HexColor('#EEEEEE')),
    ]))

    elements.append(speed_table)
    elements.append(Spacer(1, 0.15*inch))

    speed_score = """
    <b>Your Speed Score: ___ / 5</b>
    """
    elements.append(Paragraph(speed_score, subheading_style))

    elements.append(PageBreak())

    # Section 2: Mobile Experience
    elements.append(Paragraph("Section 2: Mobile Experience", heading_style))
    elements.append(Paragraph("Target: 5/5 points", score_style))
    elements.append(Spacer(1, 0.1*inch))

    mobile_items = [
        ['☐', '<b>Fully responsive design</b><br/>Site adapts perfectly to all screen sizes', '1 pt'],
        ['☐', '<b>Touch-friendly buttons and links</b><br/>At least 44x44 pixels, easy to tap', '1 pt'],
        ['☐', '<b>Text is readable without zooming</b><br/>Font size at least 16px on mobile', '1 pt'],
        ['☐', '<b>No horizontal scrolling required</b><br/>Content fits within viewport', '1 pt'],
        ['☐', '<b>Forms are mobile-optimized</b><br/>Large inputs, proper keyboards, minimal fields', '1 pt'],
    ]

    mobile_table = Table(mobile_items, colWidths=[0.3*inch, 5.5*inch, 0.5*inch])
    mobile_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (0, -1), 16),
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_TEAL),
        ('FONTSIZE', (1, 0), (1, -1), 10),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('FONTSIZE', (2, 0), (2, -1), 9),
        ('TEXTCOLOR', (2, 0), (2, -1), COLOR_SECONDARY),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, colors.HexColor('#EEEEEE')),
    ]))

    elements.append(mobile_table)
    elements.append(Spacer(1, 0.15*inch))

    mobile_score = """
    <b>Your Mobile Score: ___ / 5</b>
    """
    elements.append(Paragraph(mobile_score, subheading_style))

    elements.append(PageBreak())

    # Section 3: Conversion Optimization
    elements.append(Paragraph("Section 3: Conversion Optimization", heading_style))
    elements.append(Paragraph("Target: 6/6 points", score_style))
    elements.append(Spacer(1, 0.1*inch))

    conversion_items = [
        ['☐', '<b>Clear value proposition above the fold</b><br/>Visitors know what you do in 5 seconds', '1 pt'],
        ['☐', '<b>Prominent, action-oriented CTA buttons</b><br/>"Book Now", "Get Started", etc. - not "Learn More"', '1 pt'],
        ['☐', '<b>Trust signals visible</b><br/>Reviews, testimonials, client logos, security badges', '1 pt'],
        ['☐', '<b>Contact info easily accessible</b><br/>Phone, email, or chat visible on every page', '1 pt'],
        ['☐', '<b>Simple navigation (5-7 items max)</b><br/>Clear menu structure, no overwhelming dropdowns', '1 pt'],
        ['☐', '<b>Lead capture forms present</b><br/>Newsletter, free resource, or contact form', '1 pt'],
    ]

    conversion_table = Table(conversion_items, colWidths=[0.3*inch, 5.5*inch, 0.5*inch])
    conversion_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (0, -1), 16),
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_TEAL),
        ('FONTSIZE', (1, 0), (1, -1), 10),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('FONTSIZE', (2, 0), (2, -1), 9),
        ('TEXTCOLOR', (2, 0), (2, -1), COLOR_SECONDARY),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, colors.HexColor('#EEEEEE')),
    ]))

    elements.append(conversion_table)
    elements.append(Spacer(1, 0.15*inch))

    conversion_score = """
    <b>Your Conversion Score: ___ / 6</b>
    """
    elements.append(Paragraph(conversion_score, subheading_style))

    elements.append(PageBreak())

    # Section 4: SEO Fundamentals
    elements.append(Paragraph("Section 4: SEO Fundamentals", heading_style))
    elements.append(Paragraph("Target: 5/5 points", score_style))
    elements.append(Spacer(1, 0.1*inch))

    seo_items = [
        ['☐', '<b>Unique, descriptive page titles</b><br/>Include keywords, under 60 characters', '1 pt'],
        ['☐', '<b>Meta descriptions on all pages</b><br/>Compelling summaries, 150-160 characters', '1 pt'],
        ['☐', '<b>Header tags used properly</b><br/>One H1 per page, H2s for sections', '1 pt'],
        ['☐', '<b>Image alt text present</b><br/>Descriptive text for accessibility and SEO', '1 pt'],
        ['☐', '<b>SSL certificate installed</b><br/>Site uses HTTPS (secure padlock)', '1 pt'],
    ]

    seo_table = Table(seo_items, colWidths=[0.3*inch, 5.5*inch, 0.5*inch])
    seo_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (0, -1), 16),
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_TEAL),
        ('FONTSIZE', (1, 0), (1, -1), 10),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('FONTSIZE', (2, 0), (2, -1), 9),
        ('TEXTCOLOR', (2, 0), (2, -1), COLOR_SECONDARY),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, colors.HexColor('#EEEEEE')),
    ]))

    elements.append(seo_table)
    elements.append(Spacer(1, 0.15*inch))

    seo_score = """
    <b>Your SEO Score: ___ / 5</b>
    """
    elements.append(Paragraph(seo_score, subheading_style))

    elements.append(PageBreak())

    # Section 5: User Experience
    elements.append(Paragraph("Section 5: User Experience", heading_style))
    elements.append(Paragraph("Target: 4/4 points", score_style))
    elements.append(Spacer(1, 0.1*inch))

    ux_items = [
        ['☐', '<b>No broken links or 404 errors</b><br/>All internal and external links work', '1 pt'],
        ['☐', '<b>Consistent branding and design</b><br/>Colors, fonts, style maintained throughout', '1 pt'],
        ['☐', '<b>Readable content with white space</b><br/>Not wall of text, proper spacing', '1 pt'],
        ['☐', '<b>Fast, helpful search or site map</b><br/>Easy to find specific information', '1 pt'],
    ]

    ux_table = Table(ux_items, colWidths=[0.3*inch, 5.5*inch, 0.5*inch])
    ux_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (0, -1), 16),
        ('TEXTCOLOR', (0, 0), (0, -1), COLOR_TEAL),
        ('FONTSIZE', (1, 0), (1, -1), 10),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
        ('FONTSIZE', (2, 0), (2, -1), 9),
        ('TEXTCOLOR', (2, 0), (2, -1), COLOR_SECONDARY),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, colors.HexColor('#EEEEEE')),
    ]))

    elements.append(ux_table)
    elements.append(Spacer(1, 0.15*inch))

    ux_score = """
    <b>Your UX Score: ___ / 4</b>
    """
    elements.append(Paragraph(ux_score, subheading_style))

    elements.append(PageBreak())

    # Score Summary
    elements.append(Paragraph("Your Total Score", heading_style))
    elements.append(Spacer(1, 0.2*inch))

    summary_text = """
    Add up your scores from all five sections:
    """
    elements.append(Paragraph(summary_text, body_style))
    elements.append(Spacer(1, 0.15*inch))

    score_data = [
        ['Section 1: Speed & Performance', '___ / 5'],
        ['Section 2: Mobile Experience', '___ / 5'],
        ['Section 3: Conversion Optimization', '___ / 6'],
        ['Section 4: SEO Fundamentals', '___ / 5'],
        ['Section 5: User Experience', '___ / 4'],
        ['', ''],
        ['<b>TOTAL SCORE</b>', '<b>___ / 25</b>'],
    ]

    score_table = Table(score_data, colWidths=[4.5*inch, 1.5*inch])
    score_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, 5), 11),
        ('FONTNAME', (0, 6), (-1, 6), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 6), (-1, 6), 14),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#333333')),
        ('TEXTCOLOR', (1, 0), (1, 5), COLOR_SECONDARY),
        ('TEXTCOLOR', (1, 6), (1, 6), COLOR_PRIMARY),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LINEABOVE', (0, 6), (-1, 6), 2, COLOR_PRIMARY),
    ]))

    elements.append(score_table)
    elements.append(Spacer(1, 0.3*inch))

    # Score interpretation
    elements.append(Paragraph("What Your Score Means", subheading_style))
    elements.append(Spacer(1, 0.1*inch))

    interp_data = [
        ['<b>20-25 points:</b>', '<b>Excellent!</b> Your website is performing well. Focus on fine-tuning and A/B testing.'],
        ['<b>15-19 points:</b>', '<b>Good.</b> You\'re on the right track. Address gaps in weaker sections for quick wins.'],
        ['<b>10-14 points:</b>', '<b>Needs Work.</b> Your site is losing you leads. Prioritize speed and mobile experience.'],
        ['<b>0-9 points:</b>', '<b>Critical Issues.</b> Your website is costing you customers. Time for a redesign or rebuild.'],
    ]

    for item in interp_data:
        interp_text = f"{item[0]} {item[1]}"
        elements.append(Paragraph(interp_text, body_style))
        elements.append(Spacer(1, 0.08*inch))

    elements.append(PageBreak())

    # Next Steps
    elements.append(Paragraph("Your Next Steps", heading_style))
    elements.append(Spacer(1, 0.2*inch))

    next_text = """
    Now that you know where your website stands, it's time to take action.
    Here's how CapeWeb can help:
    """
    elements.append(Paragraph(next_text, body_style))
    elements.append(Spacer(1, 0.2*inch))

    steps_text = """
    <b>1. Book a Free Website Audit</b><br/>
    We'll dive deeper into your specific issues and provide a detailed action plan
    with prioritized recommendations and ROI estimates.<br/><br/>

    <b>2. Get a Custom Quote</b><br/>
    Whether you need a quick tune-up or a complete rebuild, we'll provide transparent
    pricing based on your actual needs—no surprise fees.<br/><br/>

    <b>3. Watch Your Conversions Grow</b><br/>
    Our clients typically see 20-40% increases in conversions after implementing
    our performance and UX recommendations.
    """
    elements.append(Paragraph(steps_text, body_style))
    elements.append(Spacer(1, 0.3*inch))

    # CTA
    cta_style = ParagraphStyle(
        'CTA',
        parent=body_style,
        fontSize=13,
        textColor=COLOR_PRIMARY,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        spaceAfter=10,
        leftIndent=20,
        rightIndent=20,
    )

    cta_text = """
    <b>Ready to Fix What's Broken?</b><br/>
    Book your free 45-minute website audit with CapeWeb.<br/>
    We'll review your site live and show you exactly what's holding you back.
    """
    elements.append(Paragraph(cta_text, cta_style))
    elements.append(Spacer(1, 0.15*inch))

    cta_button = """
    <b>📊 BOOK YOUR FREE AUDIT →</b><br/>
    capeweb.co.za/website-audit
    """
    cta_button_style = ParagraphStyle(
        'CTAButton',
        parent=cta_style,
        fontSize=14,
        textColor=COLOR_SECONDARY,
        fontName='Helvetica-Bold'
    )
    elements.append(Paragraph(cta_button, cta_button_style))

    elements.append(Spacer(1, 0.4*inch))

    # About
    about_text = """
    <b>About CapeWeb</b><br/>
    CapeWeb specializes in high-performance websites and AI automation for Cape Town SMBs.
    We help businesses turn their websites into 24/7 lead generation machines.<br/><br/>

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
