/**
 * Block Utility Functions
 * 
 * Helper functions for common block operations and transformations.
 */

import { Block, BlockType } from '@/types';

/**
 * Determines the next block type based on current type and content
 * Used for smart block creation when pressing Enter
 */
export function getNextBlockType(currentType: BlockType): BlockType {
  // After heading, create a text block
  if (currentType === 'heading') {
    return 'text';
  }
  // After list, create another list block
  if (currentType === 'list') {
    return 'list';
  }
  // Default to text
  return 'text';
}

/**
 * Checks if a block is empty (no meaningful content)
 */
export function isBlockEmpty(block: Block): boolean {
  return block.content.trim().length === 0;
}

/**
 * Formats block content based on block type
 * Useful for display and validation
 */
export function formatBlockContent(content: string, type: BlockType): string {
  switch (type) {
    case 'list':
      // Ensure list items start with a bullet or number
      return content.trim();
    case 'heading':
      // Headings should be single line
      return content.split('\n')[0].trim();
    case 'text':
    default:
      return content.trim();
  }
}

/**
 * Extracts list items from content
 * Handles both bullet and numbered lists
 */
export function extractListItems(content: string): string[] {
  return content
    .split('\n')
    .map((line) => line.replace(/^[\s]*[-•*]\s*/, '').replace(/^[\s]*\d+\.\s*/, ''))
    .filter((line) => line.trim().length > 0);
}

/**
 * Converts array of items back to list content
 */
export function itemsToListContent(items: string[]): string {
  return items.map((item) => `• ${item}`).join('\n');
}

/**
 * Calculates reading time estimate (in seconds)
 */
export function estimateReadingTime(blocks: Block[]): number {
  const totalWords = blocks.reduce((sum, block) => {
    const words = block.content.split(/\s+/).filter((w) => w.length > 0).length;
    return sum + words;
  }, 0);

  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(totalWords / 200);
  return Math.max(1, minutes);
}

/**
 * Generates a summary from blocks
 */
export function generateSummary(blocks: Block[], maxLength: number = 150): string {
  const textBlocks = blocks.filter((b) => b.type === 'text' || b.type === 'heading');
  const summary = textBlocks
    .map((b) => b.content)
    .join(' ')
    .substring(0, maxLength);

  return summary.length === maxLength ? summary + '...' : summary;
}

/**
 * Exports blocks to markdown format
 */
export function exportToMarkdown(blocks: Block[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'heading':
          return `# ${block.content}`;
        case 'list':
          return block.content
            .split('\n')
            .map((line) => `- ${line.replace(/^[\s]*[-•*]\s*/, '')}`)
            .join('\n');
        case 'text':
        default:
          return block.content;
      }
    })
    .join('\n\n');
}

/**
 * Exports blocks to plain text format
 */
export function exportToPlainText(blocks: Block[]): string {
  return blocks.map((block) => block.content).join('\n\n');
}
