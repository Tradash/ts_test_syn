const parse = require('querystring').parse;
import multiparty from "multiparty";
import validator from "./valid"

// Класс с параметрами клиента
class view {
    req: any;
    res: any;
    socket: any;
    query: any;
    sender: string;
	constructor() {
		this.req = null;
		this.res = null;
		this.socket = null;
		this.query = null;
        this.sender = null;
	}
}

// Выролнение запроса
// @queryDirty - полученный запрос от клиента
// @dbModal - Класс с функциями для обработки запросов

let getData = (queryDirty, dbModal) => {
	let query;
    if (typeof (queryDirty) === "string") {
        // Ошибка если полученная строка не конвертируется в JSON
        try {
            query = JSON.parse(queryDirty)
        }
        catch (e) {
            return { "error": "Found lexical error in the received query, please check query", "data": null}
        }
    } 
		else { query = queryDirty};
	// Проверка заголовка запроса
    let valid = validator.valmain(query);
    if (!valid) { return { "error": validator.valmain.errors, "data": null }; }	
  	const result = dbModal[query.method](query);
  	return result;
}

// Функция для выделения текста запроса из POST request
// @request - HTTP-запрос полученный от клиента
// @callback - функция обратного вызова выделяющая запрос из полученных данных от клиентов

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            let bodyJson = parse(body);
            let key = Object.keys(bodyJson); 
            callback(bodyJson[Object.keys(bodyJson)[0]]);
        });
    }
    else {
        let form = new multiparty.Form();
        form.parse(request, function (err, fields, files) {
            callback(fields[Object.keys(fields)[0]][0]);
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
    } else {
        // Обработка запроса из ХТТП
		collectRequestData(views.req, (query) => {
            const result = getData(query, dbmodal);
            views.res.end(JSON.stringify(result));
        });
	}
}

export { controller, view };