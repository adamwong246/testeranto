import blessed from "blessed";

/**
 * Factory for creating blessed elements with consistent styling
 */
export class BlessedElementFactory {
  /**
   * Create a screen with consistent configuration
   */
  static createScreen(title: string = "Testeranto TUI", theme: "light" | "dark" = "dark"): blessed.Widgets.Screen {
    return blessed.screen({
      smartCSR: true,
      title,
      cursor: {
        artificial: true,
        shape: "line",
        blink: true,
      },
      mouse: false, // Disable mouse
      sendFocus: true,
      mouseMotion: false, // Disable mouse motion
      fullUnicode: true,
      ignoreLocked: ["C-c"],
    });
  }

  /**
   * Create a layout container
   */
  static createLayout(parent: blessed.Widgets.Node): blessed.Widgets.LayoutElement {
    return blessed.layout({
      parent,
      width: "100%",
      height: "100%",
      layout: "inline",
    });
  }

  /**
   * Create a sidebar box
   */
  static createSidebar(parent: blessed.Widgets.Node, theme: "light" | "dark" = "dark", widthPercent: number = 20): blessed.Widgets.BoxElement {
    return blessed.box({
      parent,
      width: `${widthPercent}%`,
      height: "100%",
      mouse: false, // Disable mouse
      clickable: false,
      border: { type: 'line' },
      style: {
        border: { fg: 'gray' },
      },
    });
  }

  /**
   * Create a tree list for the sidebar
   */
  static createTreeList(parent: blessed.Widgets.Node, theme: "light" | "dark" = "dark"): blessed.Widgets.ListElement {
    return blessed.list({
      parent,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      keys: true,
      vi: true,
      mouse: false, // Disable mouse
      clickable: false, // Make tabs not clickable
      focusable: true, // Allow focus
      border: { type: "line" },
      style: {
        selected: { bg: "blue", fg: "white" },
        item: { fg: "white" },
        border: { fg: theme === "dark" ? "white" : "black" },
      },
      items: [
        "▶ testeranto",
        "  └─▶ allTests",
        "      ├─▶ docker-compose",
        "      ├─▶ node",
        "      │   ├─▶ build",
        "      │   └─▶ Calculator",
        "      │       ├─▶ test process",
        "      │       └─▶ aider process",
        "      ├─▶ web",
        "      │   ├─▶ build",
        "      │   └─▶ Calculator",
        "      │       ├─▶ test process",
        "      │       └─▶ aider process",
        "      ├─▶ python",
        "      │   ├─▶ build",
        "      │   └─▶ Calculator",
        "      │       ├─▶ test process",
        "      │       └─▶ aider process",
        "      └─▶ golang",
        "          ├─▶ build",
        "          └─▶ Calculator",
        "              ├─▶ test process",
        "              └─▶ aider process",
      ],
    });
  }

  /**
   * Create a content area box
   */
  static createContentArea(parent: blessed.Widgets.Node, sidebarWidthPercent: number = 20): blessed.Widgets.BoxElement {
    return blessed.box({
      parent,
      left: `${sidebarWidthPercent}%`,
      width: `${100 - sidebarWidthPercent}%`,
      height: "100%",
      style: {},
    });
  }

  /**
   * Create a status line
   */
  static createStatusLine(parent: blessed.Widgets.Node, content: string, theme: "light" | "dark" = "dark"): blessed.Widgets.BoxElement {
    return blessed.box({
      parent,
      top: 0,
      left: 0,
      width: "100%",
      height: 1,
      content,
      style: {
        fg: "white",
        bg: "blue",
      },
    });
  }

  /**
   * Create a log output box
   */
  static createLogBox(
    parent: blessed.Widgets.Node,
    options: {
      top?: number | string;
      left?: number | string;
      width?: number | string;
      height?: number | string;
      label?: string;
      hidden?: boolean;
      theme?: "light" | "dark";
    } = {}
  ): blessed.Widgets.Log {
    const {
      top = 1,
      left = 0,
      width = "100%",
      height = "70%-1",
      label,
      hidden = false,
      theme = "dark",
    } = options;

    return blessed.log({
      parent,
      top,
      left,
      width,
      height,
      keys: true,
      vi: true,
      mouse: false, // Disable mouse
      clickable: false,
      focusable: true,
      scrollable: true,
      alwaysScroll: true,
      hoverText: false,
      scrollbar: {
        ch: " ",
        track: {
          bg: "cyan",
        },
        style: {
          inverse: true,
        },
      },
      style: {
        fg: "white",
        bg: "black",
        focus: {
          border: { fg: "yellow" },
        },
      },
      border: { type: "line" },
      hidden,
    });
  }

  /**
   * Create a text input box
   */
  static createTextInput(
    parent: blessed.Widgets.Node,
    theme: "light" | "dark" = "dark"
  ): blessed.Widgets.TextboxElement {
    return blessed.textbox({
      parent,
      top: "70%",
      left: 0,
      width: "100%",
      height: "30%",
      label: " Command Input (Ctrl+C to exit, ↑/↓ for history) ",
      keys: true,
      vi: true,
      mouse: false, // Disable mouse
      inputOnFocus: true,
      border: { type: "line" },
      style: {
        fg: "white",
        bg: "black",
        border: { fg: theme === "dark" ? "white" : "black" },
        focus: { border: { fg: "blue" } },
      },
    });
  }

  /**
   * Create a box for selection highlighting
   */
  static createSelectionBox(
    parent: blessed.Widgets.Node,
    top: number,
    left: number,
    width: number,
    height: number
  ): blessed.Widgets.BoxElement {
    return blessed.box({
      parent,
      top,
      left,
      width,
      height,
      style: {
        bg: "blue",
        fg: "white",
        transparent: true,
      },
    });
  }
}
