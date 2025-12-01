# WhatsApp MCP Server (TypeScript/Baileys)
[![smithery badge](https://smithery.ai/badge/@jlucaso1/whatsapp-mcp-ts)](https://smithery.ai/server/@jlucaso1/whatsapp-mcp-ts)

This is a Model Context Protocol (MCP) server for WhatsApp, built with TypeScript and using the `@whiskeysockets/baileys` library.

It allows you to connect your personal WhatsApp account to an AI agent (like Anthropic Claude via its desktop app or Cursor) enabling it to:

* Search your personal WhatsApp messages.
* Search your contacts (individuals, not groups).
* List your recent chats.
* Retrieve message history for specific chats.
* Send messages to individuals or groups.

It connects directly to your **personal WhatsApp account** using the WhatsApp Web multi-device API. All your messages and authentication details are stored **locally** in `~/.local/share/whatsapp-mcp/`. Data is only sent to the connected AI agent when it explicitly uses the provided MCP tools.

## Quick Start

### Prerequisites

* **Node.js:** Version 23.10.0 or higher (required for built-in SQLite support)
* **AI Client:** Claude Desktop, Cursor, or another MCP-compatible client

### 1. Authenticate with WhatsApp

Run the authentication command to link your WhatsApp account:

```bash
npx github:juanibiapina/whatsapp-mcp-ts --auth
```

This will display a QR code in your terminal. Scan it with your WhatsApp mobile app (Settings → Linked Devices → Link a Device).

**Important:** Keep WhatsApp open on your phone during the initial sync - this allows your message history and contacts to be downloaded.

### 2. Configure your AI Client

Add the following to your MCP client configuration:

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

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

**Cursor** (`~/.cursor/mcp.json`):

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

### 3. Restart your AI Client

Close and reopen Claude Desktop or Cursor. The WhatsApp MCP server will now be available.

## Example

**User:**
Send a whatsapp message to "Meu amor" saying "Te amo"

---

**Assistant:**
Okay, I need to find the contact first.
*Using tool: `whatsapp.search_contacts`*
```json
{
  "query": "Meu amor"
}
```

---

**Tool Result:**
```json
[
  {
    "jid": "5599xxxxxx@s.whatsapp.net",
    "name": "Meu Amor"
  }
]
```

---

**Assistant:**
Found the contact. Now sending the message.
*Using tool: `whatsapp.send_message`*
```json
{
  "recipient": "5599xxxxxx@s.whatsapp.net",
  "message": "Te amo"
}
```

---

**Tool Result:**
```text
Message sent successfully to 5599xxxxxx@s.whatsapp.net (ID: XXXXXXXXXXX).
```

## MCP Tools

The server exposes the following tools to the connected AI agent:

| Tool | Description |
|------|-------------|
| `search_contacts` | Search for contacts by name or phone number |
| `list_messages` | Retrieve message history for a specific chat (paginated) |
| `list_chats` | List chats, sortable by activity or name (paginated) |
| `get_chat` | Get detailed information about a specific chat |
| `get_message_context` | Get messages before/after a specific message |
| `send_message` | Send a text message to a user or group |
| `search_messages` | Search message content across all chats |

## Data Storage

All data is stored locally in `~/.local/share/whatsapp-mcp/`:

```
~/.local/share/whatsapp-mcp/
├── auth/           # WhatsApp authentication credentials
├── whatsapp.db     # SQLite database with messages and chats
├── wa-logs.txt     # WhatsApp connection logs
└── mcp-logs.txt    # MCP server logs
```

**Privacy:** Data is only sent to the connected LLM when the AI agent actively uses one of the MCP tools. The server does not proactively send your data anywhere.

## Alternative: Installing via Smithery

```bash
npx -y @smithery/cli install @jlucaso1/whatsapp-mcp-ts --client claude
```

## Troubleshooting

### QR Code Issues
- Ensure you scan the QR code promptly with your phone's WhatsApp app
- Keep WhatsApp open on your phone during initial sync

### Authentication Failures
If you get logged out, re-authenticate:
```bash
rm -rf ~/.local/share/whatsapp-mcp/auth
npx github:juanibiapina/whatsapp-mcp-ts --auth
```

### Missing Messages or Contacts
For a full resync, delete the database and re-authenticate:
```bash
rm -rf ~/.local/share/whatsapp-mcp/auth ~/.local/share/whatsapp-mcp/whatsapp.db
npx github:juanibiapina/whatsapp-mcp-ts --auth
```
Keep WhatsApp open on your phone during sync.

### MCP Connection Problems
- Check the AI client's logs for errors starting the MCP server
- Check `~/.local/share/whatsapp-mcp/mcp-logs.txt` for MCP errors
- Check `~/.local/share/whatsapp-mcp/wa-logs.txt` for WhatsApp errors

### Errors Sending Messages
- Ensure the recipient JID is correct (e.g., `number@s.whatsapp.net` for users, `groupid@g.us` for groups)

For further MCP integration issues, refer to the [official MCP documentation](https://modelcontextprotocol.io/quickstart/server#claude-for-desktop-integration-issues).

## Technical Details

* **Language:** TypeScript
* **Runtime:** Node.js (>= v23.10.0)
* **WhatsApp API:** `@whiskeysockets/baileys`
* **MCP SDK:** `@modelcontextprotocol/sdk`
* **Database:** `node:sqlite` (built-in)
* **Logging:** `pino`

## Credits

- https://github.com/lharries/whatsapp-mcp - Similar project in Go/Python

## License

ISC License
