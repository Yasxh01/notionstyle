/**
 * HeadingBlock Component
 * 
 * Renders a heading block with larger, bold typography.
 * Supports inline editing with automatic text formatting.
 */

import React, { memo, useRef, useEffect } from 'react';
import { Block } from '@/types';
import { useEditor } from '@/hooks/useEditor';

interface HeadingBlockProps {
  block: Block;
}

function HeadingBlockComponent({ block }: HeadingBlockProps) {
  const { updateBlock, addBlock } = useEditor();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus when block is created
    if (block.content === '' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [block.id, block.content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Remove newlines from heading
    const content = e.target.value.replace(/\n/g, '');
    updateBlock(block.id, content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to create new text block after heading
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock('text', block.id);
    }

    // Prevent newlines in heading
    if (e.key === 'Enter') {
      e.preventDefault();
      addBlock('text', block.id);
    }
  };

  return (
    <textarea
      ref={inputRef}
      value={block.content}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Heading..."
      className="w-full bg-transparent text-2xl font-bold text-foreground placeholder-muted-foreground outline-none resize-none"
      rows={1}
      style={{ minHeight: '2rem' }}
    />
  );
}

export default memo(HeadingBlockComponent);
