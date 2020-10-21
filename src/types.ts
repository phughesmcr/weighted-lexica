/** [category]: weight */
export type LexiconCategoryObject = { [category: string]: number };

/** [term]: weight */
export type LexiconTermObject = { [term: string]: number };

/**
 * [category]: lexical value
 *
 * lexical value = (relative frequency * weight) for all terms + intercept
 */
export type LexiconResultObject = { [category: string]: number };
