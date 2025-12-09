/**
 * Z-Index Layer System
 * Process 2 - Phase 2: Floating Navigation Architecture
 * 
 * Critical Hierarchy - Each component must respect this hierarchy
 * to prevent overlap issues with floating UI elements.
 * 
 * Usage: import { Z_INDEX } from '../utils/zIndex';
 */

export const Z_INDEX = {
  // Base layers
  mapBase: 0,
  mapMarkers: 10,
  
  // Floating UI components
  floatingControls: 20,   // Zoom, GPS buttons
  floatingHeader: 30,     // User pill header
  sidebar: 40,            // Sidebar backdrop
  sidebarPanel: 41,       // Sidebar panel (above backdrop)
  commandDock: 50,        // Driver command bar
  
  // Overlay layers
  modals: 60,             // Modal dialogs
  alerts: 70,             // Toast notifications, alerts
  tooltips: 80,           // Tooltips
};

export default Z_INDEX;
