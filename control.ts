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
interface resData {
    error: JSON,
    data: JSON
}

// Выролнение запроса
let getData = (q: any, db:any):resData => {
	let qn;
	if (typeof(q) === "string") { qn = JSON.parse(q)} 
		else { qn = q};
	// Проверка заголовка запроса
  	let valid = v.valmain(qn);
    if (!valid) { return { "error": v.valmain.errors, "data": null }; }	
  	const result = db[qn.method](qn);
  	return result;
}

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
        // Обработка запрома из ХТТП
		collectRequestData(views.req, (query) => {
            const result = getData(query, dbmodal);
            views.res.end(JSON.stringify(result));
        });
	}
}

export { controller, view };