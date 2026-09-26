"""Builds Sai_Pranay_Tadakamalla_Resume.pdf. Run: python resume/build_resume.py (needs reportlab + Carlito font)."""
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (HRFlowable, KeepTogether, ListFlowable, ListItem, Paragraph,
                                SimpleDocTemplate, Spacer, Table, TableStyle)

FONT_DIR = Path("/usr/share/fonts/truetype/crosextra")
for name, file in [("Carlito", "Carlito-Regular"), ("Carlito-Bold", "Carlito-Bold"),
                   ("Carlito-Italic", "Carlito-Italic"), ("Carlito-BoldItalic", "Carlito-BoldItalic")]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / f"{file}.ttf")))
pdfmetrics.registerFontFamily("Carlito", normal="Carlito", bold="Carlito-Bold",
                              italic="Carlito-Italic", boldItalic="Carlito-BoldItalic")

NAVY = HexColor("#1F3A68")
GREY = HexColor("#555555")
BODY = 9.1

name_s = ParagraphStyle("name", fontName="Carlito-Bold", fontSize=20, leading=23, alignment=TA_CENTER, textColor=NAVY)
tag_s = ParagraphStyle("tag", fontName="Carlito", fontSize=9.6, leading=12, alignment=TA_CENTER, textColor=GREY)
contact_s = ParagraphStyle("contact", fontName="Carlito", fontSize=8.4, leading=11, alignment=TA_CENTER)
head_s = ParagraphStyle("head", fontName="Carlito-Bold", fontSize=10.5, leading=12, textColor=NAVY, spaceBefore=2)
body_s = ParagraphStyle("body", fontName="Carlito", fontSize=BODY, leading=10.9)
right_s = ParagraphStyle("right", parent=body_s, alignment=2)
bullet_s = ParagraphStyle("bullet", parent=body_s, leading=10.7)


def link(url, text):
    return f'<link href="{url}"><font color="#1F3A68">{text}</font></link>'


def section(title):
    return [Paragraph(title.upper(), head_s),
            HRFlowable(width="100%", thickness=0.7, color=NAVY, spaceBefore=0.5, spaceAfter=2)]


def row(left, right=""):
    t = Table([[Paragraph(left, body_s), Paragraph(right, right_s)]], colWidths=["82%", "18%"])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                           ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0.5),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 0.5)]))
    return t


def bullets(items):
    return ListFlowable([ListItem(Paragraph(i, bullet_s), leftIndent=12, value="•") for i in items],
                        bulletType="bullet", start="•", leftIndent=12, bulletFontSize=8, bulletOffsetY=0)


def entry(left, right="", items=()):
    parts = [row(left, right)]
    if items:
        parts.append(bullets(items))
    parts.append(Spacer(1, 1))
    return KeepTogether(parts)


GH = "https://github.com/PranayTadakamalla"
story = [
    Paragraph("SAI PRANAY TADAKAMALLA", name_s),
    Paragraph("B.Tech, Artificial Intelligence &amp; Machine Learning | Founder &amp; CEO, 221B Labs Private Limited", tag_s),
    Paragraph(" • ".join([
        "Hyderabad, India", "+91 86881 83168",
        link("mailto:pranaytadakamalla@gmail.com", "pranaytadakamalla@gmail.com"),
        link("https://www.linkedin.com/in/sai-pranay-tadakamalla-7570bb1a6/", "LinkedIn"),
        link(GH, "GitHub"), link("https://pranaytadakamalla.vercel.app", "Portfolio"),
        link("https://orcid.org/0009-0008-6521-9122", "ORCID: 0009-0008-6521-9122")]), contact_s),
    Spacer(1, 3),
]

story += section("About")
story.append(Paragraph(
    "Final-year AI &amp; ML undergraduate at Malla Reddy University and full-stack engineer, with three papers on SSRN "
    "spanning agentic AI, cooperative multi-agent robotics and software testing. Founder and CEO of 221B Labs Private Limited, "
    "which runs campus event ticketing and is building a speech-based reading platform for Indian classrooms. Interests: "
    "reinforcement learning, agentic AI, quantum-inspired algorithms and speech technology for Indian languages.", body_s))

