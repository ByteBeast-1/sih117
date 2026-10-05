// Mock data for the Blueprint/Vision Agent — matches CONTRACTS.md Section 5 exactly
export const blueprintMockResponse = {
  extracted_summary: "P&ID shows a 500mm pipe run through valve V-204...",
  structured_fields: {
    equipment_tags: ["V-204"],
    pressure_readings_mpa: [12]
  },
  yield_prediction: {
    estimated_yield_pct: 87.4,
    note: "Prototype placeholder model"
  },
  citations: [
    {
      document: "uploaded_pid_scan.pdf",
      page: 1
    }
  ]
};
