# QBCC AO7 Senior Data Scientist — Interview Guide

**Date:** Tuesday 17 March 2026, 11:00 AM (Teams)
**Duration:** ~45 minutes (technical assessment + interview questions)
**Panel:** Zohaib Jan (Chair, Manager Data Science & Engineering) | Adela Padurean (Manager Services Trades)

---

## Quick Reference: Your Strongest CV-to-Role Matches

| PD Requirement | Your Evidence |
|---|---|
| Scalable data solutions (Python/SQL) | Amazon: 100K+ events/day pipeline; PhD: 100GB+ datasets |
| Cloud data platforms & warehousing | AWS (Lambda, S3, DynamoDB, Glue, Kinesis); Microsoft Fabric; Snowflake-comparable |
| ML lifecycle management | PhD research (PyTorch, TensorFlow); federated learning systems; model deployment at Amazon |
| Gen AI, Agentic Systems, AI Agents | Lexertia (multi-LLM orchestration, RAG); Medical Transcription (agentic RAG via LangChain/FAISS) |
| Business requirements → technical solutions | Amazon out-of-stock system; Fluvio IoT platform; Healthcare automation |
| MLOps & CI/CD | Lexertia deployment (Nginx, systemd, rsync CI/CD); Amazon internal pipelines |
| Responsible AI & data ethics | PhD on privacy-preserving federated learning; governance in regulated domains (legal, healthcare) |
| Stakeholder engagement | Consulting across legal, healthcare, IoT; presenting research at ICDE/DASFAA; Amazon cross-team work |

---

## Interview Structure (Expected)

1. **Introduction (~3 min)** — Brief self-intro. Keep it to 2 minutes.
2. **Technical Assessment (~15-20 min)** — Likely a coding/SQL exercise or system design scenario. See `03_Technical_Assessment_Prep.md`.
3. **Behavioural/Situational Questions (~20 min)** — STAR-format answers mapped to the 8 candidate attributes. See `02_Project_Stories_STAR.md`.
4. **Your Questions (~5 min)** — Always have 2-3 prepared.

---

## Your 2-Minute Introduction

> "Thanks for having me. I'm Mubashir — PhD in Data Science from UQ, 7+ years turning messy data into production systems that actually move the needle. I've built event-driven pipelines at Amazon handling 100K+ events a day, architected AI platforms with multi-LLM orchestration and RAG at Lexertia, and delivered end-to-end ML in healthcare, IoT, and legal tech. My PhD was on privacy-preserving federated learning — so responsible AI isn't a buzzword for me, it's what I published on at top-tier venues like ICDE.
>
> What drew me to QBCC specifically: you're sitting on a goldmine of regulatory data — licensees, complaints, financial reporting — and I want to help turn that into predictive models and NLP systems that make compliance smarter, not just bigger. Especially with the Olympics pipeline coming, the scale challenge here is exactly the kind of problem I thrive on."

---

## Key Themes to Weave Into Every Answer

1. **Regulatory impact** — Your work enables better, fairer regulation (not just cool tech).
2. **Scale** — You've handled large-scale data (100GB+ in PhD, 100K events/day at Amazon). QBCC needs this.
3. **End-to-end ownership** — From data pipelines through ML models to production deployment and monitoring.
4. **Responsible AI** — Your PhD was literally about privacy-preserving ML. Governance matters in government.
5. **Stakeholder communication** — You've translated complex AI to lawyers, clinicians, farmers (Nestle/DRDF), startup founders.

---

## Understanding QBCC's Data Science Needs

QBCC is Queensland's building and construction regulator. They manage:
- **100,000+ licensees** (builders, plumbers, certifiers, tradespeople)
- **Compliance & enforcement** — shifting to intelligence-led, risk-based regulation
- **Consumer protection** — disputes, warranty insurance, defect tracking
- **Financial oversight** — Minimum Financial Requirements monitoring for contractors

**Why they need a Senior Data Scientist:**
- **Risk-based compliance targeting** — Predict which licensees are likely non-compliant instead of random inspections
- **Contractor insolvency prediction** — Financial distress models using MFR reporting data
- **NLP on complaints** — Classify, route, and prioritise thousands of complaints
- **Fraud detection** — Identify unlicensed operators and fraudulent contractors
- **Defect pattern analysis** — Predict building defect trends (painting defects = #1 reported issue)
- **Industry forecasting** — Construction activity and workforce demand for 2032 Olympics pipeline

See `01_QBCC_Research.md` for full background.

---

## Questions to Ask the Panel

**For Zohaib (your future manager):**
1. "What does the current data science tech stack look like — are you on Snowflake already, or is platform selection part of the role?"
2. "What's the most impactful AI/ML use case the team is currently working on or planning to tackle next?"
3. "How does the Data Science and Engineering team collaborate with the compliance and licensing business units?"

**For Adela (Services Trades):**
4. "From the Services Trades perspective, what data challenges would you most want the data science team to solve?"
5. "How do you currently use data to inform your regulatory decisions?"

**General:**
6. "What does success look like in the first 6 months for this role?"

---

## Supporting Materials

| File | Purpose |
|---|---|
| `01_QBCC_Research.md` | Deep dive on QBCC — what they do, strategic priorities, data landscape |
| `02_Project_Stories_STAR.md` | Ready-to-use STAR answers for each candidate attribute |
| `03_Technical_Assessment_Prep.md` | Technical assessment prep — SQL, Python, system design scenarios |
| `04_Embellished_Projects_Note.md` | Clarifies which project details are enhanced/fabricated for interview prep |
