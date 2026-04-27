/**
 * Block Types and Interfaces
 * Defines the data structure for all block types in the editor
 */

export type BlockType = 'text' | 'heading' | 'list';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  lastModified: number;
}

export interface TextBlock extends Block {
  type: 'text';
}

export interface HeadingBlock extends Block {
  type: 'heading';
}

export interface ListBlock extends Block {
  type: 'list';
}
