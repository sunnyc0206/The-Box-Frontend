// Redux DevTools configuration
// This file can be used to configure Redux DevTools extensions

export const devToolsConfig = {
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
  
  // Configure serialization for complex data types
  serializableCheck: {
    ignoredActions: [
      'persist/PERSIST',
      'persist/REHYDRATE',
      'persist/PAUSE',
      'persist/PURGE',
      'persist/REGISTER',
    ],
    ignoredPaths: ['_persist'],
  },
  
  // Configure immutable check
  immutableCheck: {
    ignoredPaths: ['_persist'],
  },
};

// Helper function to log Redux actions in development
export const logAction = (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Redux Action:', action);
  }
};

// Helper function to log state changes
export const logStateChange = (prevState, nextState, action) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`Redux State Change: ${action.type}`);
    console.log('Previous State:', prevState);
    console.log('Action:', action);
    console.log('Next State:', nextState);
    console.groupEnd();
  }
};
