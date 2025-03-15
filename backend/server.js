// server.js
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/jobdost", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const WorkerSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    profession: String
});

const Worker = mongoose.model("Worker", WorkerSchema, "registered_workers");

app.post("/save_worker", async (req, res) => {
    const { name, mobile, profession } = req.body;

    if (!name || !mobile || !profession) {
        return res.status(400).json({ error: "Invalid data" });
    }

    const worker = new Worker({ name, mobile, profession });
    await worker.save();

    res.json({ message: "Worker saved successfully!" });
});

app.listen(5000, () => console.log("Server running on port 5000"));