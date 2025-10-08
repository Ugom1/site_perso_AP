async function getLatestVideoUrl() {
  const channelId = "UCdyVYz4wRqj14bV_KLQaMQA"
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  const timestamp = new Date().getTime()
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}&t=${timestamp}`

  try {
    const response = await fetch(proxyUrl, {
      cache: "no-store",
    })
    const xmlText = await response.text()

    console.log("[v0] RSS XML received, parsing...")

    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, "text/xml")

    const firstEntry = xmlDoc.querySelector("entry")
    if (firstEntry) {
      const linkElement = firstEntry.querySelector("link")
      if (linkElement) {
        const href = linkElement.getAttribute("href")
        console.log("[v0] Found link:", href)

        // Extract video ID from the URL
        const videoIdMatch = href.match(/watch\?v=([^&]+)/)
        if (videoIdMatch) {
          const latestVideoId = videoIdMatch[1]
          console.log("[v0] Extracted video ID:", latestVideoId)
          return `https://www.youtube.com/watch?v=${latestVideoId}`
        }
      }

      const videoIdElement = firstEntry.querySelector("videoId")
      if (videoIdElement) {
        const latestVideoId = videoIdElement.textContent
        console.log("[v0] Found videoId element:", latestVideoId)
        return `https://www.youtube.com/watch?v=${latestVideoId}`
      }
    }

    console.error("[v0] Could not extract video ID from RSS feed")
  } catch (error) {
    console.error("[v0] Error fetching latest video:", error)
  }

  return null
}

let latestVideoUrl = null
let isVideoUrlReady = false

window.addEventListener("DOMContentLoaded", async () => {
  const overlay = document.getElementById("videoOverlay")
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      e.preventDefault()

      if (isVideoUrlReady && latestVideoUrl && latestVideoUrl.includes("watch?v=")) {
        console.log("[v0] Redirecting to:", latestVideoUrl)
        window.location.href = latestVideoUrl
      } else {
        console.log("[v0] Video URL not ready or invalid, cannot redirect")
        alert("Impossible de charger la dernière vidéo. Veuillez réessayer.")
      }
    })

    overlay.style.cursor = "wait"
    overlay.style.opacity = "0.7"

    console.log("[v0] Fetching latest video URL...")
    latestVideoUrl = await getLatestVideoUrl()
    isVideoUrlReady = true
    console.log("[v0] Video URL ready:", latestVideoUrl)

    overlay.style.cursor = "pointer"
    overlay.style.opacity = "1"

    if (latestVideoUrl && latestVideoUrl.includes("watch?v=")) {
      overlay.href = latestVideoUrl
    }
  }
})
