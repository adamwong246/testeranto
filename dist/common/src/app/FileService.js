"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = exports.ApiEndpoint = void 0;
var ApiEndpoint;
(function (ApiEndpoint) {
    ApiEndpoint["files"] = "/api/files/";
    ApiEndpoint["projects"] = "/api/projects/";
    ApiEndpoint["tests"] = "/api/projects/tests";
    ApiEndpoint["report"] = "/api/report";
    ApiEndpoint["health"] = "/api/health";
    ApiEndpoint["write"] = "/api/files/write";
    ApiEndpoint["read"] = "/api/files/read";
})(ApiEndpoint || (exports.ApiEndpoint = ApiEndpoint = {}));
class FileService {
}
exports.FileService = FileService;
