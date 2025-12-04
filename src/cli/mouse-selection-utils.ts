import blessed from "blessed";
import { BlessedElementFactory } from "./blessed-element-factory";

/**
 * Utilities for handling mouse selection in TUI
 */
export class MouseSelectionUtils {
  private selectionStart: { x: number; y: number; absY: number } | null = null;
  private selectionEnd: { x: number; y: number; absY: number } | null = null;
  private isSelecting: boolean = false;
  private selectedText: string = "";
  private selectionBox: blessed.Widgets.BoxElement | null = null;
  private screen: blessed.Widgets.Screen | null = null;

  constructor(screen: blessed.Widgets.Screen | null) {
    this.screen = screen;
  }

  /**
   * Set up mouse selection for a log box
   */
  setupMouseSelection(box: blessed.Widgets.Log): void {
    // Mouse down event
    box.on("mousedown", (data: any) => {
      this.isSelecting = true;

      // Store the starting position
      // Use relative coordinates within the box
      // blessed provides x and y relative to the screen
      // We need to convert to box coordinates
      const boxX = data.x - (box.aleft as number);
      const boxY = data.y - (box.atop as number);

      this.selectionStart = {
        x: boxX,
        y: boxY,
        absY: box.getScrollPerc(),
      };
      this.selectionEnd = null;
      this.selectedText = "";

      // Clear any existing selection box
      if (this.selectionBox) {
        this.selectionBox.destroy();
        this.selectionBox = null;
      }

      // Render if we have a screen reference
      if (this.screen) {
        this.screen.render();
      }
    });

    // Mouse move event (dragging)
    box.on("mousemove", (data: any) => {
      if (!this.isSelecting) return;

      const boxX = data.x - (box.aleft as number);
      const boxY = data.y - (box.atop as number);

      this.selectionEnd = {
        x: boxX,
        y: boxY,
        absY: box.getScrollPerc(),
      };

      // Update visual selection
      this.updateSelectionVisual(box);
      if (this.screen) {
        this.screen.render();
      }
    });

    // Mouse up event
    box.on("mouseup", () => {
      if (!this.isSelecting) return;

      this.isSelecting = false;
      this.extractSelectedText(box);
      if (this.screen) {
        this.screen.render();
      }
    });
  }

  /**
   * Update the visual selection box
   */
  private updateSelectionVisual(outputBox: blessed.Widgets.Log): void {
    if (!this.selectionStart || !this.selectionEnd || !this.screen) return;

    // Clear previous selection box
    if (this.selectionBox) {
      this.selectionBox.destroy();
      this.selectionBox = null;
    }

    // Calculate selection area
    const startY = Math.max(
      0,
      Math.min(this.selectionStart.y, this.selectionEnd.y)
    );
    const endY = Math.max(
      0,
      Math.max(this.selectionStart.y, this.selectionEnd.y)
    );
    const startX = Math.max(
      0,
      Math.min(this.selectionStart.x, this.selectionEnd.x)
    );
    const endX = Math.max(
      0,
      Math.max(this.selectionStart.x, this.selectionEnd.x)
    );

    // Make sure we have valid dimensions
    const width = Math.max(1, endX - startX);
    const height = Math.max(1, endY - startY);

    // Create a box to highlight the selected area
    this.selectionBox = BlessedElementFactory.createSelectionBox(
      outputBox,
      startY,
      startX,
      width,
      height
    );

    // Bring the selection box to front
    this.selectionBox.setFront();

    this.screen.render();
  }

  /**
   * Extract the selected text from the box
   */
  private extractSelectedText(outputBox: blessed.Widgets.Log): void {
    if (!this.selectionStart || !this.selectionEnd) return;

    // Get the content lines
    const content = outputBox.getContent();
    const lines = content.split("\n");

    // Calculate selection bounds
    const startY = Math.max(
      0,
      Math.min(this.selectionStart.y, this.selectionEnd.y)
    );
    const endY = Math.max(
      0,
      Math.max(this.selectionStart.y, this.selectionEnd.y)
    );
    const startX = Math.max(
      0,
      Math.min(this.selectionStart.x, this.selectionEnd.x)
    );
    const endX = Math.max(
      0,
      Math.max(this.selectionStart.x, this.selectionEnd.x)
    );

    // Extract text from the selected region
    const selectedLines: string[] = [];
    for (let y = startY; y <= endY && y < lines.length; y++) {
      const line = lines[y];
      if (line === undefined) continue;

      if (y === startY && y === endY) {
        // Single line selection
        const lineStart = Math.min(startX, line.length);
        const lineEnd = Math.min(endX, line.length);
        if (lineStart < lineEnd) {
          selectedLines.push(line.substring(lineStart, lineEnd));
        }
      } else if (y === startY) {
        // First line of multi-line selection
        const lineStart = Math.min(startX, line.length);
        selectedLines.push(line.substring(lineStart));
      } else if (y === endY) {
        // Last line of multi-line selection
        const lineEnd = Math.min(endX, line.length);
        selectedLines.push(line.substring(0, lineEnd));
      } else {
        // Middle line
        selectedLines.push(line);
      }
    }

    this.selectedText = selectedLines.join("\n");

    // Log the selected text (for debugging)
    if (this.selectedText.trim().length > 0) {
      outputBox.add(`\n[Selected ${this.selectedText.length} characters]`);
    }
  }

  /**
   * Get the currently selected text
   */
  getSelectedText(): string {
    return this.selectedText;
  }

  /**
   * Get whether we're currently selecting
   */
  getIsSelecting(): boolean {
    return this.isSelecting;
  }

  /**
   * Get the selection end
   */
  getSelectionEnd(): { x: number; y: number; absY: number } | null {
    return this.selectionEnd;
  }

  /**
   * Clear the current selection
   */
  clearSelection(): void {
    if (this.selectionBox) {
      this.selectionBox.destroy();
      this.selectionBox = null;
    }
    this.selectionStart = null;
    this.selectionEnd = null;
    this.selectedText = "";
    this.isSelecting = false;
  }

  /**
   * Copy selected text to clipboard
   */
  copySelectedTextToClipboard(): string | null {
    if (!this.selectedText) return null;

    // Try to copy to clipboard using various methods
    try {
      const { execSync } = require("child_process");
      const platform = process.platform;

      if (platform === "darwin") {
        // macOS
        execSync(`echo "${this.selectedText.replace(/"/g, '\\"')}" | pbcopy`);
      } else if (platform === "linux") {
        // Linux
        execSync(
          `echo "${this.selectedText.replace(
            /"/g,
            '\\"'
          )}" | xclip -selection clipboard`
        );
      } else if (platform === "win32") {
        // Windows
        execSync(`echo ${this.selectedText} | clip`);
      }

      // Notify user
      return `\n[Copied ${this.selectedText.length} characters to clipboard]`;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return "\n[Failed to copy to clipboard]";
    }
  }
}
