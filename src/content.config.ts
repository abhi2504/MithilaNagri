import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Shared frontmatter for every content entry. Each file is authored in ONE
// language; the `slug` is the cross-language translationKey and `lang` marks
// the language. Query helpers (src/lib/content.ts) group by slug + fall back
// to English. Images are referenced by id into src/lib/media.ts.
const base = {
  lang: z.enum(['en', 'hi', 'mai']).default('en'),
  slug: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  sources: z
    .array(z.object({ label: z.string(), url: z.string().url() }))
    .default([]),
  order: z.number().optional(),
};

const geo = {
  country: z.enum(['IN', 'NP']),
  district: z.string().optional(),
  state: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
};

const places = defineCollection({
  loader: glob({ base: './src/data/places', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    ...geo,
    placeType: z.enum([
      'temple',
      'palace',
      'museum',
      'heritage',
      'ghat',
      'natural',
      'circuit',
      'venue',
    ]),
    deity: z.string().optional(),
    built: z.string().optional(),
    nearestRail: z.string().optional(),
    nearestAir: z.string().optional(),
    bestSeason: z.string().optional(),
    timings: z.string().optional(),
    entryFee: z.string().optional(),
    circuit: z.string().optional(),
    relatedFestivals: z.array(z.string()).default([]),
  }),
});

const personalities = defineCollection({
  loader: glob({ base: './src/data/personalities', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    era: z.enum(['ancient', 'medieval', 'colonial', 'modern', 'contemporary']),
    domains: z.array(
      z.enum([
        'sage',
        'literature',
        'painting',
        'music',
        'cinema',
        'politics',
        'scholarship',
        'science',
        'sport',
        'forces',
        'royalty',
      ])
    ),
    birthYear: z.number().optional(),
    deathYear: z.number().optional(),
    birthPlace: z.string().optional(),
    honors: z
      .array(z.object({ name: z.string(), year: z.number().optional() }))
      .default([]),
  }),
});

const festivals = defineCollection({
  loader: glob({ base: './src/data/festivals', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    hinduMonth: z.string().optional(),
    gregorian: z.string().optional(),
    durationDays: z.number().optional(),
    deities: z.array(z.string()).default([]),
    isSignature: z.boolean().default(false),
    uniqueToMithila: z.boolean().default(false),
  }),
});

const dishes = defineCollection({
  loader: glob({ base: './src/data/dishes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    category: z.enum([
      'snack',
      'sweet',
      'staple',
      'curry',
      'pickle',
      'beverage',
      'prasad',
      'festive',
    ]),
    keyIngredients: z.array(z.string()).default([]),
    occasion: z.string().optional(),
    giProduct: z.boolean().default(false),
  }),
});

const artStyles = defineCollection({
  loader: glob({ base: './src/data/art-styles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    community: z.string().optional(),
    motifs: z.array(z.string()).default([]),
    village: z.string().optional(),
  }),
});

// Generic long-form articles, tagged by section (used by Rituals & Living Culture).
const articles = defineCollection({
  loader: glob({ base: './src/data/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    section: z.string(),
    topic: z.string().optional(),
  }),
});

const villages = defineCollection({
  loader: glob({ base: './src/data/villages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    ...geo,
    nameNative: z.string().optional(),
    block: z.string().optional(),
    panchayat: z.string().optional(),
    sarpanch: z.string().optional(),
    famousFor: z.string(),
    nearestRail: z.string().optional(),
    rivers: z.array(z.string()).default([]),
    notablePeople: z.array(z.string()).default([]),
  }),
});

// Data-only collections (no article body) loaded from single JSON files.
const timelineEvents = defineCollection({
  loader: file('./src/data/timeline.json'),
  schema: z.object({
    id: z.string(),
    lang: z.enum(['en', 'hi', 'mai']).default('en'),
    year: z.number(),
    era: z.enum(['ancient', 'medieval', 'colonial', 'modern']),
    title: z.string(),
    body: z.string(),
    place: z.string().optional(),
  }),
});

const didYouKnow = defineCollection({
  loader: file('./src/data/did-you-know.json'),
  schema: z.object({
    id: z.string(),
    lang: z.enum(['en', 'hi', 'mai']).default('en'),
    fact: z.string(),
    section: z.string().optional(),
    sourceUrl: z.string().url().optional(),
  }),
});

export const collections = {
  places,
  personalities,
  festivals,
  dishes,
  artStyles,
  articles,
  villages,
  timelineEvents,
  didYouKnow,
};
