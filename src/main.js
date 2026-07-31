import './style.css'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function setupHeader() {
  const header = document.querySelector('[data-header]')
  if (!header) return

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24)
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
}

function setupNav() {
  const toggle = document.querySelector('[data-nav-toggle]')
  const nav = document.querySelector('[data-nav]')
  if (!toggle || !nav) return

  const close = () => {
    toggle.setAttribute('aria-expanded', 'false')
    nav.classList.remove('is-open')
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true'
    toggle.setAttribute('aria-expanded', String(!open))
    nav.classList.toggle('is-open', !open)
  })

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close)
  })

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close()
  })
}

function setupReveals() {
  const elements = document.querySelectorAll('[data-reveal]')
  if (!elements.length) return

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
  )

  elements.forEach((el) => observer.observe(el))
}

function setupHeroParallax() {
  const image = document.querySelector('[data-hero-image]')
  const hero = document.querySelector('[data-hero]')
  if (!image || !hero || prefersReducedMotion) return

  let ticking = false

  const update = () => {
    const rect = hero.getBoundingClientRect()
    const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1)
    const scale = 1.06 - progress * 0.04
    const translate = progress * 36
    image.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`
    ticking = false
  }

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    },
    { passive: true },
  )

  update()
}

setupHeader()
setupNav()
setupReveals()
setupHeroParallax()
