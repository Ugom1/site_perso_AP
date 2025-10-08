// Video overlay click handler - redirects to YouTube
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("videoOverlay")
  const playlistId = "UUdyVYz4wRqj14bV_KLQaMQA"

  if (overlay) {
    // Detect iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

    // Update href based on device
    if (isIOS) {
      // iOS: Use playlist page (embed doesn't work on iOS)
      overlay.href = `https://www.youtube.com/playlist?list=${playlistId}`
      console.log("[v0] iOS detected - using playlist URL")
    } else {
      // PC/Android: Use embed with autoplay (works and plays video automatically)
      overlay.href = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1`
      console.log("[v0] Non-iOS detected - using embed URL with autoplay")
    }
  }
})
