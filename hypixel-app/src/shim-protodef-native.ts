// Try several known export shapes; pick the first that exists.
import * as protodef from 'protodef';

const candidate =
  // some builds expose types
  (protodef as any).types ||
  // some expose native directly
  (protodef as any).native ||
  // some expose via Compiler
  (protodef as any).Compiler?.native ||
  (protodef as any).compiler?.native;

// Attach to global so eval’d code can access `native`
if (candidate && typeof candidate === 'object') {
  (globalThis as any).native = candidate;
} else {
  // last resort: don’t crash, but log for diagnostics
  console.warn('protodef native types not found on protodef export');
}