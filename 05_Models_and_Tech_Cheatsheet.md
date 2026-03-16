# Models & Tech You Should Know — Quick Reference

This maps the key model types, algorithms, and technologies to **your actual experience** so you can speak fluently about them in the interview.

---

## 1. Predictive Models (Tabular / Structured Data)

These are the bread-and-butter for QBCC: risk scoring, insolvency prediction, compliance targeting.

### Gradient Boosting (XGBoost / LightGBM / CatBoost)
- **What:** Ensemble of decision trees trained sequentially, each correcting the previous one's errors
- **Why it matters at QBCC:** Best-in-class for tabular data (contractor financial data, complaint features, inspection records). Interpretable via feature importance and SHAP values — critical for regulatory decisions
- **Your experience:** Amazon out-of-stock prediction used event-driven features fed into ML models; PhD work involved structured dataset processing at scale
- **When to use:** Risk scoring, insolvency prediction, fraud detection, defect prediction
- **Key advantage over deep learning:** Works better on structured/tabular data, doesn't need massive datasets, inherently more interpretable

### Random Forest
- **What:** Ensemble of independent decision trees, votes by majority
- **Your angle:** Good baseline model. Use it as a comparison when pitching XGBoost — "I'd start with Random Forest as a baseline, then move to gradient boosting for production"

### Logistic Regression
- **What:** Simple linear classifier with probability output
- **When to mention:** "For regulatory explainability, sometimes a logistic regression is the right choice — every coefficient maps directly to a feature's impact, making it easy to explain to compliance officers why a contractor was flagged"

### Survival Analysis / Time-to-Event Models
- **What:** Predicts *when* an event will happen, not just *if* (e.g., Cox Proportional Hazards, Random Survival Forests)
- **QBCC relevance:** "When will this contractor become insolvent?" or "How long until this licensee receives their next complaint?"
- **Mention if asked about:** Financial distress prediction, proactive intervention timing

---

## 2. Recommendation Systems

### Collaborative Filtering (Matrix Factorization)
- **What:** Finds patterns in user-item interaction matrices. SVD, ALS, NMF
- **Your experience:** **This is your PhD.** ReFRS (133 citations, TOIS A*) — federated recommender system. You literally published the state-of-the-art here
- **QBCC angle:** "Recommendation isn't just for Netflix — I could build a system that recommends which inspectors should be assigned to which cases based on expertise matching, or which compliance actions are most effective for specific contractor profiles"

### Content-Based Filtering
- **What:** Recommends based on item features rather than user behaviour
- **Your angle:** Combine with collaborative filtering for hybrid systems

