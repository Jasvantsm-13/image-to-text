document.getElementById("imageUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // Resize image for better OCR performance
                canvas.width = 600;
                canvas.height = (img.height / img.width) * 600;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                document.getElementById("preview").src = canvas.toDataURL();
                document.getElementById("preview").style.display = "block";
            };
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("convertBtn").addEventListener("click", function() {
    const image = document.getElementById("preview").src;
    if (image && image !== "#") {
        document.getElementById("output").value = "Processing...";
        Tesseract.recognize(
            image,
            'eng',
            {
                logger: m => console.log(m), // Logs progress
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?(){}[]:;-'
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

// Copy to clipboard function
document.getElementById("copyBtn").addEventListener("click", function() {
    const textArea = document.getElementById("output");
    textArea.select();
    document.execCommand("copy");
    alert("Text copied to clipboard!");
});