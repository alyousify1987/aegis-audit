// src/services/event.service.ts

import mitt from 'mitt';

// Define the types of events our application can have.
// This gives us type safety.
type AppEvents = {
  'documents:updated': void; // An event with no data
  'error:global': { message: string; error?: any }; // An event with data
};

// Create and export a single instance of the event bus.
export const eventBus = mitt<AppEvents>();