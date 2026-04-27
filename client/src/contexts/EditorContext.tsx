/**
 * EditorContext - Global State Management for Block Editor
 * 
 * Design Philosophy:
 * - Centralized state management using Context API
 * - Immutable state updates for predictable behavior
 * - Automatic localStorage persistence
 * - Optimized for performance with memoization
 * - Clear separation between state and actions
 */

import React, { createContext, useCallback, useEffect, useReducer, ReactNode } from 'react';
import { Block, EditorState, BlockType } from '@/types';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'notion-editor-state';

interface EditorContextType {
  state: EditorState;
  addBlock: (type: BlockType, afterBlockId?: string) => void;
  updateBlock: (id: string, content: string) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (blocks: Block[]) => void;
  selectBlock: (id: string | null) => void;
  clearAllBlocks: () => void;
}

export const EditorContext = createContext<EditorContextType | undefined>(undefined);

type EditorAction =
  | { type: 'ADD_BLOCK'; payload: { blockType: BlockType; afterBlockId?: string } }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; content: string } }
  | { type: 'DELETE_BLOCK'; payload: { id: string } }
  | { type: 'REORDER_BLOCKS'; payload: { blocks: Block[] } }
  | { type: 'SELECT_BLOCK'; payload: { id: string | null } }
  | { type: 'LOAD_STATE'; payload: EditorState }
  | { type: 'CLEAR_ALL' };

const initialState: EditorState = {
  blocks: [
    {
      id: nanoid(),
      type: 'heading',
      content: 'Welcome to Notion Editor',
      order: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: nanoid(),
      type: 'text',
      content: 'Start typing to edit this block. Press Enter to create a new block.',
      order: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
  selectedBlockId: null,
  lastModified: Date.now(),
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'ADD_BLOCK': {
      const { blockType, afterBlockId } = action.payload;
      const newBlock: Block = {
        id: nanoid(),
        type: blockType,
        content: '',
        order: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      let newBlocks: Block[];
      if (afterBlockId) {
        const afterIndex = state.blocks.findIndex((b: Block) => b.id === afterBlockId);
        if (afterIndex !== -1) {
          newBlocks = [
            ...state.blocks.slice(0, afterIndex + 1),
            newBlock,
            ...state.blocks.slice(afterIndex + 1),
          ];
        } else {
          newBlocks = [...state.blocks, newBlock];
        }
      } else {
        newBlocks = [...state.blocks, newBlock];
      }

      // Recalculate order
      newBlocks = newBlocks.map((block: Block, index: number) => ({
        ...block,
        order: index,
      }));

      return {
        ...state,
        blocks: newBlocks,
        selectedBlockId: newBlock.id,
        lastModified: Date.now(),
      };
    }

    case 'UPDATE_BLOCK': {
      const { id, content } = action.payload;
      return {
        ...state,
        blocks: state.blocks.map((block: Block) =>
          block.id === id
            ? { ...block, content, updatedAt: Date.now() }
            : block
        ),
        lastModified: Date.now(),
      };
    }

    case 'DELETE_BLOCK': {
      const { id } = action.payload;
      const newBlocks = state.blocks.filter((block: Block) => block.id !== id);

      // Recalculate order
      const reorderedBlocks = newBlocks.map((block: Block, index: number) => ({
        ...block,
        order: index,
      }));

      return {
        ...state,
        blocks: reorderedBlocks,
        selectedBlockId: null,
        lastModified: Date.now(),
      };
    }

    case 'REORDER_BLOCKS': {
      const { blocks } = action.payload;
      const reorderedBlocks = blocks.map((block: Block, index: number) => ({
        ...block,
        order: index,
      }));

      return {
        ...state,
        blocks: reorderedBlocks,
        lastModified: Date.now(),
      };
    }

    case 'SELECT_BLOCK': {
      return {
        ...state,
        selectedBlockId: action.payload.id,
      };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    case 'CLEAR_ALL': {
      return {
        ...initialState,
        lastModified: Date.now(),
      };
    }

    default:
      return state;
  }
}

interface EditorProviderProps {
  children: ReactNode;
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState) as EditorState;
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load editor state from localStorage:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addBlock = useCallback(
    (type: BlockType, afterBlockId?: string) => {
      dispatch({ type: 'ADD_BLOCK', payload: { blockType: type, afterBlockId } });
    },
    []
  );

  const updateBlock = useCallback((id: string, content: string) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, content } });
  }, []);

  const deleteBlock = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BLOCK', payload: { id } });
  }, []);

  const reorderBlocks = useCallback((blocks: Block[]) => {
    dispatch({ type: 'REORDER_BLOCKS', payload: { blocks } });
  }, []);

  const selectBlock = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_BLOCK', payload: { id } });
  }, []);

  const clearAllBlocks = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const value: EditorContextType = {
    state,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    selectBlock,
    clearAllBlocks,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}
