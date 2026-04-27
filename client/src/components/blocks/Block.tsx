/**
 * Block Component - Base Block Wrapper
 * 
 * Design Philosophy:
 * - Memoized to prevent unnecessary re-renders
 * - Handles block selection, deletion, and type-specific rendering
 * - Provides drag handle for reordering
 * - Clean, minimal UI following Notion's design language
 */

import React, { memo } from 'react';
import { Block as BlockType } from '@/types';
import { useEditor } from '@/hooks/useEditor';
import TextBlock from './TextBlock';
import HeadingBlock from './HeadingBlock';
import ListBlock from './ListBlock';
import { GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockProps {
  block: BlockType;
  isSelected: boolean;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

function BlockComponent({
  block,
  isSelected,
  isDragging,
  onDragStart,
  onDragEnd,
}: BlockProps) {
  const { deleteBlock, selectBlock } = useEditor();

  const handleDelete = () => {
    deleteBlock(block.id);
  };

  const handleSelect = () => {
    selectBlock(block.id);
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'heading':
        return <HeadingBlock block={block} />;
      case 'list':
        return <ListBlock block={block} />;
      case 'text':
      default:
        return <TextBlock block={block} />;
    }
  };

  return (
    <div
      className={cn(
        'group relative flex items-start gap-2 px-2 py-1 transition-colors duration-150',
        isSelected && 'bg-blue-50 dark:bg-blue-950/20',
        isDragging && 'opacity-50'
      )}
      onClick={handleSelect}
      onFocus={handleSelect}
    >
      {/* Drag Handle */}
      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Block Content */}
      <div className="flex-1 min-w-0">
        {renderBlockContent()}
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0 p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
        aria-label="Delete block"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default memo(BlockComponent);
