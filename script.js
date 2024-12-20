// Function to check if the device is mobile
const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

if (isMobile()) {
    const preloadedPages = new Map();

    // Function to preload HTML content
    const preloadContent = (url) => {
        if (!preloadedPages.has(url)) {
            fetch(url)
                .then((response) => response.text())
                .then((html) => {
                    preloadedPages.set(url, html);
                    console.log(`Preloaded: ${url}`);
                })
                .catch((error) => console.error(`Failed to preload: ${url}`, error));
        }
    };

    // Function to handle link clicks
    const handleClick = (event) => {
        event.preventDefault();
        const url = event.target.dataset.url;

        if (preloadedPages.has(url)) {
            document.getElementById('content').innerHTML = preloadedPages.get(url);
            console.log(`Loaded from preload: ${url}`);
        } else {
            // Fallback in case the page wasn't preloaded
            fetch(url)
                .then((response) => response.text())
                .then((html) => {
                    document.getElementById('content').innerHTML = html;
                    console.log(`Loaded directly: ${url}`);
                })
                .catch((error) => console.error(`Failed to load directly: ${url}`, error));
        }
    };

    // Observe links and preload/dump as needed
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const url = entry.target.dataset.url;
            if (entry.isIntersecting) {
                preloadContent(url);
            } else {
                // Optionally, dump content if needed to save memory
                preloadedPages.delete(url);
                console.log(`Dumped: ${url}`);
            }
        });
    });

    // Attach observer to all links
    const links = document.querySelectorAll('.link');
    links.forEach((link) => {
        observer.observe(link);
        link.addEventListener('click', handleClick);
    });
}