### Graph-Based Recommendations (Your PhD Specialty)
- **What:** Uses network structure (who's connected to whom) for recommendations
- **Your experience:** DeHIN (TKDE A*), DASFAA Best Paper — heterogeneous network embeddings
- **QBCC angle:** "Contractor-subcontractor networks, complaint referral patterns, geographic proximity — these are all graph problems. My PhD on network embeddings gives me tools to find hidden patterns in QBCC's relational data"

---

## 3. NLP Models (Text / Language)

Critical for QBCC — complaints, legal documents, licence applications are all text-heavy.

### Transformer-Based LLMs (GPT-4, Claude, Gemini)
- **What:** Large language models based on the transformer architecture (attention mechanism). Pre-trained on massive text corpora, then fine-tuned or prompted
- **Your experience:** **Lexertia** — multi-LLM orchestration with OpenAI, Claude, Gemini, Grok. Production RAG system. Medical transcription with LangChain
- **QBCC use:** Complaint classification, document summarisation, automated report generation, conversational querying of regulatory data

### Retrieval-Augmented Generation (RAG)
- **What:** Grounds LLM responses in retrieved documents/data instead of relying on model memory. Vector search → context injection → generation
- **Your experience:** **Lexertia** (AnythingLLM + vector search + citation verification), **Medical Transcription** (LangChain + FAISS)
- **Tech stack:** Embeddings (sentence-transformers, OpenAI ada-002) → Vector DB (FAISS, pgvector, Pinecone, ChromaDB) → LLM generation
- **QBCC use:** "An officer could ask 'Show me all complaints about waterproofing in the Gold Coast from the last 6 months' and the RAG system retrieves relevant cases and generates a summary"

### Sentence Transformers / Embeddings
- **What:** Models that convert text into dense vector representations for semantic similarity
- **Models:** all-MiniLM-L6-v2 (fast), BGE (accurate), OpenAI text-embedding-3-small
- **Your experience:** Used in Lexertia for document similarity, Book Generation Tool for chunking + embeddings
- **QBCC use:** Complaint similarity detection (find duplicate/related complaints), semantic search over regulatory documents

### Named Entity Recognition (NER)
- **What:** Extracts structured entities from text (names, locations, dates, amounts, licence numbers)
- **Models:** SpaCy, Hugging Face token classifiers, or LLM-based extraction
- **QBCC use:** Auto-extract contractor names, licence numbers, defect types, and locations from free-text complaints

### Text Classification (Fine-tuned BERT / DistilBERT)
- **What:** Fine-tune a pre-trained transformer for domain-specific classification
- **QBCC use:** Classify complaints into categories (defect type, severity, trade category), route to correct department
- **Your angle:** "For high-volume classification where LLM API costs would be prohibitive, I'd fine-tune a smaller model like DistilBERT on QBCC's historical complaint data"

---

## 4. Computer Vision / Image Models

Less central to QBCC but increasingly relevant for defect inspection.

### Convolutional Neural Networks (CNNs) — ResNet, EfficientNet
- **What:** Deep learning models for image classification and feature extraction
- **QBCC use:** Classify building defect images from inspection photos (painting defects, structural cracks, waterproofing failures)

### Object Detection (YOLO, Faster R-CNN)
- **What:** Detect and localise objects within images
- **QBCC use:** Automated detection of defects in building inspection photos — "here's a crack at coordinates X,Y"

### Vision-Language Models (GPT-4V, Claude Vision, Gemini)
- **What:** Multimodal models that understand both images and text
- **Your experience:** You've worked with these LLMs at Lexertia (multi-LLM orchestration)
- **QBCC use:** "Upload a photo of a building defect and the model describes what it sees, classifies severity, and suggests which trade category it falls under" — this is the most realistic near-term application

### Document AI / OCR (Textract, Document Intelligence)
- **What:** Extract structured data from scanned documents, forms, receipts
- **QBCC use:** Processing licence applications, financial reports, trust account documents that come as PDFs/scans

---

## 5. Anomaly Detection & Fraud

### Isolation Forest / Autoencoders
- **What:** Unsupervised methods that learn "normal" patterns and flag deviations
- **QBCC use:** Fraud detection (unusual financial patterns), anomalous complaint patterns, trust account irregularities
- **Your angle:** "For fraud detection where labelled examples are scarce, I'd start with unsupervised anomaly detection — Isolation Forest for structured features, autoencoders for more complex patterns"

### Graph-Based Anomaly Detection
- **What:** Detect unusual patterns in network structures (unusual connections, communities)
- **Your experience:** PhD on network embeddings — you understand graph structures deeply
- **QBCC use:** Detecting networks of related fraudulent contractors, unusual subcontractor relationships

---

## 6. Time Series & Forecasting

### Prophet / ARIMA / Exponential Smoothing
- **What:** Statistical forecasting models for time-series data
- **QBCC use:** Forecasting complaint volumes, licensing demand, construction activity trends, workforce needs for Olympics

### Temporal Fusion Transformer
- **What:** Deep learning model for multi-horizon time-series forecasting with interpretability
- **QBCC use:** Complex forecasting that accounts for multiple features (economic indicators, seasonal patterns, policy changes)
- **Your angle:** "For QBCC's industry forecasting, I'd combine traditional methods like Prophet for baseline trends with more sophisticated models for multi-variate scenarios"

---

## 7. Key Technologies & Platforms

### Cloud & Data Infrastructure
| Technology | What It Is | Your Experience |
|---|---|---|
| **AWS (Lambda, S3, DynamoDB, Glue, Kinesis)** | Serverless compute, storage, NoSQL DB, ETL, streaming | Amazon — production systems |
| **Microsoft Fabric** | Unified analytics platform (lakehouse, warehousing, ML) | Listed on CV |
| **Snowflake** | Cloud data warehouse with SQL interface | Conceptually comparable to your DynamoDB analytics work |
| **Apache Airflow** | Workflow orchestration / DAG scheduling | Mention as "what I'd use for ML pipeline scheduling at QBCC" |
| **Docker / Kubernetes** | Containerisation and orchestration | Standard deployment knowledge |

### ML & AI Stack
| Technology | What It Is | Your Experience |
|---|---|---|
| **PyTorch / TensorFlow** | Deep learning frameworks | PhD research — both extensively |
| **scikit-learn** | Classical ML library (classification, regression, clustering) | Standard toolkit |
| **LangChain** | LLM orchestration framework | Medical Transcription project |
| **FAISS / pgvector** | Vector similarity search | Medical Transcription (FAISS), Lexertia (AnythingLLM) |
| **MLflow** | Model versioning, experiment tracking, registry | Mention as "what I'd implement at QBCC for model governance" |
| **Hugging Face** | Model hub + transformers library | NLP model deployment |
| **FastAPI** | Python async web framework | Lexertia backend |
| **Celery + Redis** | Task queue for async processing | Lexertia — document generation jobs |

### Data Processing
| Technology | What It Is | Your Experience |
|---|---|---|
| **pandas / polars** | DataFrame libraries for data manipulation | Throughout career |
| **Apache Spark / PySpark** | Distributed data processing | Mention for "scaling beyond single-machine at QBCC" |
| **dbt** | SQL-based data transformation | "What I'd use for QBCC's data pipeline transformations" |
| **Great Expectations** | Data quality validation | "Automated data quality checks before model training" |

### Visualisation & Reporting
| Technology | What It Is | Your Experience |
|---|---|---|
| **Grafana** | Real-time dashboards | Fluvio — sensor monitoring dashboards |
| **Power BI / Tableau** | Business intelligence dashboards | Government standard — mention awareness |
| **Streamlit** | Quick ML demo apps in Python | "For rapid prototyping of model demos for stakeholders" |

---

## Quick Mental Model: "Which Model for Which QBCC Problem?"

| QBCC Problem | Model Type | Specific Models |
|---|---|---|
| Compliance risk scoring | Gradient Boosting | XGBoost, LightGBM + SHAP |
| Contractor insolvency | Survival Analysis + Boosting | Cox PH, Random Survival Forest |
| Complaint classification | NLP | Fine-tuned BERT or LLM-based |
| Complaint similarity | Embeddings | sentence-transformers + FAISS |
| Fraud detection | Anomaly Detection | Isolation Forest, graph methods |
| Building defect images | Computer Vision | Vision-Language Models (GPT-4V) |
| Industry forecasting | Time Series | Prophet, Temporal Fusion Transformer |
| Document processing | Document AI | AWS Textract, LLM extraction |
| Regulatory Q&A assistant | RAG | Embeddings + Vector DB + LLM |
| Inspector-case matching | Recommendation | Collaborative + content-based hybrid |
