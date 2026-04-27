/**
 * useKeyboardShortcuts Hook
 * 
 * Manages keyboard shortcuts for the editor:
 * - Ctrl/Cmd+S: Save (localStorage is automatic)
 * - Ctrl/Cmd+Z: Undo (future enhancement)
 * - Ctrl/Cmd+Y: Redo (future enhancement)
 * - Ctrl/Cmd+A: Select all blocks
 * - Escape: Deselect
 */

import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsConfig {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSelectAll?: () => void;
  onDeselect?: () => void;
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd+S: Save
      if (modifier && e.key === 's') {
        e.preventDefault();
        config.onSave?.();
      }

      // Ctrl/Cmd+Z: Undo
      if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        config.onUndo?.();
      }

      // Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y: Redo
      if ((modifier && e.shiftKey && e.key === 'z') || (modifier && e.key === 'y')) {
        e.preventDefault();
        config.onRedo?.();
      }

      // Ctrl/Cmd+A: Select all
      if (modifier && e.key === 'a') {
        e.preventDefault();
        config.onSelectAll?.();
      }

      // Escape: Deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        config.onDeselect?.();
      }
    },
    [config]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
