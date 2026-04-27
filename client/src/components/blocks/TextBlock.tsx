/**
 * TextBlock Component
 * 
 * Renders a text block with inline editing capabilities.
 * Supports rich text input with real-time updates.
 */

import React, { memo, useRef, useEffect } from 'react';
import { Block } from '@/types';
import { useEditor } from '@/hooks/useEditor';

interface TextBlockProps {
  block: Block;
}

function TextBlockComponent({ block }: TextBlockProps) {
  const { updateBlock, addBlock } = useEditor();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus when block is created
    if (block.content === '' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [block.id, block.content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateBlock(block.id, e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to create new block
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock('text', block.id);
    }

    // Backspace to delete empty block
    if (e.key === 'Backspace' && block.content === '' && inputRef.current?.selectionStart === 0) {
      e.preventDefault();
      // Don't delete if it's the only block
    }
  };

  return (
    <textarea
      ref={inputRef}
      value={block.content}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Type something..."
      className="w-full bg-transparent text-base text-foreground placeholder-muted-foreground outline-none resize-none"
      rows={1}
      style={{ minHeight: '1.5rem' }}
    />
  );
}

export default memo(TextBlockComponent);
