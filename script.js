document.getElementById("imageUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById("preview");
            img.src = e.target.result;
            img.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("convertBtn").addEventListener("click", function() {
    const image = document.getElementById("preview").src;
    if (image && image !== "#") {
        Tesseract.recognize(
            image,
            'eng', // English OCR
            {
                logger: m => console.log(m) // Logs progress
            }
        ).then(({ data: { text } }) => {
            document.getElementById("output").innerText = text || "No text found!";
        }).catch(error => {
            document.getElementById("output").innerText = "Error processing image!";
            console.error(error);
        });
    } else {
        alert("Please upload an image first.");
    }
});
