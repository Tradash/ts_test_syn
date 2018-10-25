"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Загрузка данных
const bd_s_json_1 = __importDefault(require("../data/bd_s.json"));
const valid_1 = __importDefault(require("./valid"));
// Класс для обработки запросов
class dbModel {
}
dbModel.getSeats = getSeats;
dbModel.getCategories = getCategories;
dbModel.getSectors = getSectors;
dbModel.getLines = getLines;
exports.default = dbModel;
function getSeats(q) {
    this.func = getDataFromDataset;
    this.val = valid_1.default.valSeats;
    return this.func(bd_s_json_1.default.response.seats, q, this.val);
}
;
function getCategories(q) {
    this.func = getDataFromDataset;
    this.val = valid_1.default.valCategories;
    return this.func(bd_s_json_1.default.response.categories, q, this.val);
}
;
function getSectors(q) {
    this.func = getDataFromDataset;
    this.val = valid_1.default.valSectors;
    return this.func(bd_s_json_1.default.response.sectors, q, this.val);
}
;
function getLines(q) {
    this.func = getDataFromDataset;
    this.val = valid_1.default.valLines;
    return this.func(bd_s_json_1.default.response.lines, q, this.val);
}
;
// d = Данные
// qn = запрос
// val = функция валидации запроса
const getDataFromDataset = (d, qn, val) => {
    let count;
    let record;
    let result = [];
    // Проверка тела запроса
    console.log('3333  ', val);
    const valid = val(qn);
    if (!valid) {
        return { error: val.errors, data: null };
    }
    // Выделяем данные запроса
    const q = qn.settings;
    for (let id in d) {
        // Поиск по условию запроса
        count = q.filter.filter((x) => d[id][x.field] == x.value).length;
        if (count !== 0) {
            // Если все поля в запросе совпали, отбираем поля для отображения
            if (count === q.filter.length) {
                record = {};
                if (q.fields.length === 0) {
                    // если отбор полей не установлен, возвращаем все поля
                    record = d[id];
                }
                else {
                    for (let i = 0; i < q.fields.length; i++) {
                        record[q.fields[i]] = d[id][q.fields[i]];
                    }
                }
                result = [...result, record];
            }
        }
    }
    return { error: null, data: result };
};
//# sourceMappingURL=dbmodel.js.map