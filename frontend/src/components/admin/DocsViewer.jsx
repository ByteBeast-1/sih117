import React from 'react';
import {
  DocPageLayout, DocHeading, DocSubheading, DocH3, DocParagraph,
  DocCode, DocCallout, DocList, DocNumberedHeading
} from './DocPrimitives';

export default function DocsViewer({ subPage }) {
  const pages = {
    'docs-guide': <GuidePage />,
    'docs-setup': <SetupPage />,
    'docs-config': <ConfigPage />,
  };

  return pages[subPage] || <GuidePage />;
}

// -------------------------------------------------------------
// GUIDE PAGE
// -------------------------------------------------------------
function GuidePage() {
  const toc = [
    { id: 'objectives', label: 'Objectives' },
    { id: 'architecture-overview', label: 'Architecture Overview' },
    { id: 'rag-pipeline', label: 'RAG Pipeline' },
    { id: 'sandbox-isolation', label: 'Sandbox Isolation' },
    { id: 'supervisor-routing', label: 'Supervisor Routing' },
  ];

  return (
    <DocPageLayout 
      breadcrumbs={['Documentation', 'User Guides', 'System Overview']}
      title="Sovereign Workbench Overview"
      lead="Understand the core architecture, security boundaries, and agent workflows that power the on-premise AI assistant."
      toc={toc}
    >
      <DocHeading id="objectives">Objectives</DocHeading>
      <DocParagraph>
        The Sovereign AI Workbench is explicitly designed to address the unique challenges of industrial operations, specifically for organizations like MRPL that handle sensitive intellectual property, P&ID diagrams, and critical infrastructure data. 
      </DocParagraph>
      <DocParagraph>
        Our primary objective is to provide an <strong>air-gapped, on-premise AI ecosystem</strong> that rivals cloud-hosted assistants in capability, without compromising on data sovereignty. The system guarantees that zero data leaves the corporate intranet, leveraging locally hosted Large Language Models (LLMs) via Ollama.
      </DocParagraph>
      <DocList items={[
        'Provide instant, cited retrieval of technical Standard Operating Procedures (SOPs).',
        'Automate complex engineering calculations with verifiable, step-by-step mathematical proofs.',
        'Enable visual analysis of industrial diagrams and schematics directly on edge hardware.',
        'Ensure absolute security through Dockerized, network-isolated code execution sandboxes.'
      ]} />

      <DocSubheading id="architecture-overview">Architecture Overview</DocSubheading>
      <DocParagraph>
        At its core, the workbench is built upon a microservices architecture that strictly separates user interfaces, gateway routing, intelligence (LLMs), and dangerous execution environments.
      </DocParagraph>
      <DocCallout type="info">
        By decoupling the <strong>Agents Service</strong> from the <strong>FastAPI Gateway</strong>, we ensure that the frontend can never directly interact with the AI models or the sandboxed environment, enforcing a strict zero-trust boundary.
      </DocCallout>

      <DocSubheading id="rag-pipeline">RAG Pipeline</DocSubheading>
      <DocParagraph>
        The Knowledge Agent utilizes an advanced Retrieval-Augmented Generation (RAG) pipeline optimized for dense technical documentation. Unlike standard consumer RAG systems, our implementation relies heavily on semantic chunking tailored for engineering manuals.
      </DocParagraph>
      <DocParagraph>
        When an engineer queries a standard (e.g., API 610 for centrifugal pumps), the system generates embeddings locally, queries the vector store, and forces the local Qwen model to ground its response explicitly in the retrieved context. A <code>grounded: true</code> flag is returned only if the confidence threshold is met, ensuring no hallucinations in critical technical advice.
      </DocParagraph>

      <DocSubheading id="sandbox-isolation">Sandbox Isolation</DocSubheading>
      <DocParagraph>
        Code generation is handled by the <code>qwen2.5-coder</code> model. However, generated code is never executed on the host system. It is passed to the Sandbox Service — a tightly constrained Docker environment.
      </DocParagraph>
      <DocList items={[
        'No external network access (bridge network disabled).',
        'CPU and memory limitations enforced via Docker cgroups.',
        'Ephemeral filesystems: containers are destroyed immediately after execution.',
        'Strict NON_NEGOTIABLE policy: Any generated code that modifies files requires an explicit user confirmation handshake before execution.'
      ]} />

      <DocSubheading id="supervisor-routing">Supervisor Routing</DocSubheading>
      <DocParagraph>
        For complex tasks (e.g., "Analyze this P&ID and calculate the pressure drop across valve V-102"), the Supervisor Agent acts as an orchestrator. It breaks the prompt into a Directed Acyclic Graph (DAG) of sub-tasks, routing the image to the Vision Agent and the subsequent math to the Calculation Agent, synthesizing the final deliverable seamlessly.
      </DocParagraph>
    </DocPageLayout>
  );
}

