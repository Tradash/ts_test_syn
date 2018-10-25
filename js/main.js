"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const webS = require("ws");
const wsServer = webS.Server;
const ws = new wsServer({ port: 5001 });
const control_1 = require("./control");
let views = new control_1.view();
const dbmodel_1 = __importDefault(require("./dbmodel"));
//const db = dataStore;
const fs = require("fs");
// Обработка вэбсокета
ws.on('connection', (socket) => {
    socket.on('message', (data) => {
        views.socket = socket;
        views.query = data;
        views.sender = "ws";
        control_1.controller(views, dbmodel_1.default);
    });
});
ws.on('close', () => { views.socket = null; });
// Обработка http
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        views.req = req;
        views.res = res;
        views.sender = "post";
        control_1.controller(views, dbmodel_1.default);
    }
    else {
        // Загрузка страницы для тестирования
        fs.readFile('./data/index.html', (err, dataF) => { res.end(dataF); });
    }
});
server.listen(5000);
//# sourceMappingURL=main.js.map