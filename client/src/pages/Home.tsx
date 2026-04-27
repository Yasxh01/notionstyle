/**
 * Home Page - Main Editor Interface
 * 
 * Design Philosophy:
 * - Minimal, clean interface inspired by Notion
 * - Focus on content with subtle UI elements
 * - Smooth interactions and animations
 * - Responsive design for all screen sizes
 */

import React, { useCallback } from 'react';
import { EditorProvider } from '@/contexts/EditorContext';
import { useEditor } from '@/hooks/useEditor';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import EditorComponent from '@/components/Editor';
import { Button } from '@/components/ui/button';
import { RotateCcw, Download, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { exportToMarkdown, exportToPlainText } from '@/lib/blockUtils';
import '../styles/animations.css';

function HomeContent() {
  const { state, clearAllBlocks, selectBlock } = useEditor();

  const handleSave = useCallback(() => {
    toast.success('Changes saved automatically to localStorage');
  }, []);

  const handleSelectAll = useCallback(() => {
    selectBlock(state.blocks[0]?.id || null);
    toast.info('Select all blocks (feature coming soon)');
  }, [state.blocks, selectBlock]);

  const handleDeselect = useCallback(() => {
    selectBlock(null);
  }, [selectBlock]);

  const handleExportMarkdown = useCallback(() => {
    const markdown = exportToMarkdown(state.blocks);
    downloadFile(markdown, 'editor-content.md', 'text/markdown');
    toast.success('Exported as Markdown');
  }, [state.blocks]);

  const handleExportPlainText = useCallback(() => {
    const plainText = exportToPlainText(state.blocks);
    downloadFile(plainText, 'editor-content.txt', 'text/plain');
    toast.success('Exported as Plain Text');
  }, [state.blocks]);

  const handleClearAll = useCallback(() => {
    clearAllBlocks();
    toast.success('All blocks cleared');
  }, [clearAllBlocks]);

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleSave,
    onSelectAll: handleSelectAll,
    onDeselect: handleDeselect,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Notion Editor</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Block-based editor with drag-and-drop reordering
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-4 text-xs text-muted-foreground">
              <kbd className="px-2 py-1 bg-muted rounded border border-border">⌘S</kbd>
              <span>to save</span>
            </div>

            {/* Export Menu */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportMarkdown}
                className="gap-2"
                title="Export as Markdown"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">MD</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPlainText}
                className="gap-2"
                title="Export as Plain Text"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">TXT</span>
              </Button>

              {/* Clear All Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                    title="Clear all blocks"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all blocks?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All your blocks will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-3 justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>

              {/* Reset Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                className="gap-2"
                title="Reload page"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EditorComponent />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-muted-foreground">
          <p>
            Built with React, Context API, and localStorage. All changes are saved automatically.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <EditorProvider>
      <HomeContent />
    </EditorProvider>
  );
}

/**
 * Helper function to download content as file
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export default Home;
