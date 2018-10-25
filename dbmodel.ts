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
  // Проверка тела запроса
  const valid = val(qn);
  if (!valid) { return {error: val.errors, data: null}; }
  // Выделяем данные запроса
    const q = qn.settings;
    for (let id in d) {
    // Поиск по условию запроса
    count = q.filter.filter((x) => d[id][x.field] == x.value ).length;
        if (count !== 0) { 
        // Если все поля в запросе совпали, добавляем запись
            if (count === q.filter.length) {               
                result = [...result, d[id]];
            }
        }
    }
    // Если установлена сортировка
    if (q.sort) {
        result.sort((a, b):number => {
            for (let i = 0; i < q.sort.fields.length; i++) {
                if (a[q.sort.fields[i]] > b[q.sort.fields[i]]) return (q.sort.order === "asc") ? 1 : -1;
                if (a[q.sort.fields[i]] < b[q.sort.fields[i]]) return (q.sort.order === "asc") ? -1 : 1;
            }
            return 0;
        });
    }
    // Если установлен отбор полей
    if (q.fields.length !== 0) {
        result = result.map(x => {
            record = {};
            for (let i = 0; i < q.fields.length; i++)
                record[q.fields[i]] = x[q.fields[i]];
            return record;
        });
    }
    // Если установлен сдвиг
    if (q.offset) { result = result.slice(q.offset); }
    // Если установлен  лимит
    if (q.limit) { result = result.slice(0, q.limit); }

    return {error: null, data: result};
};


