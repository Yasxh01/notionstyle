/**
 * Editor Component - Main Container
 * 
 * Design Philosophy:\n * - Manages the overall editor layout and block rendering
 * - Handles drag-and-drop reordering of blocks
 * - Provides toolbar for block type selection
 * - Smooth animations for adding/removing blocks
 */

import React, { useState, useCallback, memo } from 'react';
import { useEditor } from '@/hooks/useEditor';
import { Block as BlockType } from '@/types';
import BlockComponent from './blocks/Block';
import { Button } from '@/components/ui/button';
import { Plus, Type, Heading2, List } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function EditorComponent() {
  const { state, addBlock, reorderBlocks } = useEditor();
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, blockId: string) => {
      setDraggedBlockId(blockId);
      e.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverBlockId(blockId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverBlockId(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetBlockId: string) => {
      e.preventDefault();
      setDragOverBlockId(null);

      if (!draggedBlockId || draggedBlockId === targetBlockId) {
        setDraggedBlockId(null);
        return;
      }

      const draggedIndex = state.blocks.findIndex((b) => b.id === draggedBlockId);
      const targetIndex = state.blocks.findIndex((b) => b.id === targetBlockId);

      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedBlockId(null);
        return;
      }

      // Reorder blocks
      const newBlocks = [...state.blocks];
      const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
      newBlocks.splice(targetIndex, 0, draggedBlock);

      reorderBlocks(newBlocks);
      setDraggedBlockId(null);
    },
    [draggedBlockId, state.blocks, reorderBlocks]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedBlockId(null);
    setDragOverBlockId(null);
  }, []);

  const handleAddBlock = useCallback(
    (type: 'text' | 'heading' | 'list') => {
      addBlock(type);
    },
    [addBlock]
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Blocks Container */}
      <div className="space-y-0">
        {state.blocks.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p>No blocks yet. Click the + button to add one.</p>
          </div>
        ) : (
          state.blocks.map((block: BlockType, index: number) => (
            <div
              key={block.id}
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, block.id)}
              className={`transition-colors duration-150 ${
                dragOverBlockId === block.id ? 'bg-blue-100 dark:bg-blue-900/20' : ''
              }`}
            >
              <BlockComponent
                block={block}
                isSelected={state.selectedBlockId === block.id}
                isDragging={draggedBlockId === block.id}
                onDragStart={(e) => handleDragStart(e, block.id)}
                onDragEnd={handleDragEnd}
              />
            </div>
          ))
        )}
      </div>

      {/* Add Block Button */}
      <div className="mt-4 flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Block
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleAddBlock('text')} className="gap-2 cursor-pointer">
              <Type className="w-4 h-4" />
              <span>Text</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddBlock('heading')} className="gap-2 cursor-pointer">
              <Heading2 className="w-4 h-4" />
              <span>Heading</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddBlock('list')} className="gap-2 cursor-pointer">
              <List className="w-4 h-4" />
              <span>List</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default memo(EditorComponent);
