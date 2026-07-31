# Local LLM Integration Guide (`llama.cpp`)

This document provides a detailed technical overview of the local Large Language Model (LLM) integration within the Enterprise Knowledge Assistant, utilizing `llama.cpp` and the Qwen 3.5 9B IT model (`qwen-3.5-9b-it.gguf`).

---

## 1. Overview & Architecture Strategy

To ensure zero data exfiltration, low latency, cost efficiency, and offline resilience, the Enterprise Knowledge Assistant employs a **local-first LLM inference strategy**. 

Instead of relying on cloud-hosted API providers, model inference is offloaded to a local server binary (`llama-server.exe`) running directly within the enterprise environment. The TypeScript application layer ([`src/llm/llamaClient.ts`](file:///c:/Users/Parth/Desktop/airlearn/src/llm/llamaClient.ts)) communicates with this process over HTTP using OpenAI-compatible endpoints. Model provisioning and setup are automated via the python model manager ([`scripts/ensure_model.py`](file:///c:/Users/Parth/Desktop/airlearn/scripts/ensure_model.py)).

```
┌────────────────────────────────────────────────────────┐
│             Enterprise Knowledge Assistant             │
│                                                        │
│   ┌──────────────────┐        ┌────────────────────┐   │
│   │ HybridRetriever  │        │ GroundingVerifier  │   │
│   └────────┬─────────┘        └────────▲───────────┘   │
│            │ (Top Candidates)          │               │
│            ▼                           │ (Verification)│
│   ┌────────────────────────────────────┴───────────┐   │
│   │                 AnswerGenerator                │   │
│   └────────────────────────┬───────────────────────┘   │
└────────────────────────────┼───────────────────────────┘
                             │ HTTP / POST /v1/chat/completions (Port 8085)
                             ▼
┌────────────────────────────────────────────────────────┐
│             Local Inference Subsystem                  │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │               llama-server.exe                 │   │
│   │   (Port 8085 / CUDA Offload -ngl 99 RTX 5050)  │   │
│   └────────────────────────┬───────────────────────┘   │
│                            │ Offloaded Layers (100%)   │
│                            ▼                           │
│   ┌────────────────────────────────────────────────┐   │
│   │         models/qwen-3.5-9b-it.gguf (4.68 GB)    │   │
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

### Key Technical Benefits
- **Zero-Trust Data Privacy**: Enterprise documents and queries never leave the internal machine boundary.
- **Predictable Latency & Throughput**: Hardware-accelerated GPU inference delivers fast response times (~95–110 tokens/sec) without rate limits or API throttles.
- **Automated Model Provisioning**: Model weights are verified and managed by [`scripts/ensure_model.py`](file:///c:/Users/Parth/Desktop/airlearn/scripts/ensure_model.py).
- **Automatic High-Availability Degradation**: If `llama-server` is offline or crashes, the system gracefully falls back to deterministic heuristic NLI synthesis.

---

## 2. Local Environment Specification

The local setup is optimized for Windows environments with NVIDIA GPU acceleration (RTX 5050 8GB VRAM) via CUDA.

| Parameter | Configuration Value | Description |
|---|---|---|
| **Model** | Qwen 3.5 9B IT | `qwen-3.5-9b-it.gguf` (4.68 GB) |
| **Model Path** | `models/qwen-3.5-9b-it.gguf` | Path to the quantized GGUF weights |
| **Executable** | `llama-server.exe` | Compiled `llama.cpp` server binary |
| **Model Manager** | [`scripts/ensure_model.py`](file:///c:/Users/Parth/Desktop/airlearn/scripts/ensure_model.py) | Python manager script for auto-downloading and verifying weights |
| **Port** | `8085` | Dedicated HTTP port for `llama-server` |
| **GPU Offloading** | `-ngl 99` | Offloads 100% of model layers to GPU VRAM |
| **Context Window** | `-c 4096` | 4096-token context window |
