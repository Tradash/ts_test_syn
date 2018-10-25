"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse = require('querystring').parse;
const multiparty_1 = __importDefault(require("multiparty"));
const valid_1 = __importDefault(require("./valid"));
class view {
    constructor() {
        this.req = null;
        this.res = null;
        this.socket = null;
        this.query = null;
        this.sender = null;
    }
}
exports.view = view;
// Выролнение запроса
let getData = (q, db) => {
    let qn;
    if (typeof (q) === "string") {
        qn = JSON.parse(q);
    }
    else {
        qn = q;
    }
    ;
    // Проверка заголовка запроса
    let valid = valid_1.default.valmain(qn);
    if (!valid) {
        return { "error": valid_1.default.valmain.errors, "data": null };
    }
    const result = db[qn.method](qn);
    return result;
};
function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body).json);
        });
    }
    else {
        let form = new multiparty_1.default.Form();
        form.parse(request, function (err, fields, files) {
            callback(fields.json[0]);
        });
    }
}
const controller = (views, dbmodal) => {
    if (views.sender === "ws") {
        // Обработка запроса из сокета
        const result = getData(views.query, dbmodal);
        views.socket.send(JSON.stringify(result));
    }
    else {
        // Обработка запрома из ХТТП
        collectRequestData(views.req, (query) => {
            const result = getData(query, dbmodal);
            views.res.end(JSON.stringify(result));
        });
    }
};
exports.controller = controller;
//# sourceMappingURL=control.js.map