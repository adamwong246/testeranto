import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  puppeteer_default,
  require_main
} from "../chunk-F2XSERHJ.mjs";
import "../chunk-SPCDJOVC.mjs";
import "../chunk-U3IOOGZ4.mjs";
import "../chunk-575CR37A.mjs";
import {
  assert
} from "../chunk-NMBJLDFX.mjs";
import {
  Node_default
} from "../chunk-NXHDALJ3.mjs";
import "../chunk-KXYCS7SG.mjs";
import {
  __commonJS,
  __toESM
} from "../chunk-UDP42ARI.mjs";

// node_modules/html/lib/html.js
var require_html = __commonJS({
  "node_modules/html/lib/html.js"(exports, module) {
    function style_html(html_source, options) {
      var multi_parser, indent_size, indent_character, max_char, brace_style, unformatted;
      options = options || {};
      indent_size = options.indent_size || 4;
      indent_character = options.indent_char || " ";
      brace_style = options.brace_style || "collapse";
      max_char = options.max_char == 0 ? Infinity : options.max_char || 70;
      unformatted = options.unformatted || ["a", "span", "bdo", "em", "strong", "dfn", "code", "samp", "kbd", "var", "cite", "abbr", "acronym", "q", "sub", "sup", "tt", "i", "b", "big", "small", "u", "s", "strike", "font", "ins", "del", "pre", "address", "dt", "h1", "h2", "h3", "h4", "h5", "h6"];
      function Parser() {
        this.pos = 0;
        this.token = "";
        this.current_mode = "CONTENT";
        this.tags = {
          //An object to hold tags, their position, and their parent-tags, initiated with default values
          parent: "parent1",
          parentcount: 1,
          parent1: ""
        };
        this.tag_type = "";
        this.token_text = this.last_token = this.last_text = this.token_type = "";
        this.Utils = {
          //Uilities made available to the various functions
          whitespace: "\n\r	 ".split(""),
          single_token: "br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed,?php,?,?=".split(","),
          //all the single tags for HTML
          extra_liners: "head,body,/html".split(","),
          //for tags that need a line of whitespace before them
          in_array: function(what, arr) {
            for (var i = 0; i < arr.length; i++) {
              if (what === arr[i]) {
                return true;
              }
            }
            return false;
          }
        };
        this.get_content = function() {
          var input_char = "", content = [], space = false;
          while (this.input.charAt(this.pos) !== "<") {
            if (this.pos >= this.input.length) {
              return content.length ? content.join("") : ["", "TK_EOF"];
            }
            input_char = this.input.charAt(this.pos);
            this.pos++;
            this.line_char_count++;
            if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
              if (content.length) {
                space = true;
              }
              this.line_char_count--;
              continue;
            } else if (space) {
              if (this.line_char_count >= this.max_char) {
                content.push("\n");
                for (var i = 0; i < this.indent_level; i++) {
                  content.push(this.indent_string);
                }
                this.line_char_count = 0;
              } else {
                content.push(" ");
                this.line_char_count++;
              }
              space = false;
            }
            content.push(input_char);
          }
          return content.length ? content.join("") : "";
        };
        this.get_contents_to = function(name) {
          if (this.pos == this.input.length) {
            return ["", "TK_EOF"];
          }
          var input_char = "";
          var content = "";
          var reg_match = new RegExp("</" + name + "\\s*>", "igm");
          reg_match.lastIndex = this.pos;
          var reg_array = reg_match.exec(this.input);
          var end_script = reg_array ? reg_array.index : this.input.length;
          if (this.pos < end_script) {
            content = this.input.substring(this.pos, end_script);
            this.pos = end_script;
          }
          return content;
        };
        this.record_tag = function(tag) {
          if (this.tags[tag + "count"]) {
            this.tags[tag + "count"]++;
            this.tags[tag + this.tags[tag + "count"]] = this.indent_level;
          } else {
            this.tags[tag + "count"] = 1;
            this.tags[tag + this.tags[tag + "count"]] = this.indent_level;
          }
          this.tags[tag + this.tags[tag + "count"] + "parent"] = this.tags.parent;
          this.tags.parent = tag + this.tags[tag + "count"];
        };
        this.retrieve_tag = function(tag) {
          if (this.tags[tag + "count"]) {
            var temp_parent = this.tags.parent;
            while (temp_parent) {
              if (tag + this.tags[tag + "count"] === temp_parent) {
                break;
              }
              temp_parent = this.tags[temp_parent + "parent"];
            }
            if (temp_parent) {
              this.indent_level = this.tags[tag + this.tags[tag + "count"]];
              this.tags.parent = this.tags[temp_parent + "parent"];
            }
            delete this.tags[tag + this.tags[tag + "count"] + "parent"];
            delete this.tags[tag + this.tags[tag + "count"]];
            if (this.tags[tag + "count"] == 1) {
              delete this.tags[tag + "count"];
            } else {
              this.tags[tag + "count"]--;
            }
          }
        };
        this.get_tag = function() {
          var input_char = "", content = [], space = false, tag_start, tag_end;
          do {
            if (this.pos >= this.input.length) {
              return content.length ? content.join("") : ["", "TK_EOF"];
            }
            input_char = this.input.charAt(this.pos);
            this.pos++;
            this.line_char_count++;
            if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
              space = true;
              this.line_char_count--;
              continue;
            }
            if (input_char === "'" || input_char === '"') {
              if (!content[1] || content[1] !== "!") {
                input_char += this.get_unformatted(input_char);
                space = true;
              }
            }
            if (input_char === "=") {
              space = false;
            }
            if (content.length && content[content.length - 1] !== "=" && input_char !== ">" && space) {
              if (this.line_char_count >= this.max_char) {
                this.print_newline(false, content);
                this.line_char_count = 0;
              } else {
                content.push(" ");
                this.line_char_count++;
              }
              space = false;
            }
            if (input_char === "<") {
              tag_start = this.pos - 1;
            }
            content.push(input_char);
          } while (input_char !== ">");
          var tag_complete = content.join("");
          var tag_index;
          if (tag_complete.indexOf(" ") != -1) {
            tag_index = tag_complete.indexOf(" ");
          } else {
            tag_index = tag_complete.indexOf(">");
          }
          var tag_check2 = tag_complete.substring(1, tag_index).toLowerCase();
          if (tag_complete.charAt(tag_complete.length - 2) === "/" || this.Utils.in_array(tag_check2, this.Utils.single_token)) {
            this.tag_type = "SINGLE";
          } else if (tag_check2 === "script") {
            this.record_tag(tag_check2);
            this.tag_type = "SCRIPT";
          } else if (tag_check2 === "style") {
            this.record_tag(tag_check2);
            this.tag_type = "STYLE";
          } else if (this.Utils.in_array(tag_check2, unformatted)) {
            var comment = this.get_unformatted("</" + tag_check2 + ">", tag_complete);
            content.push(comment);
            if (tag_start > 0 && this.Utils.in_array(this.input.charAt(tag_start - 1), this.Utils.whitespace)) {
              content.splice(0, 0, this.input.charAt(tag_start - 1));
            }
            tag_end = this.pos - 1;
            if (this.Utils.in_array(this.input.charAt(tag_end + 1), this.Utils.whitespace)) {
              content.push(this.input.charAt(tag_end + 1));
            }
            this.tag_type = "SINGLE";
          } else if (tag_check2.charAt(0) === "!") {
            if (tag_check2.indexOf("[if") != -1) {
              if (tag_complete.indexOf("!IE") != -1) {
                var comment = this.get_unformatted("-->", tag_complete);
                content.push(comment);
              }
              this.tag_type = "START";
            } else if (tag_check2.indexOf("[endif") != -1) {
              this.tag_type = "END";
              this.unindent();
            } else if (tag_check2.indexOf("[cdata[") != -1) {
              var comment = this.get_unformatted("]]>", tag_complete);
              content.push(comment);
              this.tag_type = "SINGLE";
            } else {
              var comment = this.get_unformatted("-->", tag_complete);
              content.push(comment);
              this.tag_type = "SINGLE";
            }
          } else {
            if (tag_check2.charAt(0) === "/") {
              this.retrieve_tag(tag_check2.substring(1));
              this.tag_type = "END";
            } else {
              this.record_tag(tag_check2);
              this.tag_type = "START";
            }
            if (this.Utils.in_array(tag_check2, this.Utils.extra_liners)) {
              this.print_newline(true, this.output);
            }
          }
          return content.join("");
        };
        this.get_unformatted = function(delimiter, orig_tag) {
          if (orig_tag && orig_tag.toLowerCase().indexOf(delimiter) != -1) {
            return "";
          }
          var input_char = "";
          var content = "";
          var space = true;
          do {
            if (this.pos >= this.input.length) {
              return content;
            }
            input_char = this.input.charAt(this.pos);
            this.pos++;
            if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
              if (!space) {
                this.line_char_count--;
                continue;
              }
              if (input_char === "\n" || input_char === "\r") {
                content += "\n";
                this.line_char_count = 0;
                continue;
              }
            }
            content += input_char;
            this.line_char_count++;
            space = true;
          } while (content.toLowerCase().indexOf(delimiter) == -1);
          return content;
        };
        this.get_token = function() {
          var token;
          if (this.last_token === "TK_TAG_SCRIPT" || this.last_token === "TK_TAG_STYLE") {
            var type = this.last_token.substr(7);
            token = this.get_contents_to(type);
            if (typeof token !== "string") {
              return token;
            }
            return [token, "TK_" + type];
          }
          if (this.current_mode === "CONTENT") {
            token = this.get_content();
            if (typeof token !== "string") {
              return token;
            } else {
              return [token, "TK_CONTENT"];
            }
          }
          if (this.current_mode === "TAG") {
            token = this.get_tag();
            if (typeof token !== "string") {
              return token;
            } else {
              var tag_name_type = "TK_TAG_" + this.tag_type;
              return [token, tag_name_type];
            }
          }
        };
        this.get_full_indent = function(level) {
          level = this.indent_level + level || 0;
          if (level < 1)
            return "";
          return Array(level + 1).join(this.indent_string);
        };
        this.printer = function(js_source, indent_character2, indent_size2, max_char2, brace_style2) {
          this.input = js_source || "";
          this.output = [];
          this.indent_character = indent_character2;
          this.indent_string = "";
          this.indent_size = indent_size2;
          this.brace_style = brace_style2;
          this.indent_level = 0;
          this.max_char = max_char2;
          this.line_char_count = 0;
          for (var i = 0; i < this.indent_size; i++) {
            this.indent_string += this.indent_character;
          }
          this.print_newline = function(ignore, arr) {
            this.line_char_count = 0;
            if (!arr || !arr.length) {
              return;
            }
            if (!ignore) {
              while (this.Utils.in_array(arr[arr.length - 1], this.Utils.whitespace)) {
                arr.pop();
              }
            }
            arr.push("\n");
            for (var i2 = 0; i2 < this.indent_level; i2++) {
              arr.push(this.indent_string);
            }
          };
          this.print_token = function(text2) {
            this.output.push(text2);
          };
          this.indent = function() {
            this.indent_level++;
          };
          this.unindent = function() {
            if (this.indent_level > 0) {
              this.indent_level--;
            }
          };
        };
        return this;
      }
      multi_parser = new Parser();
      multi_parser.printer(html_source, indent_character, indent_size, max_char, brace_style);
      while (true) {
        var t = multi_parser.get_token();
        multi_parser.token_text = t[0];
        multi_parser.token_type = t[1];
        if (multi_parser.token_type === "TK_EOF") {
          break;
        }
        switch (multi_parser.token_type) {
          case "TK_TAG_START":
            multi_parser.print_newline(false, multi_parser.output);
            multi_parser.print_token(multi_parser.token_text);
            multi_parser.indent();
            multi_parser.current_mode = "CONTENT";
            break;
          case "TK_TAG_STYLE":
          case "TK_TAG_SCRIPT":
            multi_parser.print_newline(false, multi_parser.output);
            multi_parser.print_token(multi_parser.token_text);
            multi_parser.current_mode = "CONTENT";
            break;
          case "TK_TAG_END":
            if (multi_parser.last_token === "TK_CONTENT" && multi_parser.last_text === "") {
              var tag_name = multi_parser.token_text.match(/\w+/)[0];
              var tag_extracted_from_last_output = multi_parser.output[multi_parser.output.length - 1].match(/<\s*(\w+)/);
              if (tag_extracted_from_last_output === null || tag_extracted_from_last_output[1] !== tag_name)
                multi_parser.print_newline(true, multi_parser.output);
            }
            multi_parser.print_token(multi_parser.token_text);
            multi_parser.current_mode = "CONTENT";
            break;
          case "TK_TAG_SINGLE":
            var tag_check = multi_parser.token_text.match(/^\s*<([a-z]+)/i);
            if (!tag_check || !multi_parser.Utils.in_array(tag_check[1], unformatted)) {
              multi_parser.print_newline(false, multi_parser.output);
            }
            multi_parser.print_token(multi_parser.token_text);
            multi_parser.current_mode = "CONTENT";
            break;
          case "TK_CONTENT":
            if (multi_parser.token_text !== "") {
              multi_parser.print_token(multi_parser.token_text);
            }
            multi_parser.current_mode = "TAG";
            break;
          case "TK_STYLE":
          case "TK_SCRIPT":
            if (multi_parser.token_text !== "") {
              multi_parser.output.push("\n");
              var text = multi_parser.token_text;
              if (multi_parser.token_type == "TK_SCRIPT") {
                var _beautifier = typeof js_beautify == "function" && js_beautify;
              } else if (multi_parser.token_type == "TK_STYLE") {
                var _beautifier = typeof css_beautify == "function" && css_beautify;
              }
              if (options.indent_scripts == "keep") {
                var script_indent_level = 0;
              } else if (options.indent_scripts == "separate") {
                var script_indent_level = -multi_parser.indent_level;
              } else {
                var script_indent_level = 1;
              }
              var indentation = multi_parser.get_full_indent(script_indent_level);
              if (_beautifier) {
                text = _beautifier(text.replace(/^\s*/, indentation), options);
              } else {
                var white = text.match(/^\s*/)[0];
                var _level = white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length - 1;
                var reindent = multi_parser.get_full_indent(script_indent_level - _level);
                text = text.replace(/^\s*/, indentation).replace(/\r\n|\r|\n/g, "\n" + reindent).replace(/\s*$/, "");
              }
              if (text) {
                multi_parser.print_token(text);
                multi_parser.print_newline(true, multi_parser.output);
              }
            }
            multi_parser.current_mode = "TAG";
            break;
        }
        multi_parser.last_token = multi_parser.token_type;
        multi_parser.last_text = multi_parser.token_text;
      }
      return multi_parser.output.join("");
    }
    module.exports = {
      prettyPrint: style_html
    };
  }
});

