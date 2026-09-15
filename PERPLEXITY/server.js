import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import { testAi } from "./src/services/ai.service.js";



async function startServer() {
    try {
        await connectToDB();
        app.listen(3000, () => {
            console.log("Server is running on Port 3000");
        });
        testAi();
    } catch (error) {
        console.error("Server startup error:", error.message);
        process.exitCode = 1;
    }
}

startServer();
