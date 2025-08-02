// src/services/rule.service.ts

import { Engine } from 'json-rules-engine';
import type { IAegisDocument } from './db.service'; // We'll use our document type

// Example Rule: A document is considered "Overdue for Review" if its
// status is 'Published' and its nextReviewDate is in the past.
const documentReviewRule = {
  conditions: {
    all: [
      {
        fact: 'status',
        operator: 'equal',
        value: 'Published',
      },
      {
        fact: 'nextReviewDate',
        operator: 'lessThan',
        value: new Date().toISOString(), // The engine compares against the current date
      },
    ],
  },
  event: {
    type: 'document-overdue',
    params: {
      message: 'This document is overdue for its scheduled review.',
    },
  },
};

class RuleEngineService {
  private engine: Engine;

  constructor() {
    this.engine = new Engine();
    // Add our first rule to the engine
    this.engine.addRule(documentReviewRule);
    console.log("Rule Engine initialized with document review rule.");
  }

  // A method to check a single document against all loaded rules
  async checkDocument(document: IAegisDocument): Promise<string[]> {
    const facts = {
      ...document,
      // The engine needs dates in a consistent format, ISO string is good
      nextReviewDate: document.nextReviewDate.toISOString(),
    };

    const { events } = await this.engine.run(facts);

    // Return an array of the messages from any rules that were triggered
    return events.map(event => event.params?.message || 'Rule triggered');
  }
}

export const ruleService = new RuleEngineService();