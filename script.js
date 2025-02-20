// Drag & Drop and File Upload
const dropArea = document.getElementById("dropArea");
const imageUpload = document.getElementById("imageUpload");

dropArea.addEventListener("click", () => imageUpload.click());
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.background = "#f3f3f3";
});
dropArea.addEventListener("dragleave", () => {
    dropArea.style.background = "white";
});
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.background = "white";
    imageUpload.files = e.dataTransfer.files;
    previewImage();
});

imageUpload.addEventListener("change", previewImage);

function previewImage() {
    const file = imageUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("preview").src = e.target.result;
            document.getElementById("preview").style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}

// Convert Image to Text
document.getElementById("convertBtn").addEventListener("click", function () {
    const image = document.getElementById("preview").src;
    if (image && image !== "#") {
        document.getElementById("output").value = "Processing...";
        Tesseract.recognize(
            image,
            'eng+hin', // English + Hindi OCR
            {
                logger: m => console.log(m)
            }
        ).then(({ data: { text } }) => {
            document.getElementById("output").value = text.trim();
            document.getElementById("output-container").style.display = "block";
        }).catch(error => {
            document.getElementById("output").value = "Error processing image!";
            console.error(error);
        });
    } else {
        alert("Please upload an image first.");
    }
});

// Copy to Clipboard
document.getElementById("copyBtn").addEventListener("click", function () {
    const textArea = document.getElementById("output");
    textArea.select();
    document.execCommand("copy");
    alert("✅ Text copied to clipboard!");
});

// Download Extracted Text
document.getElementById("downloadBtn").addEventListener("click", function () {
    const text = document.getElementById("output").value;
    if (text.trim() === "") {
        alert("No text available to download!");
        return;
    }
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "extracted_text.txt";
    a.click();
});