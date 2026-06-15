# CentsFlow AI ¢

WhatsApp-powered personal finance dashboard. Text your expenses, AI parses them, see everything in one place.

**Live:** [centsflow-ai.vercel.app](https://centsflow-ai.vercel.app)

---

## Stack

- **Next.js 14** — App Router, TypeScript
- **Clerk** — Phone number authentication
- **Supabase** — PostgreSQL database
- **Groq (Llama 3)** — AI expense parsing + spending insights
- **Recharts** — Charts and visualizations
- **n8n** — Workflow automation
- **Evolution API** — WhatsApp integration
- **Vercel** — Deployment

---

## How It Works

```
WhatsApp message → Evolution API → n8n → Groq parses → Supabase → Dashboard
```

User texts "Spent 450 PKR on fuel" → Groq extracts amount, category, description → saved to Supabase with phone number as user_id → dashboard auto-refreshes every 60 seconds.

---

## Features

- WhatsApp expense input — no app needed
- AI parsing via Groq Llama 3
- Multi-user support via phone number
- Monthly view with month picker
- AI spending insights
- Category donut chart + 30-day trend line
- Dark / light mode
- Reset button per month
- Auto-refresh every 60 seconds

---

## Database

Table: `expenses`

| Column | Type |
|--------|------|
| id | int8 (PK) |
| created_at | timestamptz |
| amount | numeric |
| currency | text |
| category | text |
| description | text |
| user_id | text (WhatsApp number) |

---

## n8n Supabase Node

```json
{
  "amount": {{ $json.amount }},
  "currency": {{ JSON.stringify($json.currency) }},
  "category": {{ JSON.stringify($json.category) }},
  "description": {{ JSON.stringify($json.description) }},
  "user_id": {{ JSON.stringify($('Receive Message').item.json.data.key.remoteJid.replace('@s.whatsapp.net', '')) }}
}
```

---

## Author

[JunaidAhmed13](https://github.com/JunaidAhmed13)