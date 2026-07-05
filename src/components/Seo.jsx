import { useEffect } from 'react'
import { useLang } from '../i18n/LanguageContext'

// Central per-route head manager. Updates the existing tags in <head>
// imperatively (no duplicates) so every route gets a unique title,
// description, canonical URL, social cards and optional JSON-LD.

// Single source of truth for the domain — change VITE_SITE_URL (in .env or the
// Vercel dashboard) to repoint the whole site. No trailing slash.
const SITE = (import.meta.env.VITE_SITE_URL || 'https://doronazran.com').replace(/\/$/, '')
const DEFAULT_IMAGE = `${SITE}/og-image.svg`

function upsertMeta(attr, key, content) {
  if (content == null) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({
  title,
  description,
  path = '',
  image,
  type = 'website',
  brandSuffix = true,
  jsonLd,
  noindex = false,
  breadcrumbs,
}) {
  const { lang } = useLang()

  useEffect(() => {
    const brand = lang === 'he' ? 'דורון אזרן' : 'Doron Azran'
    const fullTitle = title
      ? (brandSuffix ? `${title} | ${brand}` : title)
      : brand
    const url = SITE + (path || '')
    const img = image || DEFAULT_IMAGE

    document.title = fullTitle
    upsertMeta('name', 'robots', noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    if (description) upsertMeta('name', 'description', description)
    upsertLink('canonical', url)

    upsertMeta('property', 'og:title', fullTitle)
    if (description) upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', img)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:locale', lang === 'he' ? 'he_IL' : 'en_US')

    upsertMeta('name', 'twitter:title', fullTitle)
    if (description) upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', img)
  }, [title, description, path, image, type, brandSuffix, lang, noindex])

  // Optional per-route structured data (Service / Article / Breadcrumb ...)
  useEffect(() => {
    const id = 'route-jsonld'
    document.getElementById(id)?.remove()

    // Build the node list: any explicit jsonLd plus an auto BreadcrumbList.
    const nodes = []
    if (Array.isArray(jsonLd)) nodes.push(...jsonLd)
    else if (jsonLd) nodes.push(jsonLd)
    if (Array.isArray(breadcrumbs) && breadcrumbs.length) {
      nodes.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: SITE + b.path,
        })),
      })
    }
    if (!nodes.length) return

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    script.textContent = JSON.stringify(nodes.length === 1 ? nodes[0] : nodes)
    document.head.appendChild(script)
    return () => { document.getElementById(id)?.remove() }
  }, [jsonLd, breadcrumbs])

  return null
}
