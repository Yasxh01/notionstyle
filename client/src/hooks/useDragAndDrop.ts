/**
 * useDragAndDrop Hook
 * 
 * Manages drag-and-drop state and logic for block reordering.
 * Provides smooth animations and visual feedback during dragging.
 * 
 * Usage:
 * const { draggedId, dragOverId, handleDragStart, handleDragOver, ... } = useDragAndDrop();
 */

import { useState, useCallback } from 'react';

interface DragAndDropState {
  draggedId: string | null;
  dragOverId: string | null;
  isDragging: boolean;
}

export function useDragAndDrop() {
  const [state, setState] = useState<DragAndDropState>({
    draggedId: null,
    dragOverId: null,
    isDragging: false,
  });

  const handleDragStart = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      draggedId: id,
      isDragging: true,
    }));
  }, []);

  const handleDragOver = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      dragOverId: id,
    }));
  }, []);

  const handleDragLeave = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dragOverId: null,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setState({
      draggedId: null,
      dragOverId: null,
      isDragging: false,
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      draggedId: null,
      dragOverId: null,
      isDragging: false,
    });
  }, []);

  return {
    draggedId: state.draggedId,
    dragOverId: state.dragOverId,
    isDragging: state.isDragging,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    reset,
  };
}
