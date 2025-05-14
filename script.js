function displayFile() {
    document.getElementById('inputfile').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const inputBox = document.getElementById('inputTxt');

        // Handle .txt files
        if (file.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = function(event) {
                inputBox.value = event.target.result;
            };
            reader.onerror = function(event) {
                console.error("File couldn't be read: " + event.target.error.code);
            };
            reader.readAsText(file);

        // Handle .pdf files
        } else if (file.type === "application/pdf") {
            const reader = new FileReader();
            reader.onload = function(event) {
                const typedArray = new Uint8Array(event.target.result);

                // Load PDF document
                pdfjsLib.getDocument(typedArray).promise.then(pdf => {
                    let textPromises = [];

                    for (let i = 1; i <= pdf.numPages; i++) {
                        textPromises.push(
                            pdf.getPage(i).then(page =>
                                page.getTextContent().then(content => {
                                    // Extracting text from content
                                    return content.items.map(item => item.str).join(" ");
                                })
                            )
                        );
                    }

                    // Concatenate all text from all pages
                    Promise.all(textPromises).then(pagesText => {
                        inputBox.value = pagesText.join("\n\n");
                    }).catch(error => {
                        inputBox.value = "Error extracting text from PDF.";
                        console.error("Error extracting PDF text:", error);
                    });
                }).catch(error => {
                    inputBox.value = "Error loading PDF file.";
                    console.error("PDF parsing error:", error);
                });
            };
            reader.readAsArrayBuffer(file);
        } else {
            inputBox.value = "Unsupported file type.";
        }
    });
}
