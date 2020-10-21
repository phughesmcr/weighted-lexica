"use strict";

import { Lexicon } from './lexicon';
import { Term } from "./term";

/** Represents an individual category in a lexicon. */
export class Category {
  /** A collection of unique terms belonging in this category. */
  private _terms: Set<Term>;

  /** The name of this category. */
  private _name: string;

  /** The intercept value of this category. */
  private _intercept: number;

  /** The lexicon this category belongs to. */
  private _lexicon: Lexicon;

  /** True if category contains no terms. */
  private _isEmpty: boolean = true;

  /**
   * Creates a new category instance.
   * @param name The name of this category.
   * @param intercept The intercept value of this category.
   */
  constructor(name: string, intercept: number, lexicon: Lexicon) {
    this._name = name;
    this._terms = new Set();
    this._intercept = intercept;
    this._lexicon = lexicon;
  }

  /** The name of this category. */
  get name(): string {
    return this._name;
  }

  /** The intercept value of this category. */
  get intercept(): number {
    return this._intercept;
  }

  /** Set the intercept value of this category. */
  set intercept(intercept: number) {
    this._intercept = intercept;
  }

  /** An array of Term objects contained in this category. */
  get terms(): Term[] {
    return Array.from(this._terms);
  }

  /** The lexicon this category belongs to. */
  get lexicon(): Lexicon {
    return this._lexicon;
  }

  /** True if category contains no terms. */
  get isEmpty(): boolean {
    return this._isEmpty;
  }

  /** Sets the _isEmpty flag. */
  private _checkEmpty(): void {
    if (this._terms.size === 0) {
      this._isEmpty = true;
    } else {
      this._isEmpty = false;
    }
  }

  /** Add a term to this category. */
  add(term: Term) {
    this._terms.add(term);
    this._checkEmpty();
  }

  /** Remove a term from this category. */
  remove(term: Term) {
    this._terms.delete(term);
    this._checkEmpty();
  }

  /** Is the given term present in this category? */
  has(term: Term): boolean {
    return this._terms.has(term);
  }

  /** Remove all data and associations within this category. */
  destroy(): void {
    this._terms.forEach((term: Term) => {
      term.remove(this);
    });
    this._terms.clear();
    this._checkEmpty();
    this._name = "";
    this._intercept = 0;
  }

  /** Serialize this category to a JSON string. */
  stringify(): string {
    return JSON.stringify({
      name: this.name,
      intercept: this.intercept,
      terms: this.terms.map((term: Term) => {
        return term.term;
      }),
    });
  }
}
