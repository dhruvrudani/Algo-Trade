"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.image_folder = exports.apiResponse = void 0;
class apiResponse {
    constructor(status, message, data, error) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}
exports.apiResponse = apiResponse;
exports.image_folder = ['building', 'apartment', 'penthouse'];
//# sourceMappingURL=index.js.map