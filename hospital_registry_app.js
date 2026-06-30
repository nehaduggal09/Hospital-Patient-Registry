require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const hospital_registry_app = express();

hospital_registry_app.use(express.urlencoded({ extended: true }));
hospital_registry_app.use(express.static(__dirname));


// MongoDB Connection
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected Successfully");
    console.log("Database:", mongoose.connection.name);
})
.catch((err) => {
    console.log("MongoDB Connection Error:", err);
});


// Patient Schema
const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    dob: String,
    mobile: String,
    email: String,
    address: String,
    date: String,
    illness: String
});

const Patient = mongoose.model("Patient", patientSchema);


// Home Route
hospital_registry_app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "hospital_registry.html")
    );
});


// Register Patient
hospital_registry_app.post("/register", async (req, res) => {

    try {

        const patient = new Patient({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            dob: req.body.dob,
            mobile: req.body.mobile,
            email: req.body.email,
            address: req.body.address,
            date: req.body.date,
            illness: req.body.illness
        });

        await patient.save();

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Success</title>
                <link rel="stylesheet" href="/hospital_registry_style.css">
            </head>
            <body>
                <div class="container">
                    <h2>🎉 Patient Registered Successfully</h2>

                    <p>${req.body.name} has been registered.</p>

                    <p><strong>Age:</strong> ${req.body.age}</p>
                    <p><strong>Gender:</strong> ${req.body.gender}</p>
                    <p><strong>Disease:</strong> ${req.body.illness}</p>

                    <a href="/">Register Another Patient</a>
                </div>
            </body>
            </html>
        `);

    }
    catch (error) {

        console.log(error);

        res.send("Error while registering patient.");
    }
});


// Show Patients
hospital_registry_app.get("/patients", async (req, res) => {

    try {

        const patients = await Patient.find();

        if (patients.length > 0) {

            let patientHTML = "";

            patients.forEach((patient, index) => {

                patientHTML += `
                    <div style="margin-bottom:20px;">
                        <h3>Patient No: ${index + 1}</h3>

                        <p><strong>Name:</strong> ${patient.name}</p>
                        <p><strong>Age:</strong> ${patient.age}</p>
                        <p><strong>Gender:</strong> ${patient.gender}</p>
                        <p><strong>Date of Birth:</strong> ${patient.dob}</p>
                        <p><strong>Mobile:</strong> ${patient.mobile}</p>
                        <p><strong>Email:</strong> ${patient.email}</p>
                        <p><strong>Address:</strong> ${patient.address}</p>
                        <p><strong>Admission Date:</strong> ${patient.date}</p>
                        <p><strong>Disease:</strong> ${patient.illness}</p>

                        <hr>
                    </div>
                `;
            });

            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Registered Patients</title>
                    <link rel="stylesheet" href="/hospital_registry_style.css">
                </head>
                <body>
                    <div class="container">

                        <h2>📋 Registered Patients</h2>

                        ${patientHTML}

                        <a href="/">Back to Home</a>

                    </div>
                </body>
                </html>
            `);

        } else {

            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>No Patients</title>
                    <link rel="stylesheet" href="/hospital_registry_style.css">
                </head>
                <body>
                    <div class="container">

                        <h2>❌ No Patients Registered Yet</h2>

                        <p>Please register a patient first.</p>

                        <a href="/">Register Patient</a>

                    </div>
                </body>
                </html>
            `);
        }

    }
    catch (error) {

        console.log(error);

        res.send("Error fetching patients.");
    }
});


// Start Server
hospital_registry_app.listen(3001, () => {
    console.log("Server is running on port 3001");
});