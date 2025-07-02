const form = document.getElementById('contact-form');
const popupMessage = document.getElementById('popup-message');
const popupText = document.getElementById('popup-text');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  
  // Convert FormData to JSON object
  const formDataObj = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });
  
  fetch('/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formDataObj)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    form.reset();
    popupText.textContent = data.message || 'Form submitted successfully!';
    popupMessage.classList.add('show');
  })
  .catch(error => {
    console.error('Error:', error);
    popupText.textContent = 'Error submitting form. Please try again.';
    popupMessage.classList.add('show');
  });
});

// Add event listener to close popup message when user clicks outside
document.addEventListener('click', (e) => {
  if (e.target !== popupMessage && !popupMessage.contains(e.target)) {
    popupMessage.classList.remove('show');
  }
});