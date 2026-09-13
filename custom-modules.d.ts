// Module declarations for untyped JS/JSX components and UI primitives
declare module "@/components/*" {
  const whatever: any;
  export default whatever;
}

declare module "@/components/ui/*" {
  const whatever: any;
  export default whatever;
  export const Button: any;
  export const Input: any;
  export const Label: any;
  export const Toaster: any;
  export const toast: any;
}

declare module "@/api/firebaseClient" {
  export const base44: any;
  export const authClient: any;
  export const entities: any;
  const defaultExport: any;
  export default defaultExport;
}

// allow importing non-typed packages
declare module "*.svg" {
  const content: any;
  export default content;
}
