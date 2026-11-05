// ==============================================================================
// SSR POLYFILL FOR REACT ISOMORPHIC RENDERING
// Prevents React warning: "useLayoutEffect does nothing on the server"
// during static rendering/SSR in Expo Router & Node.js
// ==============================================================================

import React from 'react';

if (typeof window === 'undefined') {
  // On the server, layout effect cannot measure DOM/native layout.
  // Mapping to useEffect silences the mismatch warning cleanly.
  (React as any).useLayoutEffect = React.useEffect;
}

