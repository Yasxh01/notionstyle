/**
 * useEditor Hook
 * 
 * Provides access to the global editor context and its actions.
 * Throws an error if used outside of EditorProvider.
 * 
 * Usage:
 * const { state, addBlock, updateBlock, deleteBlock } = useEditor();
 */

import { useContext } from 'react';
import { EditorContext } from '@/contexts/EditorContext';

export function useEditor() {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }

  return context;
}
