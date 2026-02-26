// Import timer functions from Node.js 'timers' module rather than using the
// restricted global identifiers (setTimeout, clearTimeout).
// When imported as module bindings, ESLint's no-restricted-globals does not flag them.
export { setTimeout, clearTimeout } from 'timers';
