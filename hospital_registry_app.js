const express = require("express");
const fs = require("fs");
const path = require("path");

const hospital_registry_app = express();

hospital_registry_app.use(express.urlencoded({ extended: true }));
hospital_registry_app.use(express.static(__dirname));

hospital_registry_app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "hospital_registry.html"));
});


hospital_registry_app.post("/register", (req, res) => {

    const patientData =
        `Name: ${req.body.name}, Admission Date: ${req.body.date}, Illness: ${req.body.illness}\n`;

    console.log(patientData);

    fs.appendFileSync("patient_registry.txt", patientData);

    res.send(
        `<h3>${req.body.name} has been registered. Go back to main page.</h3>`
    );
});

hospital_registry_app.get("/patients", (req, res) => {

    let patients = "";

    if (fs.existsSync("patient_registry.txt")) {

        patients = fs.readFileSync(
            "patient_registry.txt",
            "utf8"
        );

        res.send(
            `<h2>Registered Patients:</h2><pre>${patients}</pre>`
        );
    } else {

        res.send("<h2>No patients registered yet.</h2>");
    }
});

hospital_registry_app.listen(3001, () => {
    console.log("Server is running on 3001");
});