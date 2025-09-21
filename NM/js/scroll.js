function closeLightbox() {
    const currentScrollY = window.scrollY
    location.hash = ""
    setTimeout(() => {
      window.scrollTo(0, currentScrollY)
    }, 10)
  }
  ;(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        if (location.hash && location.hash.indexOf("lb-") === 1) {
          closeLightbox()
        }
      }
    })
  })()
  
  function downloadImage(imageUrl, filename) {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = filename
    link.style.display = "none"
  
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  