// Mock data for the Math Agent — matches CONTRACTS.md Section 2 exactly
export const mathMockResponse = {
  final_answer: "Hoop stress ≈ 150 MPa",
  steps: [
    "Formula: σ = (P × D) / (2 × t)",
    "Substituting P=12MPa, D=500mm, t=20mm",
    "σ = (12 × 500) / (2 × 20) = 150 MPa"
  ],
  grounded: true,
  citations: [
    {
      document: "Engineering_Formulas_Handbook.pdf",
      page: 4,
      subtopic: "Hoop Stress Formula"
    }
  ]
};
