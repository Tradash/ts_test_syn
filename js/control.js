"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse = require('querystring').parse;
const multiparty_1 = __importDefault(require("multiparty"));
const valid_1 = __importDefault(require("./valid"));
// Класс с параметрами клиента
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
// @queryDirty - полученный запрос от клиента
// @dbModal - Класс с функциями для обработки запросов
let getData = (queryDirty, dbModal) => {
    let query;
    if (typeof (queryDirty) === "string") {
        // Ошибка если полученная строка не конвертируется в JSON
        try {
            query = JSON.parse(queryDirty);
        }
        catch (e) {
            return { "error": "Found lexical error in the received query, please check query", "data": null };
        }
    }
    else {
        query = queryDirty;
    }
    ;
    // Проверка заголовка запроса
    let valid = valid_1.default.valmain(query);
    if (!valid) {
        return { "error": valid_1.default.valmain.errors, "data": null };
    }
    const result = dbModal[query.method](query);
    return result;
};
// Функция для выделения текста запроса из POST
// @request - HTTP-запрос полученный от клиента
// @callback - функция обратного вызова выделяющая запрос из полученных данных от клиентов
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
// Функция выполняюшая роль контроллера
// @views - Класс с параметрами клиента
// @dbmodal - Класс с функциями для обработки запросов
const controller = (views, dbmodal) => {
    if (views.sender === "ws") {
        // Обработка запроса из сокета
        const result = getData(views.query, dbmodal);
        views.socket.send(JSON.stringify(result));
    }
    else {
        // Обработка запроса из ХТТП
        collectRequestData(views.req, (query) => {
            const result = getData(query, dbmodal);
            views.res.end(JSON.stringify(result));
        });
    }
};
exports.controller = controller;
//# sourceMappingURL=control.js.map