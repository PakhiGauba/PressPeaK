function showPopup({ text, type }) {
    const existingPopup = document.getElementById('notification-popup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'notification-popup';
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '15px 25px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    popup.style.zIndex = '1000';
    popup.style.transition = 'opacity 0.3s ease-in-out';
    popup.style.display = 'flex';
    popup.style.alignItems = 'center';
    popup.style.gap = '10px';

    if (type === 'success') {
        popup.style.backgroundColor = '#e7f7ee';
        popup.style.border = '1px solid #34c759';
        popup.innerHTML = '<span style="color:#34c759;font-size:20px;">✓</span>';
    } else {
        popup.style.backgroundColor = '#ffe5e5';
        popup.style.border = '1px solid #ff3b30';
        popup.innerHTML = '<span style="color:#ff3b30;font-size:20px;">✕</span>';
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    textSpan.style.color = type === 'success' ? '#1a7f37' : '#b91c1c';
    textSpan.style.fontWeight = '500';
    popup.appendChild(textSpan);

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.marginLeft = '10px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#666';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.onclick = () => popup.remove();
    popup.appendChild(closeBtn);

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("writerSubmissionForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById("writerName").value,
            email: document.getElementById("writerEmail").value,
            phone: document.getElementById("writerPhone").value,
            languages: document.getElementById("contentLanguages").value,
            topics: document.getElementById("contentTopics").value,
            content: document.getElementById("sampleContent").value
        };

        try {
            const response = await fetch("/submit-story", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                form.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById("writeWithUsModal"));
                modal.hide();
                showPopup({ text: result.message, type: "success" });
            } else {
                showPopup({ text: result.message, type: "error" });
            }
        } catch (error) {
            console.error("Submission error:", error);
            showPopup({ text: "Error submitting your story. Try again later.", type: "error" });
        }
    });
});