story += section("Education")
story += [
    row("<b>B.Tech, Artificial Intelligence &amp; Machine Learning</b> — Malla Reddy University, Hyderabad | <i>CGPA 8.85 / 10</i>", "2023 – 2027 (exp.)"),
    row("<b>Class XII</b> — Geetanjali Junior College, Nalgonda | <i>86.4%</i>", "2023"),
    row("<b>Class X</b> — Kendriya Vidyalaya, Nalgonda | <i>76.8%</i>", "2021"),
]

story += section("Research Experience")
story += [
    entry("<b>Undergraduate Researcher</b> — Dept. of AI &amp; ML, Malla Reddy University | <i>Guide: Manasa Chandupatla</i>",
          "2026 – Present", [
              "Major project: <i>Tunnelling Through Deception</i>, a quantum-inspired exploration plug-in for escaping deceptive "
              "reward traps; in a 40-seed pre-registered study, classical and quantum variants scored 0.875 and 0.877 against a "
              "0.494 baseline (p &lt; 0.0001).",
              "Built a reproducible, tested Python codebase and live comparative demo ("
              + link(f"{GH}/final-project", "github.com/PranayTadakamalla/final-project")
              + "); manuscript in preparation for IEEE submission."]),
    entry("<b>Student Researcher</b> — School of Engineering, Malla Reddy University | <i>AI for Cybersecurity</i>",
          "2024 – 2025", [
              "First author of <i>Cyber Chat Bot using GPT Model</i>, on a GPT-3.5 security advisor (MERN stack, "
              + link(f"{GH}/CyberChat", "GitHub") + ") with authentication and NLP security filters, tested with real users.",
              "Built " + link(f"{GH}/QuantumMessenger", "Quantum Messenger") + ", a quantum key-exchange and encryption simulation, and "
              "a BERT + LSTM intrusion-detection pipeline evaluated on 1,000+ simulated security events."]),
]

story += section("Publications (Preprints)")
story.append(bullets([
    "<b>Tadakamalla, S. P.</b>, &amp; Terala, S. (2026). <i>The Fullness That Remains: Quantum Non-Locality, Mathematical "
    "Infinity, and the Search for an Undivided Whole.</i> SSRN. " + link("https://doi.org/10.2139/ssrn.7350098", "doi:10.2139/ssrn.7350098"),
    "<b>Tadakamalla, S. P.</b>, &amp; Edukoju, G. S. (2025). <i>From Pixels to Paths: Cooperative AI for Autonomous "
    "Agricultural Navigation.</i> SSRN. " + link("https://doi.org/10.2139/ssrn.5935575", "doi:10.2139/ssrn.5935575"),
    "Chandupatla, M., <b>Tadakamalla, S. P.</b>, Prakash, S. M. R., &amp; Y, D. (2025). <i>A Unified Framework for End-to-End "
    "Testing in E-Commerce Applications: Towards AI-Driven Resilience and Automation.</i> SSRN. "
    + link("https://doi.org/10.2139/ssrn.5602510", "doi:10.2139/ssrn.5602510"),
]))

story += section("Experience")
story += [
    entry("<b>Founder &amp; CEO</b> — 221B Labs Private Limited, Hyderabad | <i>Incubated at Malla Reddy University</i>",
          "Mar 2026 – Present", [
              "Lead strategy, product, client delivery and hiring; run an engineering internship programme.",
              "Built Festora, the company's event ticketing platform, used to ticket 5,000+ students; official ticketing and "
              "community partner of Malla Reddy University and DataForge, a Microsoft developer community in Hyderabad.",
              "Delivered MALCON '26 registration and QR check-in for 700+ participants, covering entry and two-day meal passes."]),
    entry("<b>Project Manager Intern</b> — Pramila Foundation", "Jan 2025 – Jun 2025", [
        "Led development of the organisation's website and mobile app; feature and UX changes raised user engagement by 85%."]),
    entry("<b>Web Developer</b> — Unifesto, student-led event startup | built its event registration, scheduling and login system", "2025"),
]

