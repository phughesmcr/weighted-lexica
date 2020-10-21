"use strict";

import { Category } from "./category";
import { Lexicon } from './lexicon';

/** Represents an individual term in a lexicon. */
export class Term {
  /** The term itself. */
  private _term: string;

  /** The categories associated with this term. */
  private _categories: Map<Category, number>;

  /** The lexicon this category belongs to. */
  private _lexicon: Lexicon;

  /** True if this term is attached to one or more categories. */
  private _isAttached: boolean = false;

  /**
   * Creates a new term instance.
   * @param term The term itself.
   */
  constructor(term: string, lexicon: Lexicon) {
    this._term = term;
    this._categories = new Map();
    this._lexicon = lexicon;
  }

  /** The term. */
  get term(): string {
    return this._term;
  }

  /** Array of [category name, weight] */
  get categories() {
    return Array.from(this._categories.entries());
  }

  /** The lexicon this category belongs to. */
  get lexicon(): Lexicon {
    return this._lexicon;
  }

  /** True if this term is attached to one or more categories. */
  get isAttached(): boolean {
    return this._isAttached;
  }

  /** Sets the _isAttached flag. */
  private _checkAttached(): void {
    if (this._categories.size === 0) {
      this._isAttached = true;
    } else {
      this._isAttached = false;
    }
  }

  /** Add category and weight data to this term. */
  add(category: Category, weight: number): void {
    category.add(this);
    this._categories.set(category, weight);
    this._checkAttached();
  }

  /** Remove a this term from a given category. */
  remove(category: Category): void {
    if (this._categories.has(category)) {
      category.remove(this);
      this._categories.delete(category);
      this._checkAttached();
    } else {
      throw new Error(
        `Category "${category}" does not exist in Term "${this._term}"`,
      );
    }
  }

  /** Is this term present in the given category? */
  has(category: Category): boolean {
    return this._categories.has(category);
  }

  /** Remove all associated categories and data from this term. */
  destroy(): void {
    this._categories.forEach((_weight, category) => {
      category.remove(this);
    });
    this._categories.clear();
    this._checkAttached();
    this._term = "";
  }

  /** Serialize this term to a JSON string. */
  stringify(): string {
    const cats: { [category: string]: number } = {};
    this._categories.forEach((weight, category) => {
      cats[category.name] = weight;
    });
    return JSON.stringify({
      term: this._term,
      categories: cats,
    });
  }
}
