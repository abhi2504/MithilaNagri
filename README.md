# Mithila Nagri — मिथिला नगरी

The most comprehensive, deeply-illustrated encyclopedia of **Mithila / Mithilanchal** — the cultural region spanning North Bihar (India) and the Madhesh & Koshi plains (Nepal). History, art, language, festivals, rituals, cuisine, places and people, across the India–Nepal border.

🌐 **Live site:** [mithilanagri.in](https://mithilanagri.in)

## What's inside

- **Festivals** — all 17 signature festivals as illustrated, step-by-step "journeys" (vidhi, mantras, folk songs, objects, regional variations), from Chhath and Makar Sankranti to Durga Puja, Kojagara, Sama-Chakeva and the Ram–Sita wedding at Janakpur (Vivaha Panchami).
- **Rituals** — the life-cycle saṃskāras (birth → mundan → upanayan → marriage → death) plus the Panji genealogy system and the Kohbar chamber, each a deep journey.
- **History, People, Places, Art, Cuisine, Language** — sections covering the region's dynasties, scholars, sacred sites, Madhubani painting, dishes, and the Maithili language & Tirhuta script.
- An offline **atlas**, a trilingual scaffold (English / Hindi / Maithili), and a full image pipeline favouring authentic photographs (Wikimedia Commons) with Madhubani-style illustration only where no real image exists.

## Tech

- [Astro 6](https://astro.build/) (static output) · Tailwind CSS v4 · React/vanilla islands
- Content collections + Zod schemas · [Pagefind](https://pagefind.app/) search · [MapLibre GL](https://maplibre.org/) atlas
- Deployed to **GitHub Pages** via the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # production build + Pagefind index → dist/
npm run check      # type-check
```

## Notes on sourcing

Content is researched from multiple sources; devotional/traditional claims are flagged as distinct from established history, and contested points are stated honestly rather than asserted. Mantras and folk-song lines are quoted only where they could be sourced.
