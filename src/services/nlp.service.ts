// src/services/nlp.service.ts

import nlp from 'compromise';

// We need to tell TypeScript about the extra plugins we might use.
// This is an advanced step, but good practice.
import dates from 'compromise-dates';
// We apply the plugin to our nlp object one time.
const nlpEx = nlp.extend(dates);


export interface NlpEntity {
  text: string;
  type: string;
}

class NlpService {
  constructor() {
    console.log("NLP Service (Compromise) initialized with plugins.");
  }

  extractEntities(text: string): NlpEntity[] {
    const doc = nlpEx(text);
    
    const people = doc.people().out('array').map(p => ({ text: p, type: 'Person' }));
    const places = doc.places().out('array').map(p => ({ text: p, type: 'Place' }));
    const organizations = doc.organizations().out('array').map(org => ({ text: org, type: 'Organization' }));
    
    const allEntities = [...people, ...places, ...organizations];
    const uniqueEntities = allEntities.filter((v, i, a) => a.findIndex(t => (t.text === v.text)) === i);

    return uniqueEntities;
  }

  // A new method to find dates within a string of text
  findDates(text: string): any[] { // 'any' because the compromise-dates object is complex
    const doc = nlpEx(text);
    // The .dates() method is now available because of the plugin.
    return doc.dates().json(); 
  }
}

export const nlpService = new NlpService();