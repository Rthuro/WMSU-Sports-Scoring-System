import { Server } from "socket.io";

let io = null;

/**
 * Initialise Socket.IO on the given HTTP server.
 * Call once at startup.
 */
export function initSocket(httpServer, allowedOrigin) {
    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigin,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}`);

        // ── Room management ─────────────────────────────────────
        socket.on("join:tournament", (tournamentId) => {
            const room = `tournament:${tournamentId}`;
            socket.join(room);
            console.log(`  → ${socket.id} joined ${room}`);
        });

        socket.on("leave:tournament", (tournamentId) => {
            const room = `tournament:${tournamentId}`;
            socket.leave(room);
            console.log(`  ← ${socket.id} left ${room}`);
        });

        socket.on("join:match", (matchId) => {
            const room = `match:${matchId}`;
            socket.join(room);
            console.log(`  → ${socket.id} joined ${room}`);
        });

        socket.on("leave:match", (matchId) => {
            const room = `match:${matchId}`;
            socket.leave(room);
            console.log(`  ← ${socket.id} left ${room}`);
        });

        socket.on("disconnect", (reason) => {
            console.log(`🔌 Socket disconnected: ${socket.id} (${reason})`);
        });
    });

    return io;
}

/**
 * Get the current Socket.IO server instance.
 * Throws if called before initSocket().
 */
export function getIO() {
    if (!io) {
        throw new Error("Socket.IO not initialised — call initSocket() first");
    }
    return io;
}
