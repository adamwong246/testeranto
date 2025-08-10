import {
  Modal_default
} from "./chunk-FNXFUNA7.mjs";
import {
  require_react
} from "./chunk-BXV27S2S.mjs";
import {
  __toESM,
  init_buffer,
  init_dirname,
  init_process
} from "./chunk-LU364HVS.mjs";

// src/components/pure/ModalContent.tsx
init_dirname();
init_buffer();
init_process();
var import_react2 = __toESM(require_react(), 1);

// src/components/pure/ThemeCard.tsx
init_dirname();
init_buffer();
init_process();
var import_react = __toESM(require_react(), 1);
var ThemeCard = ({
  theme,
  handleThemeChange,
  value,
  title,
  description,
  style
}) => /* @__PURE__ */ import_react.default.createElement("div", { className: "col-md-4" }, /* @__PURE__ */ import_react.default.createElement(
  "div",
  {
    className: `card theme-card ${theme === value ? "border-primary" : ""}`,
    onClick: () => handleThemeChange({
      target: { value }
    }),
    style
  },
  /* @__PURE__ */ import_react.default.createElement("div", { className: "card-body text-center p-3" }, /* @__PURE__ */ import_react.default.createElement("h5", { className: "card-title mb-1" }, title), /* @__PURE__ */ import_react.default.createElement("p", { className: "small text-muted mb-0" }, description))
));

// src/components/pure/ModalContent.tsx
var ModalContent = ({
  theme,
  handleThemeChange
}) => /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement(Modal_default.Header, { closeButton: true, className: "border-0" }, /* @__PURE__ */ import_react2.default.createElement(Modal_default.Title, { className: "d-flex align-items-center" }, /* @__PURE__ */ import_react2.default.createElement("i", { className: "bi bi-palette-fill me-2" }), /* @__PURE__ */ import_react2.default.createElement("span", null, "Settings"))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "alert alert-warning mx-3 mt-2 mb-0" }, /* @__PURE__ */ import_react2.default.createElement("i", { className: "bi bi-exclamation-triangle-fill me-2" }), /* @__PURE__ */ import_react2.default.createElement("strong", null, "Warning:"), ' Themes are an experimental feature. Only "Business casual" is fully supported at this time.'), /* @__PURE__ */ import_react2.default.createElement(Modal_default.Body, { className: "p-0" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "p-3" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "row g-3" }, /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "system",
    title: "9 to 5",
    description: "Follows your OS theme",
    style: {
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      borderColor: "#adb5bd"
    }
  }
), /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "light",
    title: "Business casual",
    description: "Clean & professional",
    style: {
      background: "linear-gradient(135deg, #ffffff 0%, #f1f3f5 100%)",
      borderColor: "#ced4da",
      color: "#212529",
      borderWidth: "2px"
    }
  }
), /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "dark",
    title: "Business formal",
    description: "Premium & focused",
    style: {
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      borderColor: "#4ecdc4",
      color: "#f8f9fa",
      borderWidth: "2px"
    }
  }
), /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "light-vibrant",
    title: "Office Party",
    description: "Colorful & fun",
    style: {
      background: "linear-gradient(135deg, #ff2d75 0%, #00e5ff 100%)",
      borderColor: "#ffeb3b",
      color: "#fff"
    }
  }
), /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "dark-vibrant",
    title: "After Party",
    description: "Neon nightlife",
    style: {
      background: "linear-gradient(135deg, #16213e 0%, #e94560 100%)",
      borderColor: "#00e5ff",
      color: "#fff"
    }
  }
), /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "sepia",
    title: "WFH",
    description: "Vintage warmth",
    style: {
      background: "linear-gradient(135deg, #f4ecd8 0%, #d0b88f 100%)",
      borderColor: "#8b6b4a",
      color: "#3a3226"
    }
  }
), /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "light-grayscale",
    title: "Serious Business",
    description: "Simple & distraction-free",
    style: {
      background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
      borderColor: "#666",
      color: "#333",
      borderWidth: "2px"
    }
  }
), /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "dark-grayscale",
    title: "Very Serious business",
    description: "Maximum readability",
    style: {
      background: "linear-gradient(135deg, #111 0%, #333 100%)",
      borderColor: "#ff6b6b",
      color: "#e0e0e0",
      borderWidth: "2px"
    }
  }
), /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "daily",
    title: "Dreaming of PTO",
    description: "Sunrise, sunset",
    style: {
      background: "linear-gradient(135deg, #6eafff 0%, #f9fbf0 100%)",
      borderColor: "#f7d62e",
      color: "#00192d"
    }
  }
), /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "protanopia",
    title: "Protanopia",
    description: "Red-blind mode",
    style: {
      background: "linear-gradient(135deg, #f8f9fa 0%, #e0e8ff 100%)",
      borderColor: "#3366cc",
      color: "#333"
    }
  }
), /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "deuteranopia",
    title: "Deuteranopia",
    description: "Green-blind mode",
    style: {
      background: "linear-gradient(135deg, #f8f9fa 0%, #ffe0e0 100%)",
      borderColor: "#cc6633",
      color: "#333"
    }
  }
), /* @__PURE__ */ import_react2.default.createElement(
  ThemeCard,
  {
    theme,
    handleThemeChange,
    value: "tritanopia",
    title: "Tritanopia",
    description: "Blue-blind mode",
    style: {
      background: "linear-gradient(135deg, #f8f9fa 0%, #e0ffe0 100%)",
      borderColor: "#00aa66",
      color: "#333"
    }
  }
)))));

export {
  ModalContent
};
