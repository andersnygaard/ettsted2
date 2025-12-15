/**
 * Fuzzy matching utilities for account name matching
 *
 * Provides Norwegian-aware fuzzy matching with scoring for the import agent.
 */

import { AccountConfig } from '../models/User';

/**
 * Result of a fuzzy match operation
 */
export interface FuzzyMatchResult {
  /**
   * Matched account ID
   */
  accountId: string;

  /**
   * Matched account name
   */
  accountName: string;

  /**
   * Account category
   */
  category: string;

  /**
   * Match score (0-100, higher is better)
   */
  score: number;
}

/**
 * Calculate Levenshtein distance between two strings
 *
 * Measures the minimum number of single-character edits (insertions, deletions, or substitutions)
 * required to change one word into another.
 *
 * @param a - First string
 * @param b - Second string
 * @returns Levenshtein distance (0 = identical)
 */
export function levenshteinDistance(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;

  // Early exit for empty strings
  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  // Create distance matrix
  const matrix: number[][] = [];

  // Initialize first column (distance from empty string)
  for (let i = 0; i <= aLen; i++) {
    matrix[i] = [i];
  }

  // Initialize first row (distance from empty string)
  for (let j = 0; j <= bLen; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[aLen][bLen];
}

/**
 * Calculate match score between search term and account name
 *
 * Scoring strategy (Norwegian-aware):
 * - Exact match (case-insensitive): 100
 * - Starts with: 90
 * - Contains: 80
 * - Levenshtein distance ≤ 1: 60
 * - Levenshtein distance ≤ 2: 50
 * - Otherwise: 0 (no match)
 *
 * @param searchTerm - User's search input
 * @param accountName - Account name to match against
 * @returns Match score (0-100)
 */
export function calculateScore(searchTerm: string, accountName: string): number {
  // Normalize both strings (lowercase, trim)
  const normalizedSearch = searchTerm.toLowerCase().trim();
  const normalizedAccount = accountName.toLowerCase().trim();

  // Exact match
  if (normalizedSearch === normalizedAccount) {
    return 100;
  }

  // Starts with
  if (normalizedAccount.startsWith(normalizedSearch)) {
    return 90;
  }

  // Contains
  if (normalizedAccount.includes(normalizedSearch)) {
    return 80;
  }

  // Levenshtein-based scoring for typos
  const distance = levenshteinDistance(normalizedSearch, normalizedAccount);

  if (distance <= 1) {
    return 60;
  }

  if (distance <= 2) {
    return 50;
  }

  // No match
  return 0;
}

/**
 * Fuzzy match search term against user's configured accounts
 *
 * Returns all accounts with scores above the threshold, sorted by score (descending).
 *
 * @param searchTerm - User's search input (e.g., "kron", "nord")
 * @param accounts - User's configured accounts
 * @param threshold - Minimum score to include (default: 50)
 * @returns Array of fuzzy match results, sorted by score descending
 */
export function fuzzyMatchAccounts(
  searchTerm: string,
  accounts: AccountConfig[],
  threshold: number = 50
): FuzzyMatchResult[] {
  const results: FuzzyMatchResult[] = [];

  for (const account of accounts) {
    const score = calculateScore(searchTerm, account.name);

    if (score >= threshold) {
      results.push({
        accountId: account.id,
        accountName: account.name,
        category: account.category,
        score,
      });
    }
  }

  // Sort by score descending (best matches first)
  results.sort((a, b) => b.score - a.score);

  return results;
}
