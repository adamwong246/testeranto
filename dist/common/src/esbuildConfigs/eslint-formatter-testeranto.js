"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(results) {
    return results
        .filter((r) => r.messages.length)
        .map((r) => {
        const path = r.filePath.replace(process.cwd() + "/", "");
        return [
            path,
            ...r.messages.map((m) => {
                var _a;
                return [
                    `${m.line}:${m.column} ${m.message} (${m.ruleId || ""})`,
                    ...(((_a = m.suggestions) === null || _a === void 0 ? void 0 : _a.map((s) => `- ${s.message}${s.fix ? " (fix)" : ""}`)) || []),
                ].join("\n");
            }),
        ].join("\n");
    })
        .join("\n\n");
}
