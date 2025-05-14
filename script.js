// Run this directly in the console
(async function() {
  // Create invisible file input
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/pdf';
  input.style.display = 'none';
  document.body.appendChild(input);
  
  // Trigger file selection
  input.click();
  
  // Wait for file selection
  const file = await new Promise(resolve => {
    input.onchange = () => resolve(input.files[0]);
  });
  
  // Remove the input element
  document.body.removeChild(input);
  
  if (!file) {
    console.log('No file selected');
    return;
  }
  
  if (file.type !== "application/pdf") {
    console.error('Please select a PDF file');
    return;
  }
  
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Basic PDF analysis (simplified)
  const uint8Array = new Uint8Array(arrayBuffer);
  const pdfHeader = String.fromCharCode(...uint8Array.slice(0, 8));
  const isPDF = pdfHeader.includes('%PDF-');
  
  console.log('====== PDF File Analysis ======');
  console.log(`File Name: ${file.name}`);
  console.log(`File Size: ${(file.size / 1024).toFixed(2)} KB`);
  console.log(`Is Valid PDF: ${isPDF}`);
  
  if (isPDF) {
    // Try to extract some text (very simplified)
    const fullText = String.fromCharCode(...uint8Array);
    const textSample = fullText
      .replace(/[^\x20-\x7E]/g, ' ') // Keep only printable ASCII
      .replace(/\s+/g, ' ') // Collapse whitespace
      .substring(0, 500); // Limit to first 500 chars
    
    console.log('\n=== Sample Text Content (raw) ===');
    console.log(textSample + '...');
    
    console.log('\nFor actual PDF rendering:');
    console.log('1. Open in new tab:');
    const blobUrl = URL.createObjectURL(file);
    console.log(`   open("${blobUrl}")`);
    console.log('2. Copy this to view in new tab:');
    console.log(`   copy("${blobUrl}")`);
  } else {
    console.error('Not a valid PDF file');
  }
})();
