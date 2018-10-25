// Загрузка данных
import data from "../data/bd_s.json";
import v from "./valid"


// Класс для обработки запросов
export default class dbModel {
    static getSeats: any = getSeats;
    static getCategories: any = getCategories;
    static getSectors: any = getSectors;
    static getLines: any = getLines;
}

function getSeats(q: JSON) {
    this.func = getDataFromDataset;
    this.val = v.valSeats;
    return this.func(data.response.seats, q, this.val);
};

function getCategories(q: JSON) {
    this.func = getDataFromDataset;
    this.val = v.valCategories;
    return this.func(data.response.categories, q, this.val);
};

function getSectors(q: JSON) {
    this.func = getDataFromDataset;
    this.val = v.valSectors;
    return this.func(data.response.sectors, q, this.val);
};

function getLines(q: JSON) {
    this.func = getDataFromDataset;
    this.val = v.valLines;
    return this.func(data.response.lines, q, this.val);
};

// d = Данные
// qn = запрос
// val = функция валидации запроса

const getDataFromDataset = (d, qn, val) => {
  let count; let record;
    let result = [];
    let limit = 1, limitDec = 0;
    let offset = 0, offsetDec = 0;
  // Проверка тела запроса
  const valid = val(qn);
  if (!valid) { return {error: val.errors, data: null}; }
  // Выделяем данные запроса
    const q = qn.settings;
    
    //if (q.limit) {
    //    limitDec = 1;
    //    limit = q.limit;
    //}
    
    //if (q.offset) {
    //    offset = q.offset;
    //    offsetDec = 1;
    //}
    for (let id in d) {
    // Поиск по условию запроса
    count = q.filter.filter((x) => d[id][x.field] == x.value ).length;
        if (count !== 0) { 
        // Если все поля в запросе совпали, отбираем поля для отображения
            if (count === q.filter.length) {
                // Если выбрали все по лимиту выходим из цикла
                //if (limit === 0) { break;}
                record = {};
                limit -= limitDec;
                if (q.fields.length === 0) {
                    // если отбор полей не установлен, возвращаем все поля
                    record = d[id];
                } else {
                    for (let i = 0; i < q.fields.length; i++) {
                        record[q.fields[i]] = d[id][q.fields[i]];
                    }
                }
                // Если установлен offset, пропускаем пока счетчик не обнулиться
                //if (offset <= 0) {
                result = [...result, record];
                //}
                //offset -= offsetDec;
            }
        }
    }
    // Если установлен  лимит
    if (q.limit) { result = result.slice(0, q.limit); }
    // Если установлен сдвиг
    if (q.offset) { result = result.slice(q.offset); }
    return {error: null, data: result};
};


