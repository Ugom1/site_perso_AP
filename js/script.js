// =========================
//  MENU MOBILE
// =========================
const hamburger = document.getElementById("hamburger")
const mobileNav = document.getElementById("mobileNav")

if (hamburger && mobileNav) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    mobileNav.classList.toggle("active")
  })

  const navLinks = mobileNav.querySelectorAll("a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      mobileNav.classList.remove("active")
    })
  })
}

// =========================
//  SCROLL DOUX SUR LES ANCRES
// =========================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if (href !== "#" && document.querySelector(href)) {
      e.preventDefault()
      document.querySelector(href).scrollIntoView({
        behavior: "smooth",
      })
    }
  })
})

// =========================
//  EFFET NAVBAR AU SCROLL
// =========================
const navbar = document.querySelector(".navbar")

if (navbar) {
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset
    if (currentScroll > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })
}

// =========================
//  ANIMATIONS D'APPARITION
// =========================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "0"
        entry.target.style.animation = "fadeInUp 0.6s ease-out forwards"
        obs.unobserve(entry.target)
      }
    })
  }, observerOptions)

  document
    .querySelectorAll(".character-card, .social-card")
    .forEach((el) => observer.observe(el))
}

// =========================
//  YOUTUBE : OVERLAY DERNIÈRE VIDÉO
// =========================

const YT_CHANNEL_ID = "UCdyVYz4wRqj14bV_KLQaMQA"
const RETRY_DELAY_MS = 5000 // 5s entre chaque tentative

async function fetchLatestVideoUrl() {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`
  const timestamp = Date.now()
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
    rssUrl
  )}&t=${timestamp}`

  try {
    const response = await fetch(proxyUrl, { cache: "no-store" })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const xmlText = await response.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, "text/xml")

    const firstEntry = xmlDoc.querySelector("entry")
    if (!firstEntry) return null

    let videoId = null
    const linkElement = firstEntry.querySelector("link")

    if (linkElement) {
      const href = linkElement.getAttribute("href") || ""
      const match = href.match(/watch\?v=([^&]+)/)
      if (match) videoId = match[1]
    }

    if (!videoId) {
      const videoIdElement =
        firstEntry.querySelector("yt\\:videoId") ||
        firstEntry.querySelector("videoId")
      if (videoIdElement) videoId = videoIdElement.textContent.trim()
    }

    if (!videoId) return null

    const title =
      firstEntry.querySelector("title")?.textContent.trim() ||
      "Dernière vidéo"

    return {
      id: videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title,
    }
  } catch (err) {
    console.error("[video] Erreur RSS YouTube :", err)
    return null
  }
}

function startLatestVideoPolling(overlay, titleEl) {
  async function attempt() {
    const latest = await fetchLatestVideoUrl()

    if (!latest) {
      // Échec : on attend puis on recommence
      console.warn("[video] Aucune vidéo trouvée, nouvelle tentative dans", RETRY_DELAY_MS, "ms")
      setTimeout(attempt, RETRY_DELAY_MS)
      return
    }

    // Succès : on active enfin le clic
    overlay.href = latest.url
    overlay.title = `Regarder ${latest.title} sur YouTube`
    overlay.setAttribute(
      "aria-label",
      `Regarder ${latest.title} sur YouTube`
    )
    overlay.classList.remove("is-disabled")

    if (titleEl) {
      titleEl.textContent = latest.title
      titleEl.classList.add("is-visible")
    }

    console.info("[video] Dernière vidéo chargée :", latest.url)
  }

  // On lance la première tentative
  attempt()
}

// =========================
//  INITIALISATION OVERLAY
// =========================

window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("videoOverlay")
  const titleEl = document.getElementById("videoTitle")

  if (!overlay) return

  // Départ : overlay désactivé, pas de lien
  overlay.classList.add("is-disabled")
  overlay.removeAttribute("href")
  overlay.title = "Chargement de la dernière vidéo..."
  overlay.setAttribute("aria-label", "Chargement de la dernière vidéo")

  if (titleEl) {
    titleEl.textContent = "Chargement de la dernière vidéo..."
    titleEl.classList.add("is-visible")
  }

  // On commence la boucle de tentatives jusqu'à succès
  startLatestVideoPolling(overlay, titleEl)
})
