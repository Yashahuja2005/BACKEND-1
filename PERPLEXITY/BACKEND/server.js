import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import connectToDB from "./src/config/database.js";
import { initServer } from "./src/sockets/server.socket.js";

const httpServer = http.createServer(app);
initServer(httpServer);

async function startServer() {
    try {
        await connectToDB();
        httpServer.listen(3000, () => {
            console.log("Server is running on Port 3000");
        });
    } catch (error) {
        console.error("Server startup error:", error.message);
        process.exitCode = 1;
    }
}

startServer();
