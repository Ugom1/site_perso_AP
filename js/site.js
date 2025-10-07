async function getLatestVideoUrl() {
    const channelId = 'UCdyVYz4wRqj14bV_KLQaMQA';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
    
    try {
        const response = await fetch(proxyUrl);
        const xmlText = await response.text();
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const videoId = xmlDoc.querySelector('entry yt\\:videoId, entry videoId');
        
        if (videoId) {
            const latestVideoId = videoId.textContent;
            return `https://www.youtube.com/watch?v=${latestVideoId}`;
        }
    } catch (error) {
        console.error('[v0] Error fetching latest video:', error);
    }
    
    return 'https://www.youtube.com/@ap_r0se473/videos';
}

window.addEventListener('DOMContentLoaded', async () => {
    const overlay = document.getElementById('videoOverlay');
    const latestVideoUrl = await getLatestVideoUrl();
    overlay.href = latestVideoUrl;
});