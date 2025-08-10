import {
  ModalContent
} from "../../../../chunk-EIYZKF2C.mjs";
import {
  Button_default,
  Container_default,
  Modal_default
} from "../../../../chunk-FNXFUNA7.mjs";
import {
  web_default
} from "../../../../chunk-VAYOSMXI.mjs";
import {
  assert,
  require_react
} from "../../../../chunk-BXV27S2S.mjs";
import {
  __toESM,
  init_buffer,
  init_dirname,
  init_process
} from "../../../../chunk-LU364HVS.mjs";

// src/components/pure/AppFrame.test/index.tsx
init_dirname();
init_buffer();
init_process();
var import_react5 = __toESM(require_react(), 1);

// src/components/pure/AppFrame.test/implementation.tsx
init_dirname();
init_buffer();
init_process();
var import_react = __toESM(require_react(), 1);
var implementation = {
  suites: {
    Default: "AppFrame basic rendering",
    Layout: "AppFrame layout structure"
  },
  givens: {
    Default: () => (selection) => ({
      ...selection,
      children: /* @__PURE__ */ import_react.default.createElement("div", null, "Test Content")
    }),
    WithChildren: (children) => () => (selection) => ({
      ...selection,
      children
    })
  },
  whens: {},
  thens: {
    takeScreenshot: (name) => async ({ htmlElement, container }, pm) => {
      if (!container)
        throw new Error("Container not found");
      const p = await pm.page();
      await pm.customScreenShot({ path: `${name}.png` }, p);
      return {
        htmlElement,
        reactElement: import_react.default.createElement("div"),
        domRoot: container,
        container
      };
    },
    RendersContainer: () => async ({ htmlElement, container }) => {
      assert.exists(container, "Should have min-vh-100 container");
      return {
        htmlElement,
        reactElement: import_react.default.createElement("div"),
        domRoot: container,
        container
      };
    },
    HasMainContent: () => async ({ htmlElement }) => {
      const main = htmlElement.querySelector("main.flex-grow-1");
      assert.exists(main, "Should have main content area");
      return { htmlElement };
    },
    HasFooter: () => async ({ htmlElement }) => {
      const footer = htmlElement.querySelector("footer");
      assert.exists(footer, "Should have footer");
      return { htmlElement };
    },
    HasSettingsButton: () => async ({ htmlElement }) => {
      const button = htmlElement.querySelector("footer button");
      assert.exists(button, "Should have settings button in footer");
      return { htmlElement };
    },
    HasTesterantoLink: () => async ({ htmlElement }) => {
      const link = htmlElement.querySelector('footer a[href*="testeranto"]');
      assert.exists(link, "Should have testeranto link in footer");
      return { htmlElement };
    }
  }
};

// src/components/pure/AppFrame.test/specification.ts
init_dirname();
init_buffer();
init_process();
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.Default("AppFrame basic rendering", {
      "renders container": Given.Default([], [], [Then.RendersContainer()]),
      "has main content area": Given.Default([], [], [Then.HasMainContent()]),
      has_footer: Given.Default(
        [],
        [],
        [Then.HasFooter(), Then.takeScreenshot("hello.png")]
      )
    })
    // Suite.Layout("AppFrame layout structure", {
    //   "contains settings button": Given.Default(
    //     [],
    //     [],
    //     [Then.HasSettingsButton()]
    //   ),
    //   "contains testeranto link": Given.Default(
    //     [],
    //     [],
    //     [Then.HasTesterantoLink(), Then.takeScreenshot("hello.png")]
    //   ),
    // }),
  ];
};

// src/components/pure/AppFrame.tsx
init_dirname();
init_buffer();
init_process();
var import_react4 = __toESM(require_react(), 1);

// src/components/pure/SettingsButton.tsx
init_dirname();
init_buffer();
init_process();
var import_react3 = __toESM(require_react(), 1);

