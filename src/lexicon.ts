"use strict";

import { Category } from "./category";
import { Term } from "./term";

import {
  LexiconCategoryObject,
  LexiconResultObject,
  LexiconTermObject,
} from "./types";

export class Lexicon {
  /** The name of this lexicon. */
  private _name: string;

  /** This lexicon's categories. */
  private _categories: Map<string, Category>;

  /** This lexicon's terms. */
  private _terms: Map<string, Term>;

  /**
   * Creates a new lexicon instance.
   * @param name The name of this lexicon.
   */
  constructor(name: string) {
    this._name = name;
    this._categories = new Map();
    this._terms = new Map();
  }

  /** Returns the name of this lexicon. */
  get name(): string {
    return this._name;
  }

  //#region Terms

  /**
   * Add a term to the lexicon.
   * @param term The term to add.
   * @param categories 2d array of categories and their associated weights for this term.
   */
  addTerm(term: string, categories?: [Category | string, number][]): Term {
    if (this._terms.has(term)) {
      throw new Error(`Term "${term}" already exists in lexicon "${this.name}". use term.add() to add categories to existing terms.`);
    }
    const t = new Term(term, this);
    if (categories) {
      categories.forEach(([category, weight]) => {
        if (typeof category === 'string') {
          if (!this._categories.has(category)) {
            throw new Error(`Category "${category}" not found in lexicon "${this.name}". Term "${term}" has not been added to the lexicon!`);
          } else {
            category = this._categories.get(category)!;
          }
        }
        t.add(category, weight);
      });
    }
    this._terms.set(term, t);
    return t;
  }

  /**
   * Remove a term from the lexicon.
   * @param term The term to remove.
   * @param category The category to remove the term from.
   *    If no category is provided, the term will be removed from all categories.
   */
  removeTerm(term: string, category?: string): void {
    if (this._terms.has(term)) {
      if (category) {
        if (this._categories.has(category)) {
          this._terms.get(term)!.remove(this._categories.get(category)!);
        } else {
          throw new Error(
            `Category "${category}" does not exist in lexicon "${this.name}".`,
          );
        }
      } else {
        this._terms.get(term)!.destroy();
        this._terms.delete(term);
      }
    } else {
      throw new Error(
        `Term "${term}" does not exist in lexicon "${this.name}".`,
      );
    }
  }

  /**
   * Return a term from this lexicon
   * @param term The term to find
   */
  getTerm(term: string): Term | undefined {
    return this._terms.get(term);
  }

  //#endregion Terms

  //#region Categories

  /** Add a new category to this lexicon. */
  addCategory(name: string, intercept: number): Category {
    if (this._categories.has(name)) {
      throw new Error(`Category "${name}" already exists in lexicon "${this.name}".`);
    }
    const category = new Category(name, intercept, this);
    this._categories.set(name, category);
    return category;
  }

  /** Remove a category from this lexicon. */
  removeCategory(name: string): this {
    if (!this._categories.has(name)) {
      throw new Error(`Category "${name}" does not exist in lexicon "${this.name}".`);
    } else {
      this._categories.get(name)!.destroy();
      this._categories.delete(name);
    }
    return this;
  }

  /**
   * Returns a category from this lexicon.
   * @param category The name of the category to get.
   */
  getCategory(category: string): Category | undefined {
    return this._categories.get(category)!;
  }

  //#endregion Categories

  /** Serialize this lexicon to a JSON string. */
  stringify(): string {
    const cats: { [category: string]: string } = {};
    this._categories.forEach((category, name) => {
      cats[name] = category.stringify();
    });
    const terms: { [term: string]: string } = {};
    this._terms.forEach((term, name) => {
      terms[name] = term.stringify();
    });
    return JSON.stringify({
      name: this.name,
      categories: cats,
      terms: terms,
    });
  }

  /** Get lexical values for a given token array. */
  analyse(tokens: string[]): LexiconResultObject {
    const wordCount = tokens.length;
    const tokenCounts = tokens.reduce((obj, token) => {
      obj[token] = (obj[token]) ? (obj[token] + 1) : 1;
      return obj;
    }, {} as LexiconTermObject);

    const output: LexiconResultObject = {};
    const intercepts: LexiconCategoryObject = {};

    for (const key in tokenCounts) {
      if (!tokenCounts.hasOwnProperty(key)) continue;
      if (this._terms.has(key)) {
        const term = this._terms.get(key)!;
        const rel = tokenCounts[key] / wordCount;
        const categories = term.categories;
        categories.forEach(([category, weight]) => {
          const now = output[category.name] || 0;
          output[category.name] = (rel * weight) + now;
        });
      }
    }

    for (const category in intercepts) {
      if (!intercepts.hasOwnProperty(category)) continue;
      output[category] = output[category] + intercepts[category];
    }

    return output;
  }
}
