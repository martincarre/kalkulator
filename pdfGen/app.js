const PDFDocument = require('pdfkit');
const fs = require('fs');
// *** FOR FUTURE HANDLING IN THE BROWSER:
// const blobStream  = require('blob-stream');

var pdfGenerator = function(payload) {
    console.log('Generating PDF...');

    // Setting Variables for doc sizing: 
    var A4 = [595.28, 841.89];
    var margins = {
        top: 35,
        bottom: 35,
        left: 35,
        right: 35
    };

    const doc = new PDFDocument({autoFirstPage: false});
    
    // *** FOR FUTURE HANDLING IN THE BROWSER:
    // const stream = doc.pipe(blobStream());
    doc.addPage({
        size: A4,
        margins: margins
    });

    // USING FS FOR TEST PURPOSES
    doc.pipe(fs.createWriteStream('./pdfGen/tests/offerExample.pdf'));

    // CALIBRATING FONT STYLING
    doc.registerFont('bold', './pdfGen/fonts/Roboto/Roboto-Medium.ttf');
    doc.registerFont('regular', './pdfGen/fonts/Roboto/Roboto-Regular.ttf');
    doc.registerFont('light', './pdfGen/fonts/Roboto/Roboto-Light.ttf');

    // SETTING STANDARD VARS FOR TABLES AND SECTIONS
    var fullWidth = 525.28; // Full width (595.28) - margin (35) x 2 (right and left)
    var spaceBetween = 10;
    var halfWidth = fullWidth / 2 - spaceBetween / 2;
    var spaceBetweenText = 15;

    // TABLE PARAMS
    var tableHeaderHeight = 25;
    var rowHeight = 15;
    var fillAndLineColor = "#0073bc";
    // FIRST TABLE PARAMETERS
    var yBeginFirstTable = 0; // this is set based on section4Begin below
    var endHeightFirstTable = 0; // Set below, should be equal to yBeginFirstTable + tableHeaderHeight;
    var totalHeightFirstTable = rowHeight;

    // SECOND TABLE PARAMETERS
    var yBeginSecondTable = 0; // Depends on first table
    var endHeightSecondTable = 0; // To be set afterwards, once yBegin2 has been set.
    var totalHeightSecondTable = rowHeight;

    // BEGIN INFORMATIVE + SIGNATURE SECTIONS
    var section6Begin = 547.5 // Established based on 7 equipments in the same contract and 5 differents quotes

    // **** BEGINNING OF THE DOCUMENT ****

    // UPPER SECTION:
    // Logo
    var logoWidth = 100;
        doc
            .image('./pdfGen/images/logoITL.png', 460.28, margins.top / 2, { width: logoWidth });
    // Title
        doc
            .font('bold')
            .fontSize(24)
            .fillOpacity(1)
            .fillAndStroke("#000000")
            .text('ITL LEASING QUOTE', margins.left, margins.top)
            .font('regular')
            .fontSize(11)
            .text('Offer #XXXXXX-XX', margins.left, margins.top + spaceBetweenText * 2)
            .text('Date: April, 6th 2020', margins.left, margins.top + spaceBetweenText * 3);

    
    // SECTION 2 - LESSEE & LESSEE CONTACT
    // Boxes
    var section2Begin = margins.top / 2 + logoWidth + spaceBetweenText; // Make sure the logo is a square
    var section2Height = 125; // set the height here (for now set fo 7 lines plus padding)
        doc
            .rect(margins.left, section2Begin, halfWidth, section2Height) 
            .rect(margins.left + halfWidth + spaceBetween, section2Begin, halfWidth, section2Height)
            .lineWidth(0.3)
            .fillOpacity(0)
            .fillAndStroke(fillAndLineColor);
        doc.stroke();

    // Data
    // titles
    var leftMarginBox1 = margins.left + spaceBetweenText;
    var leftMarginBox2 = margins.left + halfWidth + spaceBetween + spaceBetweenText;
        doc
            .font("bold")
            .fillAndStroke("#00000")
            .fillOpacity(1)
            .text('LESSEE', leftMarginBox1, section2Begin + spaceBetweenText)
            .text('LESSEE CONTACT', leftMarginBox2, section2Begin + spaceBetweenText);
    // Labels
        doc
        // Box1
        // TODO: add the variables
            .font("regular")
            .fontSize(9)
            .text('Legal Name:', leftMarginBox1, section2Begin + spaceBetweenText * 2)
            .text('VAT Number:', leftMarginBox1, section2Begin + spaceBetweenText * 3)
            .text('Address:', leftMarginBox1, section2Begin + spaceBetweenText * 4)
        // Box2
        // TODO: add the variables
            .text('Contact Name:', leftMarginBox2, section2Begin + spaceBetweenText * 2)
            .text('Role:', leftMarginBox2, section2Begin + spaceBetweenText *3)
            .text('Email:', leftMarginBox2, section2Begin + spaceBetweenText * 4)
            .text('Mobile:', leftMarginBox2, section2Begin + spaceBetweenText * 5)
            .text('Office Phone:', leftMarginBox2, section2Begin + spaceBetweenText * 6);

    // SECTION3 - INTRODUCTION SENTENCE
    var section3Begin = section2Begin + section2Height + spaceBetween;
        doc
            .text('The ITL team is pleased to present you with this leasing offer for the following equipment:', margins.left, section3Begin);

    
    // SECTION4 - EQUIPMENT TABLE
    var section4Begin = section3Begin + spaceBetween * 3; // x 3 -> 1 for padding + 1 for the text + 1 for another padding /!\: Make sure fontsize is < to space Between
    yBeginFirstTable = section4Begin;
        // Drawing the table
        // * Header
        doc
            .rect(35, section4Begin, fullWidth, tableHeaderHeight)
            .lineWidth(0.5)
            .fillAndStroke("#0073bc")
        doc.stroke();
        totalHeightFirstTable += tableHeaderHeight;
        endHeightFirstTable = yBeginFirstTable + tableHeaderHeight;
        // * Lines
        // TODO: Replace 45 with equips.length * rowHeight
        var totalLines = 45;
            for (let i = 0; i <  totalLines; i+=rowHeight) {
                    doc
                        .rect(35, endHeightFirstTable, fullWidth, rowHeight)
                        .lineWidth(0.5)
                        .fillOpacity(0)
                    doc.stroke();
                    endHeightFirstTable += rowHeight;
                    totalHeightFirstTable += rowHeight;

                    // TODO: Add the equipment quantity and description
                }
            endHeightFirstTable = yBeginFirstTable + totalHeightFirstTable - tableHeaderHeight + spaceBetween;
        // * Columns
        var quantColumn = 60; 
        doc
            .moveTo(margins.left + quantColumn, yBeginFirstTable)
            .lineTo(margins.left + quantColumn, endHeightFirstTable)
            .stroke();
        // Placing the headers
        doc
            .font('bold')
            .fillAndStroke("#ffffff")
            .fillOpacity(1)
            .fontSize(10)
            .text('QUANTITY', margins.left + 5 , yBeginFirstTable + tableHeaderHeight / 4)
            .text('DESCRIPTION', margins.left + (fullWidth - 60) /2, yBeginFirstTable + tableHeaderHeight / 4)
        

    // SECTION5 - QUOTE TABLE + LEASING PARAMS
    var section5Begin = endHeightFirstTable + spaceBetween;
    var yBeginSecondTable = section5Begin;
        // Drawing the table
        var secondTableWidth = fullWidth * 2 / 3;
        // * Header
            doc
                .rect(margins.left + fullWidth / 3, yBeginSecondTable, secondTableWidth, tableHeaderHeight)
                .fillOpacity(1)
                .lineWidth(0.5)
                .fillAndStroke("#0073bc")
            doc.stroke();
        // * Lines
        var totalLines = 15;
        endHeightSecondTable = tableHeaderHeight + yBeginSecondTable;
        // TODO Replace 45 by quotes.length * rowHeight
        for (let i = 0; i < totalLines; i+=rowHeight) {
            // TODO Insert quantity + quote
            doc
                .rect(margins.left + fullWidth / 3, endHeightSecondTable, secondTableWidth, rowHeight)
                .fillOpacity(0)
                .lineWidth(0.5)
                .fillAndStroke("#0073bc")
                doc.stroke();
                endHeightSecondTable += rowHeight;
                totalHeightSecondTable += rowHeight;
            }

        console.log(endHeightSecondTable);
        // * Columns
        quantColumn = 60;
        quoteColumn = (secondTableWidth - quantColumn) / 3; // See below why 3
        doc
        // Quant = tenor here
            .moveTo(margins.left + fullWidth / 3 + quantColumn, yBeginSecondTable)
            .lineTo(margins.left + fullWidth / 3 + quantColumn, endHeightSecondTable)
        // Quote columns = fiQuote + Protec+ Quote + Total Quote
        // TODO: Add quote variables
            .moveTo(margins.left + fullWidth / 3 + quantColumn + quoteColumn, yBeginSecondTable)
            .lineTo(margins.left + fullWidth / 3 + quantColumn + quoteColumn, endHeightSecondTable)
            .moveTo(margins.left + fullWidth / 3 + quantColumn + quoteColumn * 2, yBeginSecondTable)
            .lineTo(margins.left + fullWidth / 3 + quantColumn + quoteColumn * 2, endHeightSecondTable)
            .moveTo(margins.left + fullWidth / 3 + quantColumn + quoteColumn * 3, yBeginSecondTable)
            .lineTo(margins.left + fullWidth / 3 + quantColumn + quoteColumn * 3, endHeightSecondTable)
            .stroke();

        // Placing the header
        doc
            .font('bold')
            .fillAndStroke("#ffffff")
            .fillOpacity(1)
            .fontSize(10)
            .text('TENOR', margins.left + fullWidth / 3 + 10,  yBeginSecondTable  + tableHeaderHeight / 4)
            .text('QUOTE', margins.left + fullWidth / 3 + quantColumn + 25, yBeginSecondTable  + tableHeaderHeight / 4)
            .text('PROTECPLUS', margins.left + fullWidth / 3 + quantColumn + quoteColumn + 10, yBeginSecondTable  + tableHeaderHeight / 4)
            .text('TOTAL W/O VAT', margins.left + fullWidth / 3 + quantColumn + quoteColumn * 2 + 7.5, yBeginSecondTable  + tableHeaderHeight / 4);

        // Contract Details
        
        var contractDetailsBegin = yBeginSecondTable + ( totalHeightSecondTable / 5 );
        var iIconWidth = 40;
        // * Icon
        doc
            .image('./pdfGen/images/iconmonstr-info-6-240.png', margins.left * 2 / 3, contractDetailsBegin + 10, { width: 35 });
        // * Details
        doc
            .font('regular')
            .fontSize(9)
            .fillAndStroke('#000000')
            .text('Leasing Type: ', margins.left + iIconWidth, contractDetailsBegin)
            .text('Periodicity: ', margins.left + iIconWidth, contractDetailsBegin + spaceBetweenText)
            .text('Total Tenor: ', margins.left + iIconWidth, contractDetailsBegin + spaceBetweenText * 2)
            .text('Quote Type: ', margins.left + iIconWidth, contractDetailsBegin + spaceBetweenText * 3);


        // SECTION6 - RGPD
        // To check Section y begin come back to the top at the variable definition section
        var section6Height = 125;
        doc
            .lineWidth(0.3)
            .rect(margins.left, section6Begin, fullWidth, section6Height)
            doc.stroke();

        // Placeholder for legal and operation details
        doc
            .font("light")
            .fontSize(6)
            .text('RGPD + LEGAL CONSIDERATIONS - Offer valid for 15 days... ', margins.left + 5, section6Begin + 5)

        // SECTION7 - Benefits
        // TODO: SEE IF WE MAKE THIS PROGRAMATIC AND PROVIDE THE POSSIBILITY TO ADD BENEFITS

        // SECTION8 - Signatures
        var signatureHeight = 125;
        var section8Begin = A4[1] - margins.bottom - signatureHeight;
        console.log(section8Begin);
        // Signature rects
            doc
                .lineWidth(0.5)
                .fillOpacity(0)
                .fillAndStroke("#000000")
                .rect(margins.left, section8Begin, halfWidth, signatureHeight) 
                .rect(margins.left + halfWidth + spaceBetween, section8Begin, halfWidth, signatureHeight);
                doc.stroke();
        // Signature Titles
        // TODO: Adapt with the information from payload
            doc
                .fillAndStroke("#000000")
                .font('regular')
                .fontSize(6.5)
                .fillOpacity(1)
                .text('On the behalf of *COMAPANY NAME*, I aknowledge and agree to the above,', margins.left + 5, section8Begin + 5)
                .fontSize(8)
                .text('Name (Print):', margins.left + 5, A4[1] - margins.bottom - ( 3 * 8 + 3 * spaceBetweenText))
                .text('Title:', margins.left + 5, A4[1] - margins.bottom - ( 3 * 8 + 2 * spaceBetweenText))
                .text('Date::', margins.left + 5, A4[1] - margins.bottom - ( 3 * 8 + 1 * spaceBetweenText));

            // TODO: Add ITL contacts

        // Contact icon
            doc
                .image('./pdfGen/images/iconmonstr-id-card-14-240.png', margins.left + halfWidth + spaceBetween + 5, section8Begin - iIconWidth / 2 + signatureHeight / 2, { width: iIconWidth });
            
            
// *** FOR FUTURE HANDLING IN THE BROWSER:
//     stream.on('finish', function() {
//         // get a blob you can do whatever you like with
//         const blob = stream.toBlob('application/pdf');
      
//         // or get a blob URL for display in the browser
//         const url = stream.toBlobURL('application/pdf');
//         iframe.src = url;
//       });
    doc.end();
}

module.exports = pdfGenerator;
