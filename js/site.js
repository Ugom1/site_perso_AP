document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("videoOverlay")
  if (overlay) {
    const baseUrl = "https://www.youtube.com/watch?list=UUdyVYz4wRqj14bV_KLQaMQA&index=1"

    // Add timestamp on page load to avoid cache
    overlay.href = `${baseUrl}&t=${Date.now()}`

    // Update timestamp on each click for fresh load
    overlay.addEventListener("click", () => {
      overlay.href = `${baseUrl}&t=${Date.now()}`
    })
  }
})
