# WhatsApp MCP Server

> Fork of [jlucaso1/whatsapp-mcp-ts](https://github.com/jlucaso1/whatsapp-mcp-ts) with npx support and improved history sync.

An MCP server for WhatsApp using the Baileys library. Connect your personal WhatsApp to AI agents like Claude Desktop or Crush.

Features:
- Search messages and contacts
- List and retrieve chat history
- Send messages to individuals or groups

All data is stored **locally** in `~/.local/share/whatsapp-mcp/`.

## Quick Start

### Prerequisites

- **Node.js** 23.10.0+ (required for built-in SQLite)
- **MCP Client:** Claude Desktop, Crush, or similar

### 1. Authenticate

```bash
npx github:juanibiapina/whatsapp-mcp-ts --auth
```

Scan the QR code with WhatsApp (Settings → Linked Devices → Link a Device).

**Keep WhatsApp open on your phone** during initial sync to download history and contacts.

### 2. Configure your MCP Client

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "whatsapp": {
      "command": "npx",
      "args": ["-y", "github:juanibiapina/whatsapp-mcp-ts"]
    }
  }
}
```

**Crush** (`crush.json`):

```json
{
  "mcp": {
    "whatsapp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "github:juanibiapina/whatsapp-mcp-ts"]
    }
  }
}
```

### 3. Restart your MCP Client

## Tools

| Tool | Description |
|------|-------------|
| `search_contacts` | Search contacts by name or phone number |
| `search_messages` | Search message content across chats |
| `list_chats` | List chats (sortable, paginated) |
| `list_messages` | Get messages for a specific chat |
| `get_chat` | Get chat details |
| `get_message_context` | Get messages around a specific message |
| `send_message` | Send a message to a user or group |

## Data Storage

```
~/.local/share/whatsapp-mcp/
├── auth/           # Authentication credentials
├── whatsapp.db     # Messages and chats database
├── wa-logs.txt     # WhatsApp logs
└── mcp-logs.txt    # MCP server logs
```

## Troubleshooting

**Re-authenticate:**
```bash
rm -rf ~/.local/share/whatsapp-mcp/auth
npx github:juanibiapina/whatsapp-mcp-ts --auth
```

**Full resync:**
```bash
rm -rf ~/.local/share/whatsapp-mcp/auth ~/.local/share/whatsapp-mcp/whatsapp.db
npx github:juanibiapina/whatsapp-mcp-ts --auth
```

**Check logs:**
- `~/.local/share/whatsapp-mcp/mcp-logs.txt`
- `~/.local/share/whatsapp-mcp/wa-logs.txt`
