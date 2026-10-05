import React from 'react';
import {
  DocPageLayout, DocHeading, DocSubheading, DocH3, DocParagraph,
  DocCode, DocCallout, DocList,
} from './DocPrimitives';

export default function FeaturesArchitecture() {
  const toc = [
    { id: 'architecture', label: 'System Architecture' },
    { id: 'capabilities', label: 'Agent Capabilities' },
    { id: 'security', label: 'Security' },
    { id: 'tech-stack', label: 'Technology Stack' },
  ];

  return (
    <DocPageLayout toc={toc}>
      <DocHeading id="architecture">Features & Architecture</DocHeading>
      <DocParagraph>
        Technical overview of the Sovereign Workbench system design,
        component architecture, and capabilities.
      </DocParagraph>

      <DocSubheading id="architecture">System Architecture</DocSubheading>
      <DocParagraph>
        The workbench follows a 3-tier architecture with strict service isolation.
        The frontend never communicates directly with AI models — all requests
        are proxied through the backend gateway.
      </DocParagraph>

      <DocCode>{`┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser   │────▶│  FastAPI Gateway  │────▶│  Agents Service │
│  (React)    │     │   (Port 8000)    │     │   (Port 9000)   │
│  Port 5173  │◀────│   JWT Auth       │◀────│   Ollama Client │
└─────────────┘     │   CORS           │     │   RAG Pipeline  │
                    │   Proxy Layer    │     │   Model Router  │
                    └──────────────────┘     └────────┬────────┘
                                                      │
                                             ┌────────▼────────┐
                                             │  Sandbox Service │
                                             │   (Port 9100)   │
                                             │  Code Execution  │
                                             └─────────────────┘`}</DocCode>

      <DocH3 id="request-flow">Request Flow</DocH3>
      <DocList items={[
        'Client sends request to Gateway (e.g., POST /api/v1/agents/knowledge/ask)',
        'Gateway verifies JWT token and checks user role',
        'Gateway forwards to Agents Service (internal endpoint, not exposed)',
        'Agents Service routes to the correct model via the Model Router',
        'Response flows back through Gateway to the client',
        'For code execution: Agents Service calls Sandbox Service internally',
      ]} />

      <DocCallout type="info">
        The Sandbox Service (port 9100) is never exposed to the browser or external
        network. It only accepts requests from the Agents Service over the internal
        Docker network.
      </DocCallout>

      <DocSubheading id="capabilities">Agent Capabilities</DocSubheading>
      <div className="space-y-4 mb-8">
        {[
          { name: 'Knowledge Agent', endpoint: 'POST /internal/agents/knowledge/ask', desc: 'RAG-based Q&A grounded in organization documents.' },
          { name: 'Math Agent', endpoint: 'POST /internal/agents/math/calculate', desc: 'Step-by-step engineering calculations with standard referencing.' },
          { name: 'Vision Agent', endpoint: 'POST /internal/agents/vision/analyze', desc: 'P&ID / schematic analysis via multipart upload.' },
          { name: 'Supervisor Agent', endpoint: 'POST /internal/agents/supervisor/message', desc: 'Multi-agent orchestration and task routing.' },
          { name: 'Generation Agent', endpoint: 'GET /internal/agents/generation/status', desc: 'Async document generation (.docx/.pdf deliverables).' },
          { name: 'Code Execution', endpoint: 'POST /internal/sandbox/execute', desc: 'Sandboxed code runner. Edit confirmation required (NON_NEGOTIABLE).' },
        ].map((agent) => (
          <div
            key={agent.name}
            className="p-5 rounded-xl"
            style={{ background: '#171717', border: '1px solid #2a2a2a' }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
              <p className="text-base font-bold text-white">{agent.name}</p>
              <code className="text-[11px] font-mono px-2 py-1 rounded" style={{ background: '#0d0d0d', color: '#60a5fa' }}>
                {agent.endpoint}
              </code>
            </div>
            <p className="text-sm" style={{ color: '#a3a3a3' }}>{agent.desc}</p>
          </div>
        ))}
      </div>

      <DocSubheading id="security">Security</DocSubheading>
      <DocList items={[
        'Air-gapped: Zero external API calls. All models and data stay on-premise.',
        'JWT Authentication: Every request requires a valid Bearer token.',
        'Role-Based Access: admin role for system management, user role for workbench.',
        'Bcrypt Password Hashing: Industry-standard slow hashing to resist brute force.',
        'Sandboxed Execution: Code runs in isolated containers with no network access.',
        'Edit Confirmation: File modifications require explicit user approval (NON_NEGOTIABLE).',
      ]} />

      <DocSubheading id="tech-stack">Technology Stack</DocSubheading>
      <div className="overflow-x-auto mb-8 rounded-xl border border-[#2a2a2a]">
        <table className="w-full text-base" style={{ color: '#d1d5db' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a', background: '#171717' }}>
              <th className="text-left py-3 px-4 font-semibold text-white">Layer</th>
              <th className="text-left py-3 px-4 font-semibold text-white">Technology</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ divideColor: '#1e1e1e' }}>
            {[
              ['Frontend', 'React 18 + Vite + Tailwind CSS + Lucide Icons'],
              ['Backend Gateway', 'FastAPI (Python 3.11+) + Uvicorn'],
              ['Database', 'SQLite (async via aiosqlite) — PostgreSQL-ready'],
              ['Auth', 'JWT (python-jose) + bcrypt (passlib)'],
              ['AI Runtime', 'Ollama (local LLM serving)'],
              ['Models', 'Qwen 2.5 (1.5B general) + Qwen 2.5 Coder (1.5B)'],
              ['Containerization', 'Docker + Docker Compose'],
            ].map(([layer, tech]) => (
              <tr key={layer}>
                <td className="py-3 px-4 font-medium text-white text-sm">{layer}</td>
                <td className="py-3 px-4 text-sm">{tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DocPageLayout>
  );
}
