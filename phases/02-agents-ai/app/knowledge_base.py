"""
Knowledge Base (RAG) engine — ChromaDB-backed vector store for local document retrieval.
Ingests PDFs/text, creates embeddings, and retrieves relevant chunks for grounded answers.
100% local: no external embedding API calls.
"""

import os
import json
import hashlib
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
KNOWLEDGE_DIR = BASE_DIR / "knowledge_base"
CHROMA_DIR = BASE_DIR / "chroma_data"

# Pre-loaded sample documents for the prototype
SAMPLE_DOCUMENTS = [
    {
        "id": "sop-pressure-safety",
        "title": "Pressure Safety SOP (SOP-MRPL-PS-2024)",
        "source": "Pressure_Safety_SOP_v3.pdf",
        "content": """MRPL Standard Operating Procedure for Pressure Safety
SOP-MRPL-PS-2024 | Version 3.0 | Effective Date: January 2024

Section 4.2 - Pressure Class Limits

Table 4-1: Maximum Operating Pressure by Pipe Class

| Pipe Diameter (mm) | Class | Max Pressure (MPa) | Temperature Limit (°C) |
|---------------------|-------|---------------------|------------------------|
| 200                 | 150   | 8.5                 | 400                    |
| 300                 | 300   | 10.0                | 380                    |
| 500                 | 600   | 12.0                | 350                    |
| 500                 | 600   | 10.5 (derated)      | >350                   |
| 800                 | 900   | 15.0                | 320                    |

Section 4.2.3 - Temperature Derating
For temperatures exceeding the standard operating limit specified in Table 4-1,
the maximum operating pressure shall be derated by 12.5% per 50°C increment above
the temperature limit. All derated values must be recalculated by a certified
pressure vessel engineer and documented in the Equipment Integrity Log.

Section 5.1 - Inspection Requirements
All pressure-bearing equipment shall undergo:
- Visual inspection: Monthly
- Ultrasonic thickness testing: Quarterly  
- Hydrostatic pressure testing: Annually
- Complete integrity assessment: Every 5 years

Section 6.3 - Emergency Pressure Relief
Each pressure vessel must have a minimum of two independent pressure relief devices
(PRDs). Primary PRD set point: 110% of MAWP. Secondary PRD set point: 115% of MAWP.
All PRDs must be tested and certified every 12 months.""",
        "page": 12,
        "subtopic": "Section 4.2 - Pressure Class Limits",
    },
    {
        "id": "cdu-operating-manual",
        "title": "CDU Operating Manual",
        "source": "CDU_Operating_Manual.pdf",
        "content": """CDU (Crude Distillation Unit) Operating Manual
Document: MRPL-CDU-OM-2024 | Revision: 7

Section 7.1 - Pipe Specifications
The CDU section utilizes carbon steel pipes conforming to ASTM A106 Grade B.
All pipe fittings shall comply with ASME B16.9 standards.

Standard pipe configurations in CDU:
- Main crude feed line: 500mm, Schedule 80, rated to 12 MPa
- Overhead vapor line: 800mm, Schedule 40, rated to 4 MPa  
- Side draw lines: 200-300mm, Schedule 60, rated to 8 MPa
- Bottom product line: 400mm, Schedule 80, rated to 10 MPa

Section 7.3 - Temperature Operating Ranges
- Column top temperature: 120-150°C (typical)
- Column mid-section: 250-300°C
- Column bottom: 340-360°C
- Flash zone: 355-365°C

Section 8.2 - Equipment Tags
- C-301: Main Distillation Column
- C-302: Vacuum Distillation Column  
- E-101 through E-108: Heat Exchangers
- P-201 through P-208: Process Pumps
- V-301 through V-306: Knockout Drums
- CV-201 through CV-210: Control Valves
- PT-301 through PT-312: Pressure Transmitters

Section 9.1 - Yield Optimization
Target yields for Arabian Light crude (API 34):
- LPG: 3-5%
- Naphtha: 15-20%
- Kerosene: 10-15%
- Diesel: 25-30%
- Atmospheric Gas Oil: 10-15%
- Atmospheric Residue: 20-25%""",
        "page": 45,
        "subtopic": "Section 7.1 - Pipe Specifications",
    },
    {
        "id": "engineering-formulas",
        "title": "Engineering Formulas Handbook",
        "source": "Engineering_Formulas_Handbook.pdf",
        "content": """MRPL Engineering Formulas Handbook
Document: MRPL-EFH-2024 | Maintained by: Technical Standards Division

Chapter 2 - Pressure Vessel Calculations

2.1 Hoop Stress (Thin-Wall Approximation)
Formula: σ_h = (P × D) / (2 × t)
Where:
  σ_h = Hoop stress (MPa)
  P = Internal pressure (MPa)
  D = Internal diameter (mm)
  t = Wall thickness (mm)

Applicability: Valid when D/t > 20 (thin-wall condition)

2.2 Longitudinal Stress
Formula: σ_L = (P × D) / (4 × t)
The longitudinal stress is exactly half the hoop stress.

2.3 Von Mises Equivalent Stress
Formula: σ_vm = √(σ_h² - σ_h×σ_L + σ_L²)
Used for combined loading assessment.

2.4 Barlow's Formula (Burst Pressure)
Formula: P_burst = (2 × S × t) / D
Where S = Ultimate Tensile Strength of the material (MPa)

Chapter 3 - Heat Transfer

3.1 LMTD (Log Mean Temperature Difference)
Formula: ΔT_lm = (ΔT₁ - ΔT₂) / ln(ΔT₁/ΔT₂)

3.2 Overall Heat Transfer Coefficient
Formula: Q = U × A × ΔT_lm
Where U = Overall heat transfer coefficient (W/m²·K)

Chapter 4 - Flow Calculations

4.1 Reynolds Number
Formula: Re = (ρ × v × D) / μ
Laminar: Re < 2300, Transitional: 2300-4000, Turbulent: Re > 4000

4.2 Darcy-Weisbach Equation
Formula: h_f = f × (L/D) × (v²/2g)
For friction factor f, use Moody chart or Colebrook equation.""",
        "page": 4,
        "subtopic": "Hoop Stress Formula",
    },
    {
        "id": "material-standards",
        "title": "MRPL Material Standards",
        "source": "MRPL_Material_Standards.pdf",
        "content": """MRPL Material Standards and Allowable Stress Tables
Document: MRPL-MS-2024 | Revision: 5

Table A-3: Allowable Stress Values for Carbon Steel Pipes

| Material Grade | Temperature (°C) | Allowable Stress (MPa) | UTS (MPa) |
|----------------|-------------------|------------------------|-----------|
| ASTM A106 Gr B | Up to 200        | 170                    | 415       |
| ASTM A106 Gr B | 250              | 165                    | 415       |
| ASTM A106 Gr B | 300              | 158                    | 415       |
| ASTM A106 Gr B | 350              | 150                    | 415       |
| ASTM A106 Gr B | 400              | 138                    | 415       |
| ASTM A335 P11  | Up to 200        | 185                    | 485       |
| ASTM A335 P11  | 350              | 170                    | 485       |
| ASTM A335 P11  | 450              | 155                    | 485       |
| ASTM A335 P11  | 550              | 130                    | 485       |

Table A-4: Minimum Wall Thickness Requirements

| Pipe Diameter (mm) | Schedule | Min Wall Thickness (mm) | Weight (kg/m) |
|---------------------|----------|-------------------------|---------------|
| 200                 | 40       | 8.18                    | 38.7          |
| 200                 | 80       | 12.70                   | 56.0          |
| 300                 | 40       | 9.27                    | 64.6          |
| 500                 | 40       | 9.53                    | 115.7         |
| 500                 | 80       | 20.62                   | 241.5         |
| 800                 | 40       | 9.53                    | 186.2         |

Section B.1 - Safety Factor Requirements
Minimum safety factor for pressure-bearing components: 1.5
For critical service (H2, H2S, HF): 2.0
For emergency/relief systems: 3.0""",
        "page": 18,
        "subtopic": "Allowable Stress Table A-3",
    },
    {
        "id": "inspection-report-c301",
        "title": "Inspection Report - Column C-301",
        "source": "Inspection_Report_C301_Aug2026.pdf",
        "content": """Inspection Report: Distillation Column C-301
Report No: MRPL-IR-2026-0847 | Date: August 15, 2026
Inspector: K. Subramaniam, Certified Pressure Vessel Inspector

1. Executive Summary
Scheduled integrity assessment of Column C-301 (Main Atmospheric Distillation Column)
completed on August 12-14, 2026. Overall condition: SATISFACTORY with observations.

2. Inspection Scope
- External visual inspection of shell, nozzles, and supports
- Internal inspection of trays 1-45, downcomers, and weir plates
- Ultrasonic thickness measurements at 48 grid points
- Magnetic particle testing of all nozzle welds
- Hardness testing of HAZ zones

3. Key Findings
3.1 Shell Thickness: Within acceptable limits. Minimum measured: 22.1mm 
    (original: 25mm, retirement: 18.75mm). Corrosion rate: 0.15mm/year.
3.2 Tray Condition: Trays 12-15 show moderate fouling. Recommended cleaning 
    during next scheduled turnaround.
3.3 Nozzle N-4 (500mm feed inlet): Minor surface corrosion observed on the 
    reinforcement pad. No structural concern at this time.
3.4 Support skirt: No defects found. Base ring bolts torqued to specification.

4. Recommendations
4.1 PRIORITY: Schedule cleaning of trays 12-15 during Q1 2027 turnaround.
4.2 ROUTINE: Continue monitoring nozzle N-4 corrosion in next inspection cycle.
4.3 ROUTINE: Next UT thickness survey recommended in 12 months.

5. Approval Required
This report requires Note for Approval (NFA) sign-off by:
- Head of Inspection: _______________
- Chief Engineer (Process): _______________
- Plant Manager: _______________""",
        "page": 3,
        "subtopic": "Key Findings Summary",
    },
]


