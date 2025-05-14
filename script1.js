document.getElementById('inputfile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const inputBox = document.getElementById('inputTxt');

    // For text files
    if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = function(event) {
            const textContent = event.target.result;
            inputBox.value = textContent;
            console.log("Text file content:\n", textContent);
        };
        reader.onerror = function(event) {
            console.error("File couldn't be read: " + event.target.error.code);
        };
        reader.readAsText(file);
    }

    // For PDF files
    else if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = function(event) {
            const typedArray = new Uint8Array(event.target.result);

            pdfjsLib.getDocument(typedArray).promise.then(pdf => {
                let textPromises = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    textPromises.push(
                        pdf.getPage(i).then(page =>
                            page.getTextContent().then(content => {
                                return content.items.map(item => item.str).join(" ");
                            })
                        )
                    );
                }

                Promise.all(textPromises).then(pagesText => {
                    const finalText = pagesText.join("\n\n");
                    inputBox.value = finalText;
                    console.log("PDF content:\n", inputBox.value);
                }).catch(error => {
                    inputBox.value = "Error extracting text from PDF.";
                    console.error("Text extraction error:", error);
                });
            }).catch(error => {
                inputBox.value = "Error loading PDF.";
                console.error("PDF loading error:", error);
            });
        };
        reader.readAsArrayBuffer(file); // Important for PDFs
    }

    // For unsupported files
    else {
        const msg = "Unsupported file type. Please upload a .txt or .pdf file.";
        inputBox.value = msg;
        console.warn(msg);
    }
});
