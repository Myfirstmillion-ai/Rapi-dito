import { useState, useCallback, useMemo } from "react";

/**
 * useAlert - Alert State Management Hook
 * Process 2 - Phase 4: Driver HUD, Stats Dashboard & Alert System
 * 
 * CRITICAL WHITE SCREEN PREVENTION:
 * - ALL state updates are safe
 * - Provides type-safe alert methods
 * - Memoized callbacks to prevent unnecessary re-renders
 * 
 * Features:
 * - Multiple alert types (success, error, warning, info, loading)
 * - Confirm/Cancel support
 * - Auto-dismiss support
 * - Promise-based confirmation
 */

// Valid alert types (shared constant)
export const ALERT_TYPES = ['success', 'error', 'failure', 'warning', 'info', 'loading'];

// Validation helpers
const isValidString = (value) => typeof value === 'string';
const isValidNumber = (value) => typeof value === 'number' && !isNaN(value);
const isValidAlertType = (type) => ALERT_TYPES.includes(type);

// Safe string helper
const safeString = (value, fallback = '') => {
  if (isValidString(value)) return value;
  if (value === null || value === undefined) return fallback;
  return String(value) || fallback;
};

// Default alert state
const DEFAULT_ALERT_STATE = {
  isVisible: false,
  heading: '',
  text: '',
  type: 'info',
  confirmText: 'Okay',
  cancelText: '',
  autoDismiss: 0,
  showCloseButton: true,
  isLoading: false,
  onConfirm: null,
  onCancel: null
};

export const useAlert = () => {
  const [alert, setAlert] = useState(DEFAULT_ALERT_STATE);

  /**
   * Show a generic alert
   */
  const showAlert = useCallback((heading, text, type = 'info', options = {}) => {
    setAlert({
      ...DEFAULT_ALERT_STATE,
      isVisible: true,
      heading: safeString(heading, 'Alerta'),
      text: safeString(text),
      type: isValidAlertType(type) ? type : 'info',
      confirmText: safeString(options.confirmText, 'Okay'),
      cancelText: safeString(options.cancelText, ''),
      autoDismiss: isValidNumber(options.autoDismiss) ? options.autoDismiss : 0,
      showCloseButton: options.showCloseButton !== false,
      isLoading: options.isLoading === true,
      onConfirm: typeof options.onConfirm === 'function' ? options.onConfirm : null,
      onCancel: typeof options.onCancel === 'function' ? options.onCancel : null
    });
  }, []);

  /**
   * Hide the current alert
   */
  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isVisible: false }));
  }, []);

  /**
   * Show a success alert
   */
  const showSuccess = useCallback((heading, text, options = {}) => {
    showAlert(heading, text, 'success', {
      autoDismiss: 3000,
      ...options
    });
  }, [showAlert]);

  /**
   * Show an error alert
   */
  const showError = useCallback((heading, text, options = {}) => {
    showAlert(heading, text, 'error', options);
  }, [showAlert]);

  /**
   * Show a warning alert
   */
  const showWarning = useCallback((heading, text, options = {}) => {
    showAlert(heading, text, 'warning', options);
  }, [showAlert]);

  /**
   * Show an info alert
   */
  const showInfo = useCallback((heading, text, options = {}) => {
    showAlert(heading, text, 'info', {
      autoDismiss: 4000,
      ...options
    });
  }, [showAlert]);

  /**
   * Show a loading alert (non-dismissible)
   */
  const showLoading = useCallback((heading = 'Cargando...', text = '') => {
    showAlert(heading, text, 'loading', {
      showCloseButton: false,
      autoDismiss: 0
    });
  }, [showAlert]);

  /**
   * Show a confirmation dialog that returns a Promise
   * @returns Promise<boolean> - true if confirmed, false if cancelled
   */
  const showConfirm = useCallback((heading, text, options = {}) => {
    return new Promise((resolve) => {
      showAlert(heading, text, options.type || 'warning', {
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        showCloseButton: false,
        onConfirm: () => {
          hideAlert();
          resolve(true);
        },
        onCancel: () => {
          hideAlert();
          resolve(false);
        }
      });
    });
  }, [showAlert, hideAlert]);

  /**
   * Update loading state of current alert
   */
  const setLoading = useCallback((isLoading) => {
    setAlert(prev => ({ ...prev, isLoading: isLoading === true }));
  }, []);

  // Memoize return object to prevent unnecessary re-renders
  const alertMethods = useMemo(() => ({
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showConfirm,
    setLoading
  }), [
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showConfirm,
    setLoading
  ]);

  return alertMethods;
};

export default useAlert;