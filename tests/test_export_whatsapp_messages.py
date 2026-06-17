import json
import sqlite3
from pathlib import Path

from scripts import export_whatsapp_messages


def create_wacli_db(path: Path) -> None:
    conn = sqlite3.connect(path)
    conn.execute(
        """
        CREATE TABLE messages (
            rowid INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_jid TEXT NOT NULL,
            chat_name TEXT,
            msg_id TEXT NOT NULL,
            sender_jid TEXT,
            sender_name TEXT,
            ts INTEGER NOT NULL,
            from_me INTEGER NOT NULL,
            text TEXT,
            display_text TEXT,
            media_type TEXT,
            media_caption TEXT,
            revoked INTEGER NOT NULL DEFAULT 0,
            deleted_for_me INTEGER NOT NULL DEFAULT 0,
            UNIQUE(chat_jid, msg_id)
        )
        """
    )
    conn.commit()
    conn.close()


def insert_message(
    db_path: Path,
    *,
    chat_jid: str,
    msg_id: str,
    ts: int,
    from_me: bool,
    text: str,
    media_type: str = "",
    media_caption: str = "",
) -> None:
    conn = sqlite3.connect(db_path)
    conn.execute(
        """
        INSERT INTO messages (
            chat_jid, chat_name, msg_id, sender_jid, sender_name, ts, from_me,
            text, display_text, media_type, media_caption
        )
        VALUES (?, 'Customer', ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            chat_jid,
            msg_id,
            "me" if from_me else chat_jid,
            "me" if from_me else "Customer",
            ts,
            1 if from_me else 0,
            text,
            text,
            media_type,
            media_caption,
        ),
    )
    conn.commit()
    conn.close()


def read_jsonl(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def run_export(tmp_path: Path, db_path: Path, *, reset: bool = False) -> dict:
    state_path = tmp_path / ".whatsapp_export_state.json"
    output_path = tmp_path / "exports" / "whatsapp_messages.jsonl"
    result = export_whatsapp_messages.export_messages(
        db_path=db_path,
        state_path=state_path,
        output_path=output_path,
        reset=reset,
    )
    return {
        "result": result,
        "state": json.loads(state_path.read_text()),
        "messages": read_jsonl(output_path),
    }


def test_first_run_exports_all_non_empty_messages(tmp_path):
    db_path = tmp_path / "wacli.db"
    create_wacli_db(db_path)
    insert_message(
        db_path,
        chat_jid="chat-a",
        msg_id="m1",
        ts=100,
        from_me=False,
        text="What is the price for the black cap?",
    )
    insert_message(
        db_path,
        chat_jid="chat-a",
        msg_id="m2",
        ts=101,
        from_me=True,
        text="Please check the PI.",
    )
    insert_message(
        db_path,
        chat_jid="chat-a",
        msg_id="m3",
        ts=102,
        from_me=False,
        text="",
        media_type="image",
        media_caption="Could you check this sample?",
    )

    output = run_export(tmp_path, db_path, reset=True)

    assert output["result"]["exported"] == 3
    assert output["state"]["total_exported"] == 3
    assert output["state"]["last_run_exported"] == 3
    assert [message["text"] for message in output["messages"]] == [
        "What is the price for the black cap?",
        "Please check the PI.",
        "Could you check this sample?",
    ]
    assert output["messages"][0]["from_me"] is False
    assert output["messages"][1]["from_me"] is True
    assert "chat_jid" not in output["messages"][0]
    assert output["messages"][0]["chat_hash"] == output["messages"][2]["chat_hash"]


def test_second_run_appends_only_new_messages(tmp_path):
    db_path = tmp_path / "wacli.db"
    create_wacli_db(db_path)
    insert_message(
        db_path,
        chat_jid="chat-a",
        msg_id="m1",
        ts=100,
        from_me=False,
        text="Please send the tracking number.",
    )
    first = run_export(tmp_path, db_path, reset=True)
    assert first["result"]["exported"] == 1

    insert_message(
        db_path,
        chat_jid="chat-a",
        msg_id="m2",
        ts=101,
        from_me=True,
        text="I will send it once it is available.",
    )
    second = run_export(tmp_path, db_path)

    assert second["result"]["exported"] == 1
    assert second["state"]["total_exported"] == 2
    assert second["state"]["last_run_exported"] == 1
    assert [message["rowid"] for message in second["messages"]] == [1, 2]


def test_reset_rebuilds_output_file(tmp_path):
    db_path = tmp_path / "wacli.db"
    create_wacli_db(db_path)
    insert_message(
        db_path,
        chat_jid="chat-a",
        msg_id="m1",
        ts=100,
        from_me=False,
        text="First message.",
    )
    run_export(tmp_path, db_path, reset=True)
    insert_message(
        db_path,
        chat_jid="chat-a",
        msg_id="m2",
        ts=101,
        from_me=False,
        text="Second message.",
    )

    output = run_export(tmp_path, db_path, reset=True)

    assert output["result"]["exported"] == 2
    assert output["state"]["total_exported"] == 2
    assert [message["text"] for message in output["messages"]] == [
        "First message.",
        "Second message.",
    ]
