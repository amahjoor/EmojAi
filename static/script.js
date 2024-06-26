async function generateEmojis() {
    const description = document.getElementById('description').value;
    const loading = document.getElementById('loading');
    startLoadingAnimation(); // starts loading animation upon button click
    //const num_emojis = parseInt(document.getElementById('num_emojis').value, 10);
    
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //body: JSON.stringify({ description, num_emojis })
            body: JSON.stringify({ description })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const emojisDiv = document.getElementById('emojis');
        emojisDiv.innerHTML = '';
        
        data.emojis.forEach(emoji => {
            const emojiElement = document.createElement('div');
            emojiElement.classList.add('emoji');
            emojiElement.textContent = emoji;
            emojiElement.onclick = () => copyToClipboard(emojiElement);
            emojisDiv.appendChild(emojiElement);
        });
    } catch (error) {
        console.error('Error generating emojis:', error);
    } finally {
        stopLoadingAnimation(); // stops loading animation
    }
}

/** function to do a loading animation */
function startLoadingAnimation() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    let dotCount = 0;
    loadingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 100;
        loading.textContent = 'loading' + '.'.repeat(dotCount);
    }, 500);
}

/** function to stop the loading animation */
function stopLoadingAnimation() {
    clearInterval(loadingInterval);
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
}

/** function to copy the element to clipboard */
function copyToClipboard(element) {
    /** copies */
    const textarea = document.createElement('textarea');
    textarea.value = element.textContent;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    /** adds an indication saying it was copied */
    let copiedIndicator = element.querySelector('.copied');
    if (!copiedIndicator) {
        copiedIndicator = document.createElement('div');
        copiedIndicator.classList.add('copied');
        copiedIndicator.textContent = 'copied! :)';
        element.appendChild(copiedIndicator);
    }

    copiedIndicator.style.display = 'block';  // displays copied indicator

    setTimeout(() => {
        element.removeChild(copiedIndicator);
    }, 1500); // removes the copied indicator after 1.5 sec.
}