// -------------------------------------------------------------
// SETUP PAGE
// -------------------------------------------------------------
function SetupPage() {
  const toc = [
    { id: 'prerequisites', label: 'Prerequisites' },
    { id: 'docker-bundle', label: 'Docker Bundle (Recommended)' },
    { id: 'ollama-setup', label: 'Ollama Setup' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
  ];

  return (
    <DocPageLayout
      breadcrumbs={['Documentation', 'Installation', 'Quick Start']}
      title="Installation & Setup"
      lead="Deploy the Sovereign Workbench on your local hardware using our pre-configured Docker bundles or via manual installation."
      toc={toc}
    >
      <DocCallout type="info">
        <strong>Nothing running yet?</strong><br />
        Follow these steps to take your instance from an empty repository to a working, multi-agent AI workbench. 
      </DocCallout>

      <DocSubheading id="prerequisites">Prerequisites</DocSubheading>
      <DocParagraph>
        Because this system runs LLMs completely offline, the host machine must meet strict hardware requirements.
      </DocParagraph>
      <div className="overflow-x-auto mb-6 rounded-xl border border-[#2a2a2a]">
        <table className="w-full text-base" style={{ color: '#d1d5db' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a', background: '#171717' }}>
              <th className="text-left py-3 px-4 font-semibold text-white">Component</th>
              <th className="text-left py-3 px-4 font-semibold text-white">Minimum Required</th>
              <th className="text-left py-3 px-4 font-semibold text-white">Recommended</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ divideColor: '#1e1e1e' }}>
            <tr>
              <td className="py-3 px-4 font-medium text-white text-sm">GPU</td>
              <td className="py-3 px-4 text-sm">NVIDIA RTX 3050 (4GB VRAM)</td>
              <td className="py-3 px-4 text-sm">NVIDIA RTX 4060 (8GB VRAM) or higher</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-white text-sm">RAM</td>
              <td className="py-3 px-4 text-sm">16 GB DDR4</td>
              <td className="py-3 px-4 text-sm">32 GB DDR5</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-white text-sm">Storage</td>
              <td className="py-3 px-4 text-sm">50 GB SSD</td>
              <td className="py-3 px-4 text-sm">100 GB NVMe SSD</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-white text-sm">Software</td>
              <td className="py-3 px-4 text-sm">Docker Desktop, Ollama v0.3+</td>
              <td className="py-3 px-4 text-sm">NVIDIA Container Toolkit enabled</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocNumberedHeading number="1" id="docker-bundle">Docker Bundle (Recommended)</DocNumberedHeading>
      <DocParagraph>
        The Docker bundle orchestrates the React frontend, the FastAPI gateway, and the isolated sandbox environment simultaneously.
      </DocParagraph>
      <DocCode>{`# 1. Clone the repository
git clone https://github.com/SakthiCharukeshS/SIH26-Workbench.git
cd SIH26-Workbench

# 2. Configure environment variables
cp phases/01-fullstack/.env.example phases/01-fullstack/.env
cp phases/01-fullstack/app/.env.example phases/01-fullstack/app/.env

# 3. Launch the stack in detached mode
docker compose up --build -d`}</DocCode>

      <DocNumberedHeading number="2" id="ollama-setup">Ollama Setup</DocNumberedHeading>
      <DocParagraph>
        Ollama must be installed natively on the host machine to easily utilize GPU acceleration without complex Docker GPU passthrough networking.
      </DocParagraph>
      <DocCode>{`# 1. Download and install Ollama from https://ollama.com

# 2. Bind Ollama to all network interfaces (Required for Docker bridge network access)
# Windows (PowerShell):
[Environment]::SetEnvironmentVariable("OLLAMA_HOST", "0.0.0.0", "Machine")

# 3. Pull the required models (fits in 4GB VRAM)
ollama pull qwen2.5:1.5b
ollama pull qwen2.5-coder:1.5b`}</DocCode>
      
      <DocCallout type="warning">
        If you skip setting <code>OLLAMA_HOST=0.0.0.0</code>, the Docker containers will fail to communicate with Ollama, resulting in a "Connection Refused" error in the AI Agents.
      </DocCallout>

      <DocNumberedHeading number="3" id="troubleshooting">Troubleshooting</DocNumberedHeading>
      
      <DocH3>If nothing loads</DocH3>
      <DocParagraph>
        Ensure Docker is running and verify the container statuses using <code>docker ps</code>. Check the frontend logs via <code>docker logs sih-frontend</code>. Make sure port 5173 is not currently occupied by another Vite instance on your machine.
      </DocParagraph>

      <DocH3>If no model answers</DocH3>
      <DocParagraph>
        Navigate to the <strong>Model Registry</strong> in the Admin Dashboard. Check if the connection indicator is red. If so, verify that your <code>OLLAMA_BASE_URL</code> environment variable points to the correct host IP (use your machine's LAN IP, e.g., <code>192.168.1.x</code>, rather than <code>localhost</code>, as localhost inside Docker refers to the container itself).
      </DocParagraph>

    </DocPageLayout>
  );
}

// -------------------------------------------------------------
// CONFIG PAGE
// -------------------------------------------------------------
function ConfigPage() {
  const toc = [
    { id: 'core-env-vars', label: 'Core Variables' },
    { id: 'model-config', label: 'Model Configuration' },
    { id: 'network-bindings', label: 'Network Bindings' },
  ];

  return (
    <DocPageLayout
      breadcrumbs={['Documentation', 'Configuration', 'Environment & Models']}
      title="System Configuration"
      lead="Manage environment variables, model registries, and network bindings safely without modifying source code."
      toc={toc}
    >
      <DocSubheading id="core-env-vars">Core Variables</DocSubheading>
      <DocParagraph>
        The backend API and frontend both rely on <code>.env</code> files for configuration. The system is designed to gracefully degrade or alert you if critical variables are missing.
      </DocParagraph>
      <div className="overflow-x-auto mb-6 rounded-xl border border-[#2a2a2a]">
        <table className="w-full text-base" style={{ color: '#d1d5db' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a', background: '#171717' }}>
              <th className="text-left py-3 px-4 font-semibold text-white">Variable</th>
              <th className="text-left py-3 px-4 font-semibold text-white">Required?</th>
              <th className="text-left py-3 px-4 font-semibold text-white">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ divideColor: '#1e1e1e' }}>
            <tr>
              <td className="py-3 px-4 font-mono text-sm" style={{ color: '#60a5fa' }}>JWT_SECRET_KEY</td>
              <td className="py-3 px-4 text-sm text-red-400">Yes</td>
              <td className="py-3 px-4 text-sm">Cryptographic key used to sign authorization tokens. Must be a 32+ character secure string in production.</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-mono text-sm" style={{ color: '#60a5fa' }}>OLLAMA_BASE_URL</td>
              <td className="py-3 px-4 text-sm text-red-400">Yes</td>
              <td className="py-3 px-4 text-sm">The HTTP endpoint for the host's Ollama instance. Default: <code>http://host.docker.internal:11434</code>.</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-mono text-sm" style={{ color: '#60a5fa' }}>VITE_API_URL</td>
              <td className="py-3 px-4 text-sm text-green-400">Optional</td>
              <td className="py-3 px-4 text-sm">Points the frontend to the FastAPI gateway. Defaults to port 8000 on the current origin.</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-mono text-sm" style={{ color: '#60a5fa' }}>SANDBOX_TIMEOUT</td>
              <td className="py-3 px-4 text-sm text-green-400">Optional</td>
              <td className="py-3 px-4 text-sm">Maximum execution time for generated code in seconds. Defaults to 30s.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocSubheading id="model-config">Model Configuration</DocSubheading>
      <DocParagraph>
        Rather than hardcoding model names, the Sovereign Workbench uses a dynamic registry. You can modify this via the <strong>Admin Dashboard &gt; Model Registry</strong> UI, which updates the internal JSON definition.
      </DocParagraph>
      <DocCode>{`{
  "active_models": [
    { 
      "id": "qwen2.5:1.5b", 
      "capabilities": ["rag", "chat", "supervisor"],
      "max_context": 8192
    },
    { 
      "id": "qwen2.5-coder:1.5b", 
      "capabilities": ["code_generation", "math"],
      "max_context": 8192
    }
  ]
}`}</DocCode>
      <DocParagraph>
        When the Supervisor agent delegates tasks, it actively queries this registry to find an online model whose capabilities match the required sub-task.
      </DocParagraph>

      <DocSubheading id="network-bindings">Network Bindings</DocSubheading>
      <DocParagraph>
        By default, the Docker compose file binds to <code>0.0.0.0</code>, meaning the workbench is accessible from any machine on your local Area Network (LAN). If you wish to restrict access purely to the host machine, modify the <code>docker-compose.yml</code> port bindings from <code>"5173:5173"</code> to <code>"127.0.0.1:5173:5173"</code>.
      </DocParagraph>
    </DocPageLayout>
  );
}
