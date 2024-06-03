const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/LaboratoryEntrySystem")
  .then(() => {
    console.log("Database is connected");
  })
  .catch((error) => console.log(error));

const entrySchema = mongoose.Schema({
    studentname: String,
    rollnumber: String,
    startTime: Date,
    endTime: Date,
    labNumber: String,
    systemNumber: String
});

const displaySchema = mongoose.Schema({
    studentName: String,
    rollNumber: String
});

const checkSchema = mongoose.Schema({
    Name: String,
    Numbers: String
});

const Entry = mongoose.model("StudentName", entrySchema);
const dis = mongoose.model("StudentDisplay", displaySchema);
const check = mongoose.model("StudentRecords", checkSchema);

app.post('/api/times', async (req, res) => {
    try {
        const { studentname, rollnumber, startTime, endTime, labNumber, systemNumber } = req.body;
        
        // Find and delete the document from 'dis' collection
        await dis.findOneAndDelete({ studentName: studentname, rollNumber: rollnumber });

        // Create a new entry
        const newEntry = await Entry.create({ studentname, rollnumber, startTime, endTime, labNumber, systemNumber });
        
        res.status(201).json({ message: 'Entry created successfully', entry: newEntry });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.get('/api/times', async (req, res) => {
    try {
        console.log("Fetching entries...");
        const entries = await dis.find();
        console.log("Entries:", entries); 
        if (entries.length === 0) {
            console.log("No entries found");
        }
        res.json(entries);
    } catch (error) {
        console.error("Error fetching entries:", error); 
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/server', async (req, res) => {
    try {
        console.log("Fetching entries...");
        const entries = await Entry.find();
        console.log("Entries:", entries); 
        if (entries.length === 0) {
            console.log("No entries found");
        }
        res.json(entries);
    } catch (error) {
        console.error("Error fetching entries:", error); 
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/server', async (req, res) => {
    try {
        const { studentName, rollNumber } = req.body;

        // Log incoming data
        console.log(`Received data: studentName=${studentName}, rollNumber=${rollNumber}`);

        // Check if the entry already exists in the 'dis' collection
        const existingEntry = await dis.findOne({ studentName, rollNumber });

        if (!existingEntry) {
            // Log the query for the 'check' collection
            console.log(`Checking for entry in 'check' collection: Name=${studentName}, Numbers=${rollNumber}`);

            // Check if the entry exists in the 'check' collection
            const existEntry = await check.findOne({ Name: studentName, Numbers: rollNumber });

            // Log the result of the query
            console.log('Result from check collection query:', existEntry);

            if (existEntry) {
                const newEntry = await dis.create({ studentName, rollNumber });
                return res.status(201).json({ message: 'Entry created successfully', entry: newEntry });
            } else {
                return res.status(404).json({ message: "Record not found" });
            }
        } else {
            return res.status(200).json({ message: 'Entry already exists' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(400).json({ message: error.message });
    }
});

app.post('/api/servernew', async (req, res) => {
    try {
        const { Name, Numbers } = req.body;
        
        // Check if the entry already exists in the database
        const existingEntry = await check.findOne({ Name, Numbers });

        if (!existingEntry) {
            // Entry doesn't exist, create a new one
            const newEntry = await check.create({ Name, Numbers });
            return res.status(201).json({ message: 'Entry created successfully', entry: newEntry });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.use((req, res, next) => {
    console.log(`Incoming request to ${req.method} ${req.url}`);
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
