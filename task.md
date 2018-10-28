#�������� backend
�� NodeJS �������� ���������� API ��������, ���������� �� websocket � http ������������.

��� ������� ������: typescript, JSON Schema, ���, MVC

http ���������� ������ ��������� ������ POST �������, � ������ �������� ��� application/json, ��� � ������� form-data. ���������� ������ ���� ������� ��� ������������� Express

������ ��� API ����� ./data/bd_s.json

����� � �������� ���� 4 ������: seats, sectors, categories, lines � �� ������ ������ ���� ���������� �����get� (getSeats, getCategories�)

### ��������� ������:

{errorCode: 0, 
	response: {
		seats: { // �����
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
					name: '��� 1',
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

������ ������ ������ �� �������. ������� � ������ ���� ���� ���������:

### ������ �������:

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

### ������ ������:

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

�.�. ����� ����������� ������������� ������ ������, ������� ����� �������� ������ �����, ��������������� ���� ���������� (�� ==) ��
settings->filter, ��� �� � ������ ������ �������������� ������ ����, ��������� � settings->fields
 
������� ������ ������ �������������� �� JSON ����� (draft 07, https://json-schema.org/specification.html), ������� ����� �������. ��������� ������ ������������� ����������� AJV �� �������� JSON �����.

��������, ������

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

�� ������ ������ ���������, �.�. � ������ seats ������ ��� ���� 'unknownField'. ������ �� ������� ��������� ������ �������� � ����� � ���� ������� ������:
 
{
	errors: [...������ ���������],
	data: null
}
 
���������� � ��������. ���� ���� ����, ������� ��� � ������ � ������.
������ �����, ���� ��������� ����������� ������������� � �������� ���������: limit, offset, sort
 

