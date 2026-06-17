"""Export WhatsApp messages from a local wacli SQLite database.

This script intentionally does not analyze English. It only reads new messages
from the wacli database and appends them to a local JSONL export so the user can
ask an AI assistant to create learning plans and sales English manuals from it.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote


DEFAULT_DB = Path("/home/fxzou/.wacli/wacli.db")
DEFAULT_STATE = Path(".whatsapp_export_state.json")
DEFAULT_OUTPUT = Path("exports/whatsapp_messages.jsonl")


@dataclass(frozen=True)
class ExportedMessage:
    rowid: int
    timestamp: str
    from_me: bool
    chat_hash: str
    text: str
    media_type: str


def default_state(db_path: Path) -> dict:
    return {
        "version": 1,
        "db_path": str(db_path),
        "last_exported_rowid": 0,
        "last_exported_timestamp": "",
        "last_run_exported": 0,
        "total_exported": 0,
    }


def read_state(path: Path, db_path: Path, reset: bool) -> dict:
    if reset or not path.exists():
        return default_state(db_path)
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def write_state(path: Path, state: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")


def connect_readonly(db_path: Path) -> sqlite3.Connection:
    uri = f"file:{quote(str(db_path.resolve()))}?mode=ro"
    conn = sqlite3.connect(uri, uri=True)
    conn.row_factory = sqlite3.Row
    return conn


def timestamp_utc(ts: int) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()


def anonymize_chat(chat_jid: str) -> str:
    digest = hashlib.sha256(chat_jid.encode("utf-8")).hexdigest()
    return digest[:16]


def fetch_messages(db_path: Path, after_rowid: int) -> list[ExportedMessage]:
    query = """
        SELECT
            rowid,
            chat_jid,
            ts,
            from_me,
            COALESCE(NULLIF(text, ''), NULLIF(media_caption, ''), '') AS body,
            COALESCE(media_type, '') AS media_type
        FROM messages
        WHERE rowid > ?
          AND COALESCE(revoked, 0) = 0
          AND COALESCE(deleted_for_me, 0) = 0
          AND COALESCE(NULLIF(text, ''), NULLIF(media_caption, ''), '') <> ''
        ORDER BY rowid ASC
    """
    with connect_readonly(db_path) as conn:
        rows = conn.execute(query, (after_rowid,)).fetchall()

    return [
        ExportedMessage(
            rowid=int(row["rowid"]),
            timestamp=timestamp_utc(int(row["ts"])),
            from_me=bool(row["from_me"]),
            chat_hash=anonymize_chat(str(row["chat_jid"] or "")),
            text=str(row["body"] or "").strip(),
            media_type=str(row["media_type"] or ""),
        )
        for row in rows
    ]


def append_jsonl(path: Path, messages: list[ExportedMessage], reset: bool) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = "w" if reset else "a"
    with path.open(mode, encoding="utf-8") as f:
        for message in messages:
            f.write(json.dumps(asdict(message), ensure_ascii=False, sort_keys=True))
            f.write("\n")


def export_messages(
    *,
    db_path: Path | str = DEFAULT_DB,
    state_path: Path | str = DEFAULT_STATE,
    output_path: Path | str = DEFAULT_OUTPUT,
    reset: bool = False,
) -> dict:
    db_path = Path(db_path)
    state_path = Path(state_path)
    output_path = Path(output_path)

    state = read_state(state_path, db_path, reset)
    after_rowid = 0 if reset else int(state.get("last_exported_rowid") or 0)
    messages = fetch_messages(db_path, after_rowid)
    append_jsonl(output_path, messages, reset)

    if messages:
        last_message = messages[-1]
        state["last_exported_rowid"] = last_message.rowid
        state["last_exported_timestamp"] = last_message.timestamp

    state["version"] = 1
    state["db_path"] = str(db_path)
    state["last_run_exported"] = len(messages)
    state["total_exported"] = int(state.get("total_exported") or 0) + len(messages)
    write_state(state_path, state)

    return {
        "exported": len(messages),
        "total_exported": state["total_exported"],
        "last_exported_rowid": state["last_exported_rowid"],
        "output": str(output_path),
        "state": str(state_path),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Export new WhatsApp messages from a local wacli SQLite database."
    )
    parser.add_argument("--db", type=Path, default=DEFAULT_DB, help="Path to wacli.db")
    parser.add_argument("--state", type=Path, default=DEFAULT_STATE, help="State JSON path")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="JSONL export path")
    parser.add_argument("--reset", action="store_true", help="Rebuild export from all messages")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    result = export_messages(
        db_path=args.db,
        state_path=args.state,
        output_path=args.output,
        reset=args.reset,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