// src/components/SunriseAnimation.tsx
init_dirname();
init_buffer();
init_process();
var import_react2 = __toESM(require_react(), 1);
var SunriseAnimation = ({ active }) => {
  const [position, setPosition] = (0, import_react2.useState)(0);
  const [dimensions, setDimensions] = (0, import_react2.useState)({ width: 0, height: 0 });
  const animationIdRef = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const ANIMATION_DURATION = 1e4;
  const UPDATE_INTERVAL = 50;
  (0, import_react2.useEffect)(() => {
    if (!active) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }
    console.log("Starting animation with duration:", ANIMATION_DURATION, "ms");
    let startTime = performance.now();
    let lastUpdateTime = 0;
    const animate = (timestamp) => {
      if (!active)
        return;
      const elapsed = (timestamp - startTime) % ANIMATION_DURATION;
      const progress = elapsed / ANIMATION_DURATION;
      if (timestamp - lastUpdateTime >= UPDATE_INTERVAL) {
        const newPos = Math.cos(progress * Math.PI * 2);
        setPosition(newPos);
        lastUpdateTime = timestamp;
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animationIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [active]);
  const yPos = dimensions.height * (1 - position);
  const normalizedPos = (position + 1) / 2;
  if (!active)
    return null;
  return /* @__PURE__ */ import_react2.default.createElement("div", { id: "sunrise", style: {
    width: "100vw",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "transparent",
    overflow: "hidden",
    pointerEvents: "none"
  } }, /* @__PURE__ */ import_react2.default.createElement("div", { id: "daily-bg", style: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: -1001
  } }), "Stars Container", /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "starsContainer",
      style: {
        perspective: 350,
        perspectiveOrigin: "50% 300%",
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: "-50%",
        width: "200%",
        height: "50%",
        zIndex: -1e3,
        opacity: Math.max(0, 0.5 - normalizedPos * 0.5)
      }
    },
    /* @__PURE__ */ import_react2.default.createElement(
      "div",
      {
        id: "stars",
        style: {
          backgroundRepeat: "repeat",
          position: "absolute",
          width: "200%",
          height: "200%",
          left: "-50%",
          bottom: 0,
          opacity: 0.5,
          transform: "rotateX(-90deg)"
        }
      }
    )
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "sun",
      style: {
        position: "absolute",
        top: 0,
        left: "50%",
        transform: `translateX(-50%) translateY(${yPos}px)`,
        width: "100%",
        height: "50%",
        background: `radial-gradient(50% ${yPos}px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%,rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)`,
        zIndex: -900,
        opacity: 0.5
      }
    }
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "sunDay",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "50%",
        background: `radial-gradient(50% ${yPos}px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%,rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)`,
        zIndex: -800,
        opacity: Math.max(0, 1 - yPos / dimensions.height)
      }
    }
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "sunSet",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "50%",
        background: `radial-gradient(50% ${yPos}px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%,rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)`,
        zIndex: -800,
        opacity: Math.max(0, yPos / dimensions.height - 0.2)
      }
    }
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "sky",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "50%",
        zIndex: -700,
        background: "linear-gradient(to top, rgba(249,251,240,1) 10%,rgba(215,253,254,1) 20%,rgba(167,222,253,1) 40%,rgba(110,175,255,1) 100%)",
        opacity: Math.max(0, 1 - yPos / dimensions.height)
      }
    }
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "horizon",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "50%",
        background: "linear-gradient(to top, rgba(212,87,43,0.9) 0%,rgba(246,149,52,0.8) 20%,rgba(24,75,106,0) 100%)",
        zIndex: -700,
        opacity: Math.max(0, yPos > dimensions.height / 2 ? (dimensions.height - yPos) / (dimensions.height / 2) + 0.2 : yPos / (dimensions.height / 2))
      }
    }
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "horizonNight",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "50%",
        background: "linear-gradient(to top, rgba(57,167,255,1) 0%,rgba(13,98,245,1) 20%,rgba(0,11,22,0.1) 60%)",
        zIndex: -600,
        opacity: Math.max(0, (yPos - dimensions.height * 4 / 5) / (dimensions.height - dimensions.height * 4 / 5))
      }
    }
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "moon",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "50%",
        background: "radial-gradient(40% 55%, circle, rgba(249,249,250,1) -1%,rgba(189,255,254,1) 1%,rgba(8,49,78,1) 1%,rgba(8,26,56,1) 10%,rgba(4,16,46,1) 40%,rgba(2,8,13,1) 70%)",
        zIndex: -500,
        opacity: Math.max(0, (yPos - dimensions.height * 9 / 10) / (dimensions.height - dimensions.height * 9 / 10))
      }
    }
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "water",
      style: {
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50%",
        background: "linear-gradient(to top, rgba(0,25,45,1) 0%,rgba(14,71,117,1) 35%,rgba(26,126,174,1) 70%,rgba(62,168,220,1) 100%)",
        zIndex: -400
      }
    }
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "waterReflectionContainer",
      style: {
        perspective: 30,
        perspectiveOrigin: `50% ${-15 + normalizedPos * 30}%`,
        overflow: "hidden",
        position: "absolute",
        top: "50%",
        left: "-3%",
        width: "103%",
        height: "50%",
        zIndex: -300,
        transform: `translateY(${dimensions.height - yPos}px)`
      }
    },
    /* @__PURE__ */ import_react2.default.createElement(
      "div",
      {
        id: "waterReflectionMiddle",
        style: {
          position: "absolute",
          top: 0,
          left: "-50%",
          width: "200%",
          height: "55%",
          background: "radial-gradient(50% 0px, rgba(247,177,72,1) 3%,rgba(248,175,65,1) 6%,rgba(207,62,30,0.4) 35%,rgba(176,91,48,0.1) 45%,rgba(141,88,47,0.0) 60%,rgba(116,82,63,0.0) 70%,rgba(44,65,68,0.0) 80%,rgba(7,19,31,0.0) 100%)",
          zIndex: -200,
          opacity: Math.max(0, yPos > dimensions.height / 2 ? (dimensions.height - yPos) / (dimensions.height / 2) - 0.1 : yPos / (dimensions.height / 2) - 0.1),
          transform: "rotateX(45deg)"
        }
      }
    )
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "waterDistance",
      style: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50%",
        background: "linear-gradient(90deg, rgba(0,0,0,0.0) 10%,rgba(0,0,0,0.20) 44%,rgba(0,0,0,0.65) 95%,rgba(0,0,0,0.62) 100%)",
        zIndex: -100,
        opacity: Math.max(0, yPos / dimensions.height + 0.6)
      }
    }
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "darknessOverlaySky",
      style: {
        backgroundColor: "#000",
        opacity: Math.max(0, (yPos - dimensions.height * 7 / 10) / (dimensions.height - dimensions.height * 7 / 10)),
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "50%",
        zIndex: -50
      }
    }
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "darknessOverlay",
      style: {
        backgroundColor: "#000",
        opacity: Math.max(0, (yPos - dimensions.height / 2) / (dimensions.height / 2)),
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50%",
        zIndex: -5
      }
    }
  ), /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      id: "oceanRipple",
      style: {
        backgroundImage: "repeating-linear-gradient(175deg, rgba(165,165,165,0.08) 43%,rgba(175,175,175,0.08) 45%,rgba(235,235,235,0.08) 49%,rgba(195,195,195,0.08) 50%,rgba(165,165,165,0.08) 54%)",
        opacity: 0.5,
        position: "absolute",
        left: "0%",
        bottom: 0,
        width: "100%",
        height: "50%",
        zIndex: -10
      }
    }
  ));
};
var SunriseAnimation_default = SunriseAnimation;

