document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("videoOverlay")
  if (overlay) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

    // iOS devices use regular playlist URL, others use embed with autoplay
    const baseUrl = isIOS
      ? "https://www.youtube.com/playlist?list=UUdyVYz4wRqj14bV_KLQaMQA"
      : "https://www.youtube.com/embed/videoseries?list=UUdyVYz4wRqj14bV_KLQaMQA&autoplay=1"

    // Add timestamp on page load to avoid cache
    overlay.href = `${baseUrl}&t=${Date.now()}`

    // Update timestamp on each click for fresh load
    overlay.addEventListener("click", () => {
      overlay.href = `${baseUrl}&t=${Date.now()}`
    })
  }
})