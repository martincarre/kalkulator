const PDFDocument = require('pdfkit');
const fs = require('fs');

var pdfGenerator = function(payload) {
    console.log('in the PDFgen app!')
    const doc = new PDFDocument()
        .font('./pdfGen/fonts/Roboto/Roboto-Medium.ttf')

    doc;
    doc.pipe(fs.createWriteStream('./pdfGen/tests/offerExample.pdf'));
    
    // OVERALL DESIGN
    // Logo
    doc
        .image('./pdfGen/images/logoITL.png', 480.28, 35, {width: 100});
    // Lessee Rectangle
    doc
        .rect(35, 155, 255.14, 115)
        .lineWidth(0.5)
        .strokeColor("#5473a9");
    doc.stroke();
    // Lessee Contact
    doc
        .rect(300.14, 155, 255.14, 115)
        .lineWidth(0.5)
        .strokeColor("#5473a9");
    doc.stroke();
    // Equipment Table
    // ** Table Header:
    doc
        .rect(35, 305, 520.28, 35)
        .lineWidth(0.5)
        .fillAndStroke("#0073bc")
    doc.stroke();
    // ** Table content:
    var height = 15;
    for (let i = 0; i <  45; i+=15) {
        // Insert description quantity
        doc
            .rect(35, 340 + i, 520.28, 15)
            .lineWidth(0.5)
            .fillOpacity(0)
        doc.stroke();
        height = i + 15;
    }
    doc.rect(35, 340, 130.07, height);
    doc.stroke();

    // TEXT
    // Title
    doc
        .fontSize(24)
        .fillOpacity(1)
        .fillAndStroke("#000000")
        .text('ITL LEASING QUOTE', 35, 50)
        .fontSize(11)
        .text('Offer #XXXXXX-XX', 35, 90)
        .text('Date: April, 6th 2020', 35, 110)
        .text('LESSEE', 55, 165)
        .text('LESSEE CONTACT', 320.14, 165);

    // Lessee Information
    doc 
        .font('./pdfGen/fonts/Roboto/Roboto-Regular.ttf')
        .fontSize(9)
        .text('Legal Name:', 55, 185)
        .text('VAT Number:', 55, 200)
        .text('Address:', 55, 215)

        .text('Contact Name:', 320.14, 185)
        .text('Role:', 320.14, 200)
        .text('Email:', 320.14, 215)
        .text('Mobile:', 320.14, 230)
        .text('Office Phone:', 320.14, 245)

    // Introduction Sentence
    doc
        .fontSize(11)
        .text('The ITL team is pleased to present you with this leasing offer for the following equipment:', 35, 285)

    // White Titles
    doc
        .font('./pdfGen/fonts/Roboto/Roboto-Medium.ttf')
        .fillAndStroke("#ffffff")
        .fontSize(11)
        .text('QUANTITY', 65, 317.5)
        .text('DESCRIPTION', 290, 317.5)

    doc.end();
}

module.exports = pdfGenerator;