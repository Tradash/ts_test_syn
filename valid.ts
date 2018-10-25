import ajV = require('ajv');
const ajv = new ajV({allErrors: true});
import vsm = require('../validate/valmain.json');
import vsSeats = require('../validate/valSeats.json');
import vsSectors = require('../validate/valSectors.json');
import vsCategories = require('../validate/valCategories.json');
import vsLines = require('../validate/valLines.json');

// Класс для валидации запросов
export default class valid {
    static valCategories: any = ajv.compile(vsCategories);
    static valSectors: any = ajv.compile(vsSectors);
    static valSeats: any = ajv.compile(vsSeats);
    static valmain: any = ajv.compile(vsm);
    static valLines: any = ajv.compile(vsLines);
}
