# English Learning from WhatsApp Chats

This project uses a small Python script to export WhatsApp messages from the local `wacli` SQLite database, plus a lightweight Node.js web app to study the exported content. The export script only reads and exports messages. English learning plans and sales manuals are written separately by the AI assistant after reviewing the exported chat content.

## Export New Messages

```bash
python3 scripts/export_whatsapp_messages.py --db /home/fxzou/.wacli/wacli.db
```

The script stores its incremental cursor in `.whatsapp_export_state.json`, so already exported messages are skipped on later runs.

## Rebuild Export From Scratch

```bash
python3 scripts/export_whatsapp_messages.py --db /home/fxzou/.wacli/wacli.db --reset
```

## Files

- `scripts/export_whatsapp_messages.py`: read-only incremental exporter for `wacli.db`
- `server.js`: local Node.js web server for the daily lesson UI
- `public/`: frontend assets
- `lessons/`: daily lesson JSON files
- `exports/whatsapp_messages.jsonl`: local private export, ignored by git
- `.whatsapp_export_state.json`: local private cursor, ignored by git
- `learning-plan.md`: AI-generated learning plan
- `sales-english-manual.md`: AI-generated WhatsApp sales English manual

## Start the Web App

```bash
PORT=8123 node server.js
```

Open the LAN URL printed by the server, usually:

```bash
http://127.0.0.1:8123
```

## Deploy to Vercel

The app can be deployed as a static frontend with Vercel serverless API routes:

- `public/`: static frontend
- `api/lesson.js`: serves daily lesson JSON
- `api/vocabulary.js`: serves the vocabulary index
- `api/progress.js`: returns success for progress saves; browser progress is kept in localStorage

Import this GitHub repo in Vercel and deploy with the default settings. No build command is required.

## Privacy

The export contains real chat content, so `exports/` and `.whatsapp_export_state.json` are ignored by git.
