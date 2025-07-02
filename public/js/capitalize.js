function capitalizeText(text) {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function capitalizeHeadings() {
  const headings = document.querySelectorAll("h2.axil-post-title, h3.axil-post-title");

  headings.forEach((heading) => {
    // If it contains a link (like <h3><a>text</a></h3>)
    const link = heading.querySelector("a");
    if (link) {
      link.textContent = capitalizeText(link.textContent);
    } else {
      heading.textContent = capitalizeText(heading.textContent);
    }
  });
}

document.addEventListener("DOMContentLoaded", capitalizeHeadings);
