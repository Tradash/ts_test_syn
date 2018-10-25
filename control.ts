const parse = require('querystring').parse;
import multiparty from "multiparty";
import v from "./valid"

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
let getData = (q: any, db:any) => {
	let qn;
    if (typeof (q) === "string") {
        // Ошибка если полученная строка не конвертируется в JSON
        try {
            qn = JSON.parse(q)
        }
        catch (e) {
            return { "error": "Found lexical error in the received query, please check query", "data": null}
        }
    } 
		else { qn = q};
	// Проверка заголовка запроса
  	let valid = v.valmain(qn);
    if (!valid) { return { "error": v.valmain.errors, "data": null }; }	
  	const result = db[qn.method](qn);
  	return result;
}

// Функция для выделения текста запроса из POST
function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body).json);
        });
    }
    else {
        let form = new multiparty.Form();
        form.parse(request, function(err, fields, files) {
            callback(fields.json[0]);
      });
        
    }
}


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