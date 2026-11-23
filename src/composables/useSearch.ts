import { computed, toValue, type InjectionKey, type MaybeRefOrGetter, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { news } from '@/data/news'
import { rankings } from '@/data/rankings'
import { navLinks } from '@/data/site'
import type { RankingId } from '@/types/ranking'

/** Result groups, in the order they are listed. Labels at `search.groups.<group>`. */
export const SEARCH_GROUPS = ['news', 'ranking', 'section'] as const
export type SearchGroup = (typeof SEARCH_GROUPS)[number]

/** Shortest query (after trimming) that searches. */
export const MIN_QUERY_LENGTH = 2
/** Most results listed, across every group. */
export const MAX_RESULTS = 8

/**
 * Active ranking tab, provided by `HomeView` (the `v-model` of `RankingSection`)
 * so the search can open the tab of the climber it jumps to.
 */
export const RANKING_TAB_KEY: InjectionKey<Ref<RankingId>> = Symbol('rankingTab')

/** Something on the page the search can find. */
export interface SearchEntry {
  /** Stable across languages, e.g. `news-trad`, `ranking-velocidad-1`, `section-news`. */
  id: string
  group: SearchGroup
  /** Text shown (and searched) as the result title, in the active language. */
  title: string
  /** Extra searchable text (the body of a news item). */
  text?: string
  /** Short context shown beside the title (ranking and metric). */
  meta?: string
  /** `id` of the element to scroll to. */
  targetId: string
  /** Ranking tab that must be open for `targetId` to exist. */
  tab?: RankingId
}

/** A string split around the matched part, ready to render `before<mark>hit</mark>after`. */
export interface Highlighted {
  before: string
  hit: string
  after: string
}

export interface SearchResult {
  entry: SearchEntry
  /** Title split around the match (`hit` is empty when only `text` matched). */
  title: Highlighted
  /** Excerpt of `text` around the match, when the title itself does not match. */
  snippet?: Highlighted
}

export interface SearchResultGroup {
  group: SearchGroup
  results: SearchResult[]
}

type Translate = (key: string, named?: Record<string, unknown>) => string

const DIACRITICS = /[̀-ͯ]/g

/** Lower case, without accents (NFD minus combining marks): «Ginés» -> «gines». */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(DIACRITICS, '').toLowerCase()
}

/**
 * Where the normalized `query` occurs in `text`, as offsets into the original
 * `text` (so the accented letters are the ones highlighted), or `null`.
 */
export function findMatch(text: string, query: string): { start: number; end: number } | null {
  const needle = normalize(query.trim())
  if (!needle) return null

  // Normalize char by char, remembering where each normalized char came from.
  let haystack = ''
  const origin: number[] = []
  for (let i = 0; i < text.length; i++) {
    const piece = normalize(text[i]!)
    haystack += piece
    for (let j = 0; j < piece.length; j++) origin.push(i)
  }

  const at = haystack.indexOf(needle)
  if (at < 0) return null
  return { start: origin[at]!, end: origin[at + needle.length - 1]! + 1 }
}

function split(text: string, match: { start: number; end: number } | null): Highlighted {
  if (!match) return { before: text, hit: '', after: '' }
  return {
    before: text.slice(0, match.start),
    hit: text.slice(match.start, match.end),
    after: text.slice(match.end),
  }
}

const SNIPPET_BEFORE = 24
const SNIPPET_AFTER = 48

function excerpt(text: string, match: { start: number; end: number }): Highlighted {
  const from = Math.max(0, match.start - SNIPPET_BEFORE)
  const to = Math.min(text.length, match.end + SNIPPET_AFTER)
  const parts = split(text, match)
  return {
    before: (from > 0 ? '…' : '') + parts.before.slice(from),
    hit: parts.hit,
    after: parts.after.slice(0, to - match.end) + (to < text.length ? '…' : ''),
  }
}

/** Every searchable entry, with the copy of the active language. */
export function buildSearchIndex(t: Translate): SearchEntry[] {
  const newsEntries: SearchEntry[] = news.map((item) => ({
    id: `news-${item.id}`,
    group: 'news',
    title: t(`news.items.${item.id}.title`),
    text: t(`news.items.${item.id}.text`),
    targetId: `news-${item.id}`,
  }))

  const rankingEntries: SearchEntry[] = rankings.flatMap((ranking) =>
    ranking.data.map((climber) => ({
      id: `ranking-${ranking.id}-${climber.rank}`,
      group: 'ranking' as const,
      title: climber.name,
      meta: t('search.rankingMeta', {
        tab: t(`search.tabs.${ranking.id}`),
        metric: climber.metric,
      }),
      targetId: `ranking-${ranking.id}-${climber.rank}`,
      tab: ranking.id,
    })),
  )

  const sectionEntries: SearchEntry[] = navLinks.map((link) => ({
    id: `section-${link.key}`,
    group: 'section',
    title: t(`nav.${link.key}`),
    targetId: link.href.slice(1),
  }))

  return [...newsEntries, ...rankingEntries, ...sectionEntries]
}

/** Whether `query` is long enough to search. */
export function isSearchable(query: string): boolean {
  return normalize(query.trim()).length >= MIN_QUERY_LENGTH
}

/**
 * Entries whose title or text contains `query` (ignoring case and accents),
 * in group order, at most `MAX_RESULTS`. Empty below `MIN_QUERY_LENGTH`.
 */
export function searchIndex(index: SearchEntry[], query: string): SearchResult[] {
  if (!isSearchable(query)) return []

  const results: SearchResult[] = []
  for (const entry of index) {
    const titleMatch = findMatch(entry.title, query)
    const textMatch = titleMatch || !entry.text ? null : findMatch(entry.text, query)
    if (!titleMatch && !textMatch) continue
    results.push({
      entry,
      title: split(entry.title, titleMatch),
      ...(textMatch && entry.text ? { snippet: excerpt(entry.text, textMatch) } : {}),
    })
  }

  const order = (r: SearchResult) => SEARCH_GROUPS.indexOf(r.entry.group)
  return results.sort((a, b) => order(a) - order(b)).slice(0, MAX_RESULTS)
}

/** Results bucketed by group, skipping empty groups. */
export function groupResults(results: SearchResult[]): SearchResultGroup[] {
  return SEARCH_GROUPS.map((group) => ({
    group,
    results: results.filter((r) => r.entry.group === group),
  })).filter((g) => g.results.length > 0)
}

/**
 * Client-side search over the page content in the active language. The index
 * is rebuilt when the language changes.
 */
export function useSearch(
  query: MaybeRefOrGetter<string>,
  i18n: { t: Translate; locale: Ref<string> } = useI18n(),
) {
  const index = computed(() => {
    void i18n.locale.value // rebuild on language change
    return buildSearchIndex(i18n.t)
  })
  const results = computed(() => searchIndex(index.value, toValue(query)))
  const groups = computed(() => groupResults(results.value))
  const searchable = computed(() => isSearchable(toValue(query)))

  return { index, results, groups, searchable }
}
