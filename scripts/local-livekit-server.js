const http = require("http");
const crypto = require("crypto");

// ─────────────────────────────────────────────────────────────
// WONDER JOURNEY OS — LOCAL LIVEKIT & CLASSROOM SIGNALING TEST SERVER
// Provides real RFC 6455 WebSocket room broadcasting for
// multi-browser teacher/student integration testing.
// ─────────────────────────────────────────────────────────────

const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

function parseWebSocketFrame(buffer) {
  if (buffer.length < 2) return null;
  const firstByte = buffer[0];
  const secondByte = buffer[1];

  const fin = (firstByte & 0x80) === 0x80;
  const opcode = firstByte & 0x0f;
  const masked = (secondByte & 0x80) === 0x80;
  let payloadLength = secondByte & 0x7f;

  let offset = 2;
  if (payloadLength === 126) {
    if (buffer.length < 4) return null;
    payloadLength = buffer.readUInt16BE(2);
    offset = 4;
  } else if (payloadLength === 127) {
    if (buffer.length < 10) return null;
    payloadLength = Number(buffer.readBigUInt64BE(2));
    offset = 10;
  }

  let maskingKey = null;
  if (masked) {
    if (buffer.length < offset + 4) return null;
    maskingKey = buffer.subarray(offset, offset + 4);
    offset += 4;
  }

  if (buffer.length < offset + payloadLength) return null;

  const payload = Buffer.from(buffer.subarray(offset, offset + payloadLength));
  if (masked && maskingKey) {
    for (let i = 0; i < payload.length; i++) {
      payload[i] ^= maskingKey[i % 4];
    }
  }

  return {
    fin,
    opcode,
    payload,
    totalFrameBytes: offset + payloadLength,
  };
}

function createWebSocketFrame(payload, opcode = 0x01) {
  const isBuffer = Buffer.isBuffer(payload);
  const data = isBuffer ? payload : Buffer.from(payload, "utf8");
  const length = data.length;

  let header;
  if (length <= 125) {
    header = Buffer.alloc(2);
    header[0] = 0x80 | opcode;
    header[1] = length;
  } else if (length <= 65535) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(length), 2);
  }

  return Buffer.concat([header, data]);
}

function createLocalLiveKitTestServer(port = 7880) {
  const rooms = new Map(); // roomName -> Set<socket>

  const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({ status: "livekit_signaling_active", port }));
  });

  server.on("upgrade", (req, socket, head) => {
    const key = req.headers["sec-websocket-key"];
    if (!key) {
      socket.destroy();
      return;
    }

    const acceptValue = crypto
      .createHash("sha1")
      .update(key + WS_GUID)
      .digest("base64");

    const responseHeaders = [
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Accept: ${acceptValue}`,
      "",
      "",
    ].join("\r\n");

    socket.write(responseHeaders);

    // Extract room / session
    const url = new URL(req.url, `http://localhost:${port}`);
    const roomName = url.searchParams.get("room") || url.pathname.split("/").pop() || "default-room";

    if (!rooms.has(roomName)) {
      rooms.set(roomName, new Set());
    }
    const clientSet = rooms.get(roomName);
    clientSet.add(socket);

    let incomingBuffer = Buffer.alloc(0);

    socket.on("data", (chunk) => {
      incomingBuffer = Buffer.concat([incomingBuffer, chunk]);

      while (incomingBuffer.length > 0) {
        const frame = parseWebSocketFrame(incomingBuffer);
        if (!frame) break;

        incomingBuffer = incomingBuffer.subarray(frame.totalFrameBytes);

        if (frame.opcode === 0x08) {
          // Close frame
          socket.end(createWebSocketFrame(Buffer.alloc(0), 0x08));
          break;
        } else if (frame.opcode === 0x09) {
          // Ping frame -> reply with Pong
          socket.write(createWebSocketFrame(frame.payload, 0x0a));
        } else if (frame.opcode === 0x01 || frame.opcode === 0x02) {
          // Broadcast data/text frame to all other clients in the same room
          const broadcastFrame = createWebSocketFrame(frame.payload, frame.opcode);
          for (const client of clientSet) {
            if (client !== socket && !client.destroyed) {
              client.write(broadcastFrame);
            }
          }
        }
      }
    });

    socket.on("close", () => {
      clientSet.delete(socket);
      if (clientSet.size === 0) rooms.delete(roomName);
    });

    socket.on("error", () => {
      clientSet.delete(socket);
      socket.destroy();
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`✓ Real LiveKit / Classroom Signaling Server active on ws://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

module.exports = {
  createLocalLiveKitTestServer,
  createWebSocketFrame,
  parseWebSocketFrame,
};
