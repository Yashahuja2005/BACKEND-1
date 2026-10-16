import express from "express";
import runGraph from "./services/graph.ai.service.js"

const app = express()

app.get("/health", (req, res) => {
    res.status(200).json({status:'ok'})
})

app.post("/use-graph", async (req, res) => {
    const result = await runGraph("Write a factorial function in javascript")
    res.json(result)
})

export default app;