// myTests/puppeteer.testeranto.test.ts
var import_html = __toESM(require_html());
import { PassThrough } from "stream";
var import_puppeteer_screen_recorder = __toESM(require_main());
var PuppeteerTesteranto = (input, testImplementations, testSpecifications) => Node_default(
  input,
  testSpecifications,
  testImplementations,
  {
    beforeAll: async (input2) => {
      return await puppeteer_default.launch({
        // slowMo: input?.slowMo || 0,
        // headless: input.headless,
        // devtools: true,
        args: ["--disable-features=site-per-process"],
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      });
    },
    beforeEach: async (browser, ndx, testRsource, artificer) => {
      const page = await (await browser.createIncognitoBrowserContext()).newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
      );
      const recorder = new import_puppeteer_screen_recorder.PuppeteerScreenRecorder(page, {
        followNewTab: false
        // fps: 25,
        // videoFrame: {
        //   width: 1600,
        //   height: 1200,
        // },
        // videoCrf: 18,
        // videoCodec: 'libx264',
        // videoPreset: 'ultrafast',
        // videoBitrate: 1000,
        // autopad: {
        //   color: 'black',
        // },
        // aspectRatio: '4:3',
      });
      const consoleLogs = [];
      const pageErrors = [];
      const urlLog = [];
      await page.setRequestInterception(true);
      page.on(
        "console",
        (message) => consoleLogs.push(
          `${message.type().substr(0, 3).toUpperCase()}			${message.text()}`
        )
      ).on("pageerror", ({ message }) => pageErrors.push(message)).on("response", async (response) => {
      }).on("requestfailed", (request) => {
      }).on("request", (request) => {
        request.continue();
      }).on("framenavigated", (frame) => {
        urlLog.push(`${Date.now()}	${frame.url()}`);
      });
      const pipeStream = new PassThrough();
      artificer("./screencap.mp4", pipeStream);
      await recorder.startStream(pipeStream);
      return {
        page,
        recorder,
        consoleLogs,
        pageErrors,
        pipeStream,
        urlLog,
        applications: [],
        sfIds: []
      };
    },
    andWhen: async (store, actioner) => {
      return actioner()(store);
    },
    butThen: async function(store) {
      return store;
    },
    afterEach: async function(store, ndx, artificer) {
      await store.recorder.stop();
      store.pipeStream.end();
      artificer(
        "./afterEachScreenshot.png",
        await (await store.page).screenshot({ fullPage: true })
      );
      artificer("./consoleLogs.txt", store.consoleLogs.join(`
`));
      artificer("./pageErrors.txt", store.pageErrors.join(`
`));
      artificer("./urls.txt", store.urlLog.join(`
`));
      artificer(
        "./afterEach.html",
        import_html.default.prettyPrint(await store.page.content(), { indent_size: 2 })
      );
      return store;
    },
    afterAll: async (store, artificer) => {
      await store.page.browser().close();
      return;
    }
  }
);

// src/google.puppeteer.testeranto.test.ts
var google_puppeteer_testeranto_test_default = PuppeteerTesteranto(
  {
    headless: true,
    slowMo: 1
  },
  {
    Suites: {
      Default: "some default Suite."
    },
    Givens: {
      AnEmptyState: async () => {
      }
    },
    Whens: {
      IGoto: (url) => async (store) => {
        await store.page.goto(url);
      }
    },
    Thens: {
      WaitForXPath: (someString) => async ({ page }) => {
        try {
          await page.waitForXPath(`//*[text()="${someString}"]`, { timeout: 1e3 });
          return [assert.equal, true, false];
        } catch {
          return [assert.equal, true, true];
        }
      }
    },
    Checks: {
      AnEmptyState: () => {
        return;
      }
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the AOF portal.",
        {
          "test0": Given.AnEmptyState(
            [],
            [
              When.IGoto("https://www.google.com")
            ],
            [
              Then.WaitForXPath(`//*[@value="I'm Feeling Lucky"]`)
            ]
          )
        },
        []
      )
    ];
  }
);
export {
  google_puppeteer_testeranto_test_default as default
};