// src/components/pure/SettingsButton.tsx
var SettingsButton = ({ className }) => {
  (0, import_react3.useEffect)(() => {
    return () => {
    };
  }, []);
  const [showModal, setShowModal] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => {
    let themeToApply = theme;
    if (theme === "system") {
      themeToApply = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.setAttribute("data-bs-theme", themeToApply);
  }, []);
  const [theme, setTheme] = (0, import_react3.useState)(localStorage.getItem("theme") || "system");
  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    let themeToApply = newTheme;
    if (newTheme === "system") {
      themeToApply = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.setAttribute("data-bs-theme", themeToApply);
  };
  return /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("div", { id: "settings-button" }, /* @__PURE__ */ import_react3.default.createElement(
    "button",
    {
      className: `btn btn-sm btn-outline-secondary ${className}`,
      onClick: () => setShowModal(true)
    },
    /* @__PURE__ */ import_react3.default.createElement("div", { id: "gear-icon-settings" }, "\u2699\uFE0F")
  )), /* @__PURE__ */ import_react3.default.createElement(SunriseAnimation_default, { active: theme === "daily" }), /* @__PURE__ */ import_react3.default.createElement(Modal_default, { show: showModal, onHide: () => setShowModal(false), size: "lg" }, /* @__PURE__ */ import_react3.default.createElement(ModalContent, { theme, handleThemeChange }), /* @__PURE__ */ import_react3.default.createElement(Modal_default.Footer, { className: "border-0" }, /* @__PURE__ */ import_react3.default.createElement(Button_default, { variant: "btn-primary", onClick: () => setShowModal(false) }, "Done"))));
};

// src/components/pure/AppFrame.tsx
var AppFrame = ({ children }) => {
  return /* @__PURE__ */ import_react4.default.createElement("div", { className: "d-flex flex-column min-vh-100", key: window.location.pathname }, /* @__PURE__ */ import_react4.default.createElement("main", { className: "flex-grow-1 p-3" }, /* @__PURE__ */ import_react4.default.createElement(Container_default, { fluid: true }, children)), /* @__PURE__ */ import_react4.default.createElement("footer", { className: "bg-light py-2 d-flex justify-content-between align-items-center" }, /* @__PURE__ */ import_react4.default.createElement(SettingsButton, null), /* @__PURE__ */ import_react4.default.createElement(Container_default, { className: "text-end", fluid: true }, "made with \u2764\uFE0F and ", /* @__PURE__ */ import_react4.default.createElement("a", { href: "https://www.npmjs.com/package/testeranto" }, "testeranto"))));
};

// src/components/pure/AppFrame.test/index.tsx
var WrappedAppFrame = ({ children }) => /* @__PURE__ */ import_react5.default.createElement("div", { id: "test-root" }, /* @__PURE__ */ import_react5.default.createElement(AppFrame, { "data-testid": "app-frame" }, children));
var AppFrame_default = web_default(
  implementation,
  specification,
  WrappedAppFrame
);
export {
  AppFrame_default as default
};
