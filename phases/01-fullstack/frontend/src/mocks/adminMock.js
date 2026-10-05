// Mock data for Admin Dashboard — matches CONTRACTS.md Sections 6 & 7 exactly
export const modelRegistryMock = {
  models: [
    { name: "qwen2.5:7b-instruct", role: "reasoning", status: "loaded" },
    { name: "qwen2.5-coder:7b", role: "coding", status: "loaded" }
  ]
};

export const networkStatusMock = {
  outbound_bytes_total: 0,
  measured_at: new Date().toISOString()
};

export const serverStatusMock = {
  connections: [
    { user: "admin", ip: "192.168.1.50", connected_since: "2026-09-03T10:00:00Z" },
    { user: "client", ip: "192.168.1.51", connected_since: "2026-09-03T10:05:00Z" }
  ],
  services: [
    { name: "FastAPI Gateway", status: "healthy", uptime: "2h 15m" },
    { name: "Agents Service", status: "healthy", uptime: "2h 15m" },
    { name: "Ollama (Model Server)", status: "healthy", uptime: "2h 10m" },
    { name: "ChromaDB (RAG)", status: "healthy", uptime: "2h 12m" }
  ],
  gpu: {
    name: "NVIDIA RTX 4060",
    vram_used_gb: 5.2,
    vram_total_gb: 8.0,
    utilization_pct: 65
  }
};
