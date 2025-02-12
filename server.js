const express = require('express');
const path = require('path');
const app = express();
const PDFDocument = require('pdfkit');
require('dotenv').config();

// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.post('/generate', function (req, res) {
    console.log(req.body); // Log the request body to debug

    let param = {
        'fullName': req.body.fullName,
        'qualification': req.body.qualification,
        'jobTypes': req.body.jobTypes,
        'experience': req.body.experience,
        //'email': req.body.email,
        //'phone': req.body.phone,
        'font': req.body.fontDropdown,
        'fontColor': req.body.fontColor,
        'bgColor': req.body.bgColor
    };

    const pdf = new PDFDocument({ margin: 10, size: [252, 144] });

    pdf.rect(0, 0, pdf.page.width, pdf.page.height).fill(param.bgColor);
    pdf.fillColor(param.fontColor);

    switch (param.font) {
        case 'outfit':
            pdf.font(path.join(__dirname, 'src', 'font', 'outfit.ttf'));
            break;
        case 'Playfair':
            pdf.font(path.join(__dirname, 'src', 'font', 'playfair.ttf'));
            break;
        case 'papyrus':
            pdf.font(path.join(__dirname, 'src', 'font', 'papyrus.ttf'));
            break;
        case 'comicsans':
            pdf.font(path.join(__dirname, 'src', 'font', 'comicsans.ttf'));
            break;
        default:
            pdf.font(path.join(__dirname, 'src', 'font', 'outfit.ttf'));
            break;
    }

    const textWidth = 225;
    pdf.fontSize(16).text("Job request", { align: "left" });
    pdf.moveDown();
    pdf.fontSize(8).text(`Hi my name is ${param.fullName}`, { align: "left", width: textWidth });
    pdf.fontSize(8).text(`I have a qualification in ${param.qualification} so you know I'd be good at ${param.jobTypes}.`, { align: "left", width: textWidth });
    if (param.experience) {
        pdf.fontSize(8).text(`I have ${param.experience} experience so I am a professional.`, { align: "left", width: textWidth });
    }
    //pdf.fontSize(8).text(`Feel free to contact me on my email(${param.email}) or my phone number(${param.phone}).`, { align: "left", width: textWidth });
    res.attachment('job_request.pdf');
    pdf.pipe(res);
    pdf.end();
});

let port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});