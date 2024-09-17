document.addEventListener("DOMContentLoaded", function() {
    // Fetch stored candidate information and typed matter
    const candidateName = localStorage.getItem("candidateName");
    const testType = localStorage.getItem("testType");
    const typedMatter = localStorage.getItem("typedText");

    // Display candidate information and typed matter on the page
    document.getElementById("candidate-name").textContent = candidateName || "N/A";
    document.getElementById("test-type").textContent = testType || "N/A";
    document.getElementById("typed-matter").textContent = typedMatter || "No matter typed.";

    // Save the result as a PDF when the "Save as PDF" button is clicked
    document.getElementById("save-pdf-button").addEventListener("click", function() {
        try {
            const { jsPDF } = window.jspdf;
            if (!jsPDF) throw new Error("jsPDF library is not loaded.");

            const doc = new jsPDF({
                format: "a4",
                unit: "pt"
            });

            // Define margins and positions
            const margin = 20;
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Add a border around the entire page
            doc.setLineWidth(1); // Set border thickness
            doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

            // Define text properties
            const textColor = [0, 0, 128]; // Navy blue
            const fontSize = 16;
            const textMarginTop = 40;
            const textPadding = 10;
            const underlineOffset = 2; // Offset for the underline

            // Add candidate details and typed matter to the PDF
            doc.setFontSize(fontSize);
            doc.setTextColor(...textColor); // Set text color to navy blue

            // Draw text with underline
            function drawTextWithUnderline(x, y, text) {
                doc.text(x, y, text);
                const textWidth = doc.getTextWidth(text);
                doc.setLineWidth(0.5); // Set underline thickness
                doc.line(x, y + underlineOffset, x + textWidth, y + underlineOffset); // Draw underline
            }

            drawTextWithUnderline(margin + textPadding, margin + textMarginTop, `Candidate Name: ${candidateName || "N/A"}`);
            drawTextWithUnderline(margin + textPadding, margin + textMarginTop + 20, `Test Type: ${testType || "N/A"}`);

            doc.setFontSize(fontSize);
            doc.text(margin + textPadding, margin + textMarginTop + 60, "Typed Matter:");

            // Add typed matter to the PDF
            const typedMatterLines = (typedMatter || "No matter typed.").split('\n');
            let y = margin + textMarginTop + 80;
            typedMatterLines.forEach(line => {
                // Ensure text does not exceed page width
                let lines = doc.splitTextToSize(line, pageWidth - 2 * margin - textPadding);
                lines.forEach(l => {
                    doc.text(margin + textPadding, y, l);
                    y += 14; // Line height adjustment
                });
            });

            // Save the PDF
            doc.save("result.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("An error occurred while generating the PDF.");
        }
    });
});