class KnowledgeBase:
    """Local vector store for document retrieval. Uses ChromaDB when available,
    falls back to simple text matching for the prototype."""

    def __init__(self):
        self._documents = {doc["id"]: doc for doc in SAMPLE_DOCUMENTS}
        self._chroma_client = None
        self._collection = None
        self._initialized = False

    async def initialize(self):
        """Try to initialize ChromaDB; fall back to in-memory search."""
        try:
            import chromadb
            self._chroma_client = chromadb.Client()
            self._collection = self._chroma_client.get_or_create_collection(
                name="mrpl_knowledge",
                metadata={"hnsw:space": "cosine"},
            )
            # Ingest sample documents if collection is empty
            if self._collection.count() == 0:
                ids = []
                documents = []
                metadatas = []
                for doc in SAMPLE_DOCUMENTS:
                    ids.append(doc["id"])
                    documents.append(doc["content"])
                    metadatas.append({
                        "source": doc["source"],
                        "title": doc["title"],
                        "page": doc["page"],
                        "subtopic": doc["subtopic"],
                    })
                self._collection.add(
                    ids=ids, documents=documents, metadatas=metadatas
                )
                logger.info(f"Ingested {len(ids)} documents into ChromaDB")
            self._initialized = True
            logger.info("ChromaDB knowledge base initialized successfully")
        except Exception as e:
            logger.warning(f"ChromaDB init failed ({e}), using fallback text search")
            self._initialized = True  # Mark as initialized even with fallback

    async def search(self, query: str, n_results: int = 3) -> List[Dict[str, Any]]:
        """Search the knowledge base for relevant document chunks."""
        if self._collection is not None:
            try:
                results = self._collection.query(
                    query_texts=[query], n_results=n_results
                )
                chunks = []
                for i, doc_id in enumerate(results["ids"][0]):
                    chunks.append({
                        "id": doc_id,
                        "content": results["documents"][0][i],
                        "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                        "distance": results["distances"][0][i] if results["distances"] else 0,
                    })
                return chunks
            except Exception as e:
                logger.error(f"ChromaDB search failed: {e}")

        # Fallback: simple keyword matching
        return self._keyword_search(query, n_results)

    def _keyword_search(self, query: str, n_results: int) -> List[Dict[str, Any]]:
        """Simple keyword-based fallback search."""
        query_lower = query.lower()
        scored = []
        for doc in SAMPLE_DOCUMENTS:
            score = 0
            words = query_lower.split()
            content_lower = doc["content"].lower()
            for word in words:
                if word in content_lower:
                    score += content_lower.count(word)
            if score > 0:
                scored.append((score, doc))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [
            {
                "id": doc["id"],
                "content": doc["content"],
                "metadata": {
                    "source": doc["source"],
                    "title": doc["title"],
                    "page": doc["page"],
                    "subtopic": doc["subtopic"],
                },
                "distance": 1.0 / (score + 1),
            }
            for score, doc in scored[:n_results]
        ]

    def get_all_documents(self) -> List[Dict[str, str]]:
        """Return metadata for all ingested documents."""
        return [
            {"id": d["id"], "title": d["title"], "source": d["source"]}
            for d in SAMPLE_DOCUMENTS
        ]


# Singleton instance
knowledge_base = KnowledgeBase()
