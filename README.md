# CentsFlow AI ¢

> A production-grade, asynchronous personal finance pipeline that parses WhatsApp text streams into a structured Next.js 14 business intelligence dashboard via n8n automation workflows and LLM telemetry.

[![Deployment: Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://centsflow-ai.vercel.app)
[![Engine: Next.js 14](https://img.shields.io/badge/Engine-Next.js%2014-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![LLM Runtime: Groq](https://img.shields.io/badge/LLM_Runtime-Groq-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)

---

## 🛠️ System Architecture & Data Flow

CentsFlow AI processes unformatted text inputs through an event-driven, decoupled execution pipeline before serving the metrics layer:

```text
[ WhatsApp Client ]
        │
        ▼  (Raw Text Input: e.g., "Spent 450 PKR on fuel")
[ Evolution API ]
        │
        ▼  (Webhook Event Payload)
[ n8n Automation Engine ]
        │
        ▼  (JSON Extraction Payload)
[ Groq Inference API (Llama 3) ] ──► [ Schema Validation Layer ]
        │
        ▼  (Structured JSON Object)
[ Live Dashboard View ] ◄── [ Supabase Postgres Engine ]
```

1. **Ingress:** The user transmits a natural language message to the specialized WhatsApp gateway container handled by **Evolution API**.
2. **Orchestration:** Evolution API fires an asynchronous webhook notification triggering an active **n8n workflow**.
3. **Inference:** n8n isolates the text block and routes it to the **Groq API Engine** running Llama 3, extracting structural data entities against a rigid JSON schema.
4. **Persistence:** The parsed data entity is committed to **Supabase (PostgreSQL)**, tracking the metadata against the user's isolated WhatsApp identifier.
5. **Visualization:** The Next.js frontend renders live rows and re-validates instantly through Supabase Realtime subscriptions.

---

## 💻 Tech Stack

* **Frontend Framework:** Next.js 14 (App Router Architecture, Server Components, TypeScript compilation).
* **Identity Management:** Clerk (JWT validation layers).
* **Database Layer:** Supabase PostgreSQL engine featuring optimized indexing keys.
* **Inference Pipeline:** Groq SDK leveraging low-latency hardware execution for Llama 3 core models.
* **Telemetry & Charts:** Recharts visualization library (Responsive SVG component compositions).
* **Asynchronous Pipelines:** Self-hosted/Cloud n8n instance using structured webhook listener topologies.

---

## 🗄️ Database Schema Blueprint

### Table Name: `expenses`

| Column Name   | Data Type     | Key Constraints           | Description / Metadata Origin                          |
| :------------ | :------------ | :------------------------ | :----------------------------------------------------- |
| `id`          | `int8`        | `PRIMARY KEY`, `IDENTITY` | Auto-incrementing internal system key.                 |
| `created_at`  | `timestamptz` | `DEFAULT: now()`          | Global timestamp record for chronological tracking.    |
| `amount`      | `numeric`     | `NOT NULL`                | High-precision numeric mapping for financial balances. |
| `currency`    | `text`        | `DEFAULT: 'PKR'`          | ISO currency identifier parsed from transaction text.  |
| `category`    | `text`        | `NOT NULL`                | Operational segment string utilized in charting maps.  |
| `description` | `text`        | `NULLABLE`                | Raw structural parsing log for detailed audit listings.|
| `user_id`     | `text`        | `INDEXED`                 | WhatsApp remote JID payload (`sender.phone`).          |

---

## ⚙️ Automation Interface (n8n Mapping Specs)

The n8n system processes data variables and targets the Supabase insert instance via this precise declarative payload map:

```json
{
  "amount": "{{ $json.amount }}",
  "currency": "{{ JSON.stringify($json.currency) }}",
  "category": "{{ JSON.stringify($json.category) }}",
  "description": "{{ JSON.stringify($json.description) }}",
  "user_id": "{{ JSON.stringify($('Receive Message').item.json.data.key.remoteJid.replace('@s.whatsapp.net', '')) }}"
}
```

---

## 🧑‍💻 Author

Developed and maintained by **[JunaidAhmed13](https://github.com/JunaidAhmed13)**.
