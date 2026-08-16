/**
 * EduIQ AI Provider
 *
 * Clean abstraction for Academic Intelligence features.
 * Will eventually support Supabase edge functions or external AI APIs.
 * Currently uses the local rules engine for deterministic analysis.
 */

import type { Student, RosterStudent, Insight } from '@/types';
import { computeStudentInsights, computeClassInsights, computeInstitutionInsights } from './rules';

export interface AIProvider {
  analyzeStudent(student: Student): Promise<Insight[]>;
  analyzeClass(roster: RosterStudent[]): Promise<Insight[]>;
  analyzeInstitution(roster: RosterStudent[]): Promise<Insight[]>;
}

/**
 * Local rules-based AI provider.
 * Uses deterministic rules for insight generation — no external API calls.
 */
export const localAIProvider: AIProvider = {
  async analyzeStudent(student) {
    return computeStudentInsights(student);
  },
  async analyzeClass(roster) {
    return computeClassInsights(roster);
  },
  async analyzeInstitution(roster) {
    return computeInstitutionInsights(roster);
  },
};

// Default provider — will be swapped when external AI is configured
export const aiProvider = localAIProvider;
