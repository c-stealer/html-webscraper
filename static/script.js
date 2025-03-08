document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const scrapeButton = document.getElementById('scrapeButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const titleSection = document.getElementById('titleSection');
    const paragraphsSection = document.getElementById('paragraphsSection');
    const linksSection = document.getElementById('linksSection');

    scrapeButton.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Please enter a valid URL');
            return;
        }

        // Reset previous results
        titleSection.innerHTML = '';
        paragraphsSection.innerHTML = '';
        linksSection.innerHTML = '';
        
        // Show loading spinner
        loadingSpinner.classList.remove('hidden');
        resultSection.classList.add('hidden');

        try {
            const response = await fetch('/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });

            const data = await response.json();

            // Hide loading spinner
            loadingSpinner.classList.add('hidden');
            resultSection.classList.remove('hidden');

            if (data.error) {
                titleSection.innerHTML = `<h3>Error</h3><p>${data.error}</p>`;
                return;
            }

            // Display Title
            titleSection.innerHTML = `<h3>Page Title</h3><p>${data.title}</p>`;

            // Display Paragraphs
            if (data.paragraphs && data.paragraphs.length > 0) {
                paragraphsSection.innerHTML = `<h3>First ${data.paragraphs.length} Paragraphs</h3>`;
                data.paragraphs.forEach(para => {
                    paragraphsSection.innerHTML += `<p>${para}</p>`;
                });
            }

            // Display Links
            if (data.links && data.links.length > 0) {
                linksSection.innerHTML = `<h3>First ${data.links.length} Links</h3>`;
                data.links.forEach(link => {
                    linksSection.innerHTML += `<a href="${link.href}" target="_blank">${link.text}</a>`;
                });
            }

        } catch (error) {
            console.error('Scraping error:', error);
            titleSection.innerHTML = `<h3>Error</h3><p>An unexpected error occurred</p>`;
        } finally {
            loadingSpinner.classList.add('hidden');
        }
    });
});
