# English Learning from WhatsApp Chats

This project uses a small Python script to export WhatsApp messages from the local `wacli` SQLite database. The script only reads and exports messages. English learning plans and sales manuals are written separately by the AI assistant after reviewing the exported chat content.

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
- `exports/whatsapp_messages.jsonl`: local private export, ignored by git
- `.whatsapp_export_state.json`: local private cursor, ignored by git
- `learning-plan.md`: AI-generated learning plan
- `sales-english-manual.md`: AI-generated WhatsApp sales English manual

## Privacy

The export contains real chat content, so `exports/` and `.whatsapp_export_state.json` are ignored by git.

