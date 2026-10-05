# Sub-Phase 4 — Network Proof & Monitoring

## Goal

Build the actual, measured zero-outbound-bytes proof — the single most important technical claim
in the whole project (`NON_NEGOTIABLES.md` rule c) — plus basic GPU stats for the Admin Dashboard.

## Tech Stack

`tcpdump` (or a Python packet-counting library like `psutil` for interface byte counters) +
`nvidia-smi`.

## Expected Files After This Sub-Phase

```
phases/03-devops-infra/
  monitoring/
    network_monitor.py     # measures real outbound bytes on non-local interfaces
    gpu_monitor.py          # wraps nvidia-smi, returns utilization/VRAM/temp
    app.py                  # small FastAPI or file-writer exposing ../CONTRACTS.md Section 3
```

## What "Outbound" Actually Means Here

Before building the monitor: it measures traffic to the **public internet**, not traffic on the
local network. Employees' laptops talking to this server over LAN/WiFi is normal and must NOT
show up as "outbound" — only packets addressed outside the local subnet count. This is why the
tcpdump filter below excludes local ranges (`127.0.0.0/8`, `172.16.0.0/12`, and add your actual
LAN subnet, e.g. `192.168.0.0/16`, if it isn't already covered) — anything outside those ranges
is a real violation and should trip an alert, not just a log line.

Full explanation of this LAN-vs-internet distinction, and the separate stricter no-network-at-all
rule for the sandbox container specifically, is in `NON_NEGOTIABLES.md` rule (c) — read that
first if anything here is unclear.

## Setup Steps

1. Verify manually first: `sudo tcpdump -i any 'not (net 127.0.0.0/8 or net 172.16.0.0/12)' -c 20`
   while exercising the running stack — confirm you see zero relevant packets before automating it.
2. Build `network_monitor.py`: either shell out to `tcpdump` and parse output, or use `psutil`'s
   network interface counters and track the delta on any non-local/non-Docker-bridge interface.
3. Build `gpu_monitor.py`: shell out to `nvidia-smi --query-gpu=utilization.gpu,memory.used,
   memory.total,temperature.gpu --format=csv` and parse it.
4. Expose both via the shape in `../CONTRACTS.md` Section 3, either as its own small endpoint or
   written to a file Full-Stack's backend reads — pick whichever is simpler for your setup and
   note the choice in `../CONTRACTS.md`.

## What "Done" Looks Like

- The reported `outbound_bytes_total` is a real, live measurement, confirmed against the manual
  `tcpdump` check from step 1 — not a hardcoded zero.
- GPU stats update in real time as models are actually being used (watch VRAM climb during an
  inference call).
- **If this number is ever nonzero during normal operation, that's a real bug to fix immediately**
  — trace exactly what made the call and remove it. Don't hide the number instead of fixing the cause.

## Hands Off To

Full-Stack's Admin Dashboard (sub-phase 4) displays this data as the demo's proof-of-sovereignty centerpiece.
