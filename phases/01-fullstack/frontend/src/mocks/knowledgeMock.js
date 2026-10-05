// Mock data for the Knowledge Agent — matches CONTRACTS.md Section 1 exactly
export const knowledgeMockResponse = {
  answer: "The SOP specifies a maximum operating pressure of 12 MPa for 500mm class pipes.",
  thinking_trace: [
    "Searched local knowledge base for '500mm pipe pressure'",
    "Found match in Pressure_Safety_SOP_v3.pdf",
    "Confirmed value against page 12 table"
  ],
  citations: [
    {
      document: "Pressure_Safety_SOP_v3.pdf",
      page: 12,
      subtopic: "Section 4.2 - Pressure Class Limits"
    }
  ],
  grounded: true
};

// Simulates a "not grounded" response — KB had no match
export const knowledgeUngroundedResponse = {
  answer: "",
  thinking_trace: [
    "Searched local knowledge base for 'reactor coolant flow rate'",
    "No matching documents found in organization knowledge base"
  ],
  citations: [],
  grounded: false
};
