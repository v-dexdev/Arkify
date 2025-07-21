(() => {
    const numImages = 58; // total number of overlay images

  
    chrome.storage.local.get(['overlayEnabled'], (result) => {
        //result is an object that contains the data retrieved from chrome.storage.local.get
        //overlayEnabled is an attribute of result
        const enabled = result.overlayEnabled !== false; // default to true if not set
        const opacity = enabled ? '1' : '0';

        // get all yt thumbnails
        function getThumbnails() {
            const thumbnails = document.querySelectorAll("ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element),.ytp-videowall-still-image:not([style*='extension:'])");

            // for each image in the thumbnails array (which is thumbnail), get its image index, its base url, and then send it to 
            // apply thumbnails for a merge
            thumbnails.forEach((thumbnail) => {
                const index = getRandomImageIndex();
                // get the URL of the random image
                let OverlayUrl = getOverlayUrl(index);
                changeThumbnail(thumbnail, OverlayUrl);
            });
        }

        // apply new (and improved) thumbnails
        function changeThumbnail(thumbnail, OverlayUrl) {

            if (thumbnail.dataset.overlayApplied) return;

            // create the overlay image
            const overlay = document.createElement("img");
            overlay.src = OverlayUrl;
            overlay.style.position = "absolute";
            overlay.style.top = overlay.style.left = "0";
            overlay.style.width = overlay.style.height = "100%";
            overlay.style.zIndex = "0";
            overlay.style.opacity = opacity;
            // making it go on top
            thumbnail.parentElement.appendChild(overlay);
            thumbnail.dataset.overlayApplied = "true";
        }

        // get random image index
        function getRandomImageIndex() {
            return Math.floor(Math.random() * (numImages) + 1);
        }

        // get URL of the overlay image
        function getOverlayUrl(index) {
            return chrome.runtime.getURL(`assets/images/${index}.PNG`);
        }

        // observe the entire body of the document for changes
        const observer = new MutationObserver(() => {
            getThumbnails();
        });
        observer.observe(document.body, {
            // types of mutations to observe
            childList: true,
            subtree: true,
        });

        // initial call to set thumbnails on page load
        getThumbnails();
    });
})();
