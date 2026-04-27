/**
 * ListBlock Component
 * 
 * Renders a list block with bullet points.
 * Supports multi-line list items with automatic formatting.
 */

import React, { memo, useRef, useEffect } from 'react';
import { Block } from '@/types';
import { useEditor } from '@/hooks/useEditor';

interface ListBlockProps {
  block: Block;
}

function ListBlockComponent({ block }: ListBlockProps) {
  const { updateBlock, addBlock } = useEditor();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus when block is created
    if (block.content === '' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [block.id, block.content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let content = e.target.value;

    // Automatically add bullet points to new lines
    const lines = content.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Skip empty lines
      if (line.trim() === '') return '';
      // Remove existing bullets
      const cleanLine = line.replace(/^[\s]*[-•*]\s*/, '');
      // Add bullet if not present
      if (cleanLine && !line.trim().startsWith('•')) {
        return `• ${cleanLine}`;
      }
      return line;
    });

    content = formattedLines.join('\n');
    updateBlock(block.id, content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to create new list item
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const textarea = inputRef.current;
      if (textarea) {
        const cursorPos = textarea.selectionStart;
        const beforeCursor = block.content.substring(0, cursorPos);
        const afterCursor = block.content.substring(cursorPos);

        // Check if we're at the end of a line
        const lastNewlineIndex = beforeCursor.lastIndexOf('\n');
        const currentLine = beforeCursor.substring(lastNewlineIndex + 1);

        // If current line is empty, create a new block instead
        if (currentLine.replace(/^[\s]*[-•*]\s*/, '').trim() === '') {
          addBlock('list', block.id);
        } else {
          // Add new list item
          const newContent = beforeCursor + '\n• ' + afterCursor;
          updateBlock(block.id, newContent);
        }
      }
    }
  };

  return (
    <textarea
      ref={inputRef}
      value={block.content}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="• List item..."
      className="w-full bg-transparent text-base text-foreground placeholder-muted-foreground outline-none resize-none"
      rows={1}
      style={{ minHeight: '1.5rem' }}
    />
  );
}

export default memo(ListBlockComponent);
