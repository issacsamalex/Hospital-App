const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = new express();
require("dotenv").config();
const PORT = process.env.PORT;
app.use(morgan("dev"));

app.use(bodyParser.json());


// Read data from JSON file
const readData = () => {
    const data = fs.readFileSync("./data/List.json");
    return JSON.parse(data);
};

// Write data to JSON file
const writeData = (data) => {
    fs.writeFileSync("./data/List.json", JSON.stringify(data, null, 2), 'utf8');
};



// GET method
app.get("/hospitals", (req, res) => {
    const hospitals = readData();
    res.json(hospitals);
});

// POST method
app.post("/hospitals", (req, res) => {
    const hospitals = readData();
    const newHospital = req.body;
    hospitals.push(newHospital);
    writeData(hospitals);
    res.json(newHospital);
});

// PUT method
app.put("/hospitals/:name", (req, res) => {
    const hospitals = readData();
    const hospitalName = req.params.name;
    const updatedHospital = req.body;

    const index = hospitals.findIndex((hospital) => hospital.name === hospitalName);

    if (index !== -1) {
        hospitals[index] = { ...hospitals[index], ...updatedHospital };
        writeData(hospitals);
        res.json(hospitals[index]);
    } else {
        res.status(404).send("Hospital not found");
    }
});

// DELETE method
app.delete("/hospitals/:name", (req, res) => {
    const hospitals = readData();
    const hospitalName = req.params.name;

    const filteredHospitals = hospitals.filter((hospital) => hospital.name !== hospitalName);

    if (filteredHospitals.length < hospitals.length) {
        writeData(filteredHospitals);
        res.send("Hospital deleted successfully");
    } else {
        res.status(404).send("Hospital not found");
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})
