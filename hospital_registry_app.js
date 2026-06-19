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

    let patientNumber = 1;

    if (fs.existsSync("patient_registry.txt")) {
        const existingData = fs.readFileSync("patient_registry.txt", "utf8");

        const matches = existingData.match(/Patient No:/g);

        if (matches) {
            patientNumber = matches.length + 1;
        }
    }

    const patientData = `
Patient No: ${patientNumber}
Patient Name: ${req.body.name}
Age: ${req.body.age}
Gender: ${req.body.gender}
Date of Birth: ${req.body.dob}
Mobile Number: ${req.body.mobile}
Email: ${req.body.email}
Address: ${req.body.address}
Admission Date: ${req.body.date}
Disease: ${req.body.illness}
----------------------------------------
`;

    console.log(patientData);

    fs.appendFileSync("patient_registry.txt", patientData);



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
                <h3>${req.body.name} has been registered.</h3>

                <p><strong>Age:</strong> ${req.body.age}</p>
                <p><strong>Gender:</strong> ${req.body.gender}</p>
                <p><strong>Disease:</strong> ${req.body.illness}</p>

                <a href="/">Register Another Patient</a>
                </div>
                </body>
                </html>
`);
    
});

hospital_registry_app.get("/patients", (req, res) => {

    let patients = "";

    if (fs.existsSync("patient_registry.txt")) {

        patients = fs.readFileSync(
            "patient_registry.txt",
            "utf8"
        );

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
                    <pre>${patients}</pre>
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
});

hospital_registry_app.listen(3001, () => {
    console.log("Server is running on 3001");
});