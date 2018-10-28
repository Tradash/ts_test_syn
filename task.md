#Тестовое backend
На NodeJS написать обработчик API запросов, работающий по websocket и http одновременно.

Что хочется видеть: typescript, JSON Schema, ООП, MVC

http обработчик должен принимать только POST запросы, и должен понимать как application/json, так и обычный form-data. Обработчик должен быть написан БЕЗ использования Express

Данные для API лежат ./data/bd_s.json

Всего в датасете есть 4 модели: seats, sectors, categories, lines – на каждую должен быть реализован методget… (getSeats, getCategories…)

### Структура данных:

{errorCode: 0, 
	response: {
		seats: { // места
			10: {
					id: 10,
					status: 0,
					event: 1,
					seat: 4,
					line: 17,
					category: 33,
					sector: 10
				},
			...
				},
		categories: {
			1: {
					id: 1,
					name: 'econom',
					about: 'econom',
					price: 100,
					event: 1,
					color: '#ffffff'
				},
			...
				},
		lines: {
			1: {
					id: 1,
					name: 'ряд 1',
					event: 1
				},
			...
				},]
		sectors: {
			10: {
					id: 10,
					event: 1,
					name: '#101',
					translate_x: 0,
					translate_y: 0,
					scale: 0.9,
					rotate: 0,
					category: 1
				},
			...
				}
            }
		}
	}
}

Данные должны лежать на сервере. Запросы к данным могу быть следующие:

### Пример запроса:

{
	method: 'getSeats',
    settings: {
		filter: [
					{
						'field': 'sector',
						'value': 1
					},
					{
						'field': 'category',
						'value': 5
					}
				],		
		fields: ['id','seat','sector','line','category']
    }
}

### Пример ответа:

{
	errors: null,
	data:	[
				{
					id: 1,
					seat: '10',
					sector: 1,
					line: 20,
					category: 5
				},
                 	...
			]
}

Т.е. нужно реализовать универсальный фильтр данных, который будет отдавать только места, соответствующие всем параметрам (по ==) из
settings->filter, так же в ответе должны присутствовать ТОЛЬКО поля, указанные в settings->fields
 
Входные данные должны валидироваться по JSON схеме (draft 07, https://json-schema.org/specification.html), которую нужно сделать. Валидация должна производиться библиотекой AJV по заданной JSON схеме.

Например, запрос

{
	method: 'getSeats',
	settings: {
		filter: [
					{
						'field': 'sector',
						'value': 1
					},
					{
						'field': 'category',
						'value': 5
					}
				],
		fields: ['id','unknownField']
	}
}

Не должен пройти валидацию, т.к. у модели seats вообще нет поля 'unknownField'. Данные об ошибках валидации должны попадать в ответ в виде массива ошибок:
 
{
	errors: [...ошибки валидации],
	data: null
}
 
Аналогично с фильтром. Если есть поля, которых нет в модели – ошибка.
Плюсом будет, если получится реализовать дополнительно к фильтрам настройки: limit, offset, sort
 

