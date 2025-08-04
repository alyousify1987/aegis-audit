declare module '@mui/icons-material/*';

// Patch for MUI Grid type errors in v7.2.0
// This allows 'item' and 'container' props on Grid for TypeScript
import type { GridProps } from '@mui/material/Grid';
declare module '@mui/material/Grid' {
  interface GridProps {
    item?: boolean;
    container?: boolean;
    xs?: number | 'auto' | boolean;
    sm?: number | 'auto' | boolean;
    md?: number | 'auto' | boolean;
    lg?: number | 'auto' | boolean;
    xl?: number | 'auto' | boolean;
  }
}
