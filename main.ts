import http = require('http');
import webS = require('ws');

const wsServer = webS.Server;
const ws = new wsServer({ port: 5001 });

import { controller, view } from "./control"

let views = new view();

import dbModel from './dbmodel';

import fs = require('fs');

// Обработка вэбсокета
ws.on('connection', (socket) => {
    socket.on('message', (data) => {
        views.socket = socket;
        views.query = data;
        views.sender = "ws";
        controller(views, dbModel);
  })
})

ws.on('close', () => {views.socket = null})

// Обработка http
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        views.req = req;
        views.res = res;
        views.sender = "post";
        controller(views, dbModel);        
    } 
    else {
        // Загрузка страницы для тестирования
        fs.readFile('./data/index.html', (err, dataF) => {res.end(dataF)})
    }
});
server.listen(5000);

