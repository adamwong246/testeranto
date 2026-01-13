import "../chunk-Y6FXYEAI.mjs";

// src/esbuildConfigs/eslint-formatter-testeranto.ts
function eslint_formatter_testeranto_default(results) {
  return results.filter((r) => r.messages.length).map((r) => {
    const path = r.filePath.replace(process.cwd() + "/", "");
    return [
      path,
      ...r.messages.map(
        (m) => [
          `${m.line}:${m.column} ${m.message} (${m.ruleId || ""})`,
          ...m.suggestions?.map(
            (s) => `- ${s.message}${s.fix ? " (fix)" : ""}`
          ) || []
        ].join("\n")
      )
    ].join("\n");
  }).join("\n\n");
}
export {
  eslint_formatter_testeranto_default as default
};
