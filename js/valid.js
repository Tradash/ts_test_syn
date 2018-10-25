"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajV = require("ajv");
const ajv = new ajV({ allErrors: true });
const vsm = require("../validate/valmain.json");
const vsSeats = require("../validate/valSeats.json");
const vsSectors = require("../validate/valSectors.json");
const vsCategories = require("../validate/valCategories.json");
const vsLines = require("../validate/valLines.json");
// ����� ��� ��������� ��������
class valid {
}
valid.valCategories = ajv.compile(vsCategories);
valid.valSectors = ajv.compile(vsSectors);
valid.valSeats = ajv.compile(vsSeats);
valid.valmain = ajv.compile(vsm);
valid.valLines = ajv.compile(vsLines);
exports.default = valid;
//# sourceMappingURL=valid.js.map