story += section("Projects")
story += [
    entry("<b>Pathana Sakthi</b> — 221B Labs Private Limited | <i>Speech AI, TTS, G2P, Android</i>", "2026 – Present", [
        "Offline read-along tutor for Classes 1–10 in Telugu, English and Hindi, aligned to the SCERT curriculum, with teacher, parent and admin dashboards.",
        "Developing in-house kid-calibrated Indian voices, a language model and grapheme-to-phoneme (G2P) conversion; "
        "pronunciation is scored word by word through CTC forced alignment.",
        "Pilot plan with SCERT: 2–3 government schools, 150–300 students, targeting 75%+ read-along accuracy and 80%+ weekly teacher use."]),
    entry("<b>Bazinga Labs</b> — LLM Code Generation Platform | <i>React.js, Node.js, LLMs</i> | " + link(f"{GH}/Bazinga_Labs", "GitHub"), "", [
        "Generates code in Python, Java, TypeScript, React, AngularJS and Node.js through a secure, scalable API backend."]),
    entry("<b>AADHARVA</b> — AI Digital Hub for Rural Advancement | <i>Next.js, Python, Google APIs</i> | " + link(f"{GH}/AADHARVA", "GitHub"), "", [
        "Multilingual conversational assistant that guides rural users through digital services."]),
]

story += section("Achievements &amp; Leadership")
story += [
    entry("<b>2nd Place, Pitch Arena – Ideathon 4.0</b> — Malla Reddy University", "Aug 2026", [
        "Pitched Pathana Sakthi; advanced to Round 2 of the National Entrepreneurship Challenge 2026 (E-Cell, IIT Bombay)."]),
    entry("<b>Vice-President</b> — Microsoft Learn Student Chapter, Malla Reddy University", "Apr 2025 – Oct 2025", [
        "Led a 20-member team that ran 10+ workshops on AI, cloud and software development, reaching 5,000+ students."]),
    entry("<b>Member</b> — Indian Knowledge Systems (IKS) Club, Malla Reddy University", "2024 – Present"),
]

story += section("Skills, Certifications &amp; Languages")
story += [Paragraph(s, body_s) for s in [
    "<b>AI/ML:</b> Machine Learning, Reinforcement Learning, NLP, LLMs, Prompt Engineering, Speech Recognition, Experimental Design",
    "<b>Programming &amp; Web:</b> Python, Java, C/C++, JavaScript, TypeScript, React.js, Next.js, Node.js, Express.js, Django, "
    "Spring Boot, REST APIs",
    "<b>Data, Cloud &amp; Tools:</b> MongoDB, MySQL, AWS, Google Cloud Platform, CI/CD, Git, GitHub, Postman, Salesforce CRM",
    "<b>Certifications:</b> Elements of AI (Univ. of Helsinki), Reinforcement Learning (NPTEL), Generative AI (Microsoft &amp; "
    "LinkedIn), Responsible AI (Google), Managing Projects (PMI), Project Management (Microsoft)",
    "<b>Languages:</b> English (professional, Cambridge B2), Hindi (full professional, C1), Telugu (native)",
]]

out = Path(__file__).with_name("Sai_Pranay_Tadakamalla_Resume.pdf")
SimpleDocTemplate(str(out), pagesize=A4, leftMargin=12.5 * mm, rightMargin=12.5 * mm, topMargin=9 * mm, bottomMargin=8 * mm,
                  title="Sai Pranay Tadakamalla — Resume", author="Sai Pranay Tadakamalla",
                  subject="Resume", keywords="AI, ML, Reinforcement Learning, Agentic AI, Speech AI").build(story)
print(out)
