import { Injectable } from '@nestjs/common';
import { TriageLevel } from '../../../generated/prisma/client.js';

export interface Phq9Responses {
  // Each question scored 0 (not at all) to 3 
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
}

export interface Gad7Responses {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
}

export interface HypertensionResponses {
  systolic: number;
  diastolic: number;
}

export interface DiabetesResponses {
  glucoseMgdl: number;
  isFasting?: boolean;
}

@Injectable()
export class ScoringEngine {
  // ============================================
  // PHQ-9 — Depression
  // ============================================
  scorePhq9(r: Phq9Responses): { score: number; triage: TriageLevel } {
    const score =
      r.q1 + r.q2 + r.q3 + r.q4 + r.q5 + r.q6 + r.q7 + r.q8 + r.q9;

    let triage: TriageLevel;
    if (score <= 4) triage = TriageLevel.GREEN;
    else if (score <= 9) triage = TriageLevel.GREEN;
    else if (score <= 14) triage = TriageLevel.YELLOW;
    else triage = TriageLevel.RED;

    return { score, triage };
  }

  // ============================================
  // GAD-7 — Anxiety
  // ============================================
  scoreGad7(r: Gad7Responses): { score: number; triage: TriageLevel } {
    const score =
      r.q1 + r.q2 + r.q3 + r.q4 + r.q5 + r.q6 + r.q7;

    let triage: TriageLevel;
    if (score <= 4) triage = TriageLevel.GREEN;
    else if (score <= 9) triage = TriageLevel.GREEN;
    else if (score <= 14) triage = TriageLevel.YELLOW;
    else triage = TriageLevel.RED;

    return { score, triage };
  }

  // ============================================
  // Hypertension
  // ============================================
  scoreHypertension(r: HypertensionResponses): {
    score: number;
    triage: TriageLevel;
  } {
    const { systolic, diastolic } = r;

    // Hypertensive crisis — immediate
    if (systolic >= 180 || diastolic >= 120) {
      return { score: systolic, triage: TriageLevel.RED };
    }

    // Stage 2 hypertension
    if (systolic >= 160 || diastolic >= 100) {
      return { score: systolic, triage: TriageLevel.YELLOW };
    }

    // Stage 1 hypertension
    if (systolic >= 140 || diastolic >= 90) {
      return { score: systolic, triage: TriageLevel.YELLOW };
    }

    // Elevated
    if (systolic >= 120 || diastolic >= 80) {
      return { score: systolic, triage: TriageLevel.GREEN };
    }

    // Normal
    return { score: systolic, triage: TriageLevel.GREEN };
  }

  // ============================================
  // Diabetes
  // ============================================
  scoreDiabetes(r: DiabetesResponses): {
    score: number;
    triage: TriageLevel;
  } {
    const { glucoseMgdl, isFasting } = r;

    if (isFasting) {
      if (glucoseMgdl >= 300) return { score: glucoseMgdl, triage: TriageLevel.RED };
      if (glucoseMgdl >= 126) return { score: glucoseMgdl, triage: TriageLevel.YELLOW };
      if (glucoseMgdl >= 100) return { score: glucoseMgdl, triage: TriageLevel.GREEN };
      return { score: glucoseMgdl, triage: TriageLevel.GREEN };
    }

    // Non-fasting
    if (glucoseMgdl >= 400) return { score: glucoseMgdl, triage: TriageLevel.RED };
    if (glucoseMgdl >= 200) return { score: glucoseMgdl, triage: TriageLevel.YELLOW };
    if (glucoseMgdl >= 140) return { score: glucoseMgdl, triage: TriageLevel.GREEN };
    return { score: glucoseMgdl, triage: TriageLevel.GREEN };
  }

  // ============================================
  // Dispatcher
  // ============================================
  score(
    type: string,
    responses: Record<string, any>,
  ): { score: number | null; triage: TriageLevel } {
    switch (type) {
      case 'PHQ9':
        return this.scorePhq9(responses as unknown as Phq9Responses);
      case 'GAD7':
        return this.scoreGad7(responses as unknown as Gad7Responses);
      case 'HYPERTENSION':
        return this.scoreHypertension(responses as unknown as HypertensionResponses);
      case 'DIABETES':
        return this.scoreDiabetes(responses as unknown as DiabetesResponses);
      default:
        return { score: null, triage: TriageLevel.GREEN };
    }
  }
}