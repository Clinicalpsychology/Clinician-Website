"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const psychologists_1 = require("../controllers/psychologists");
const router = (0, express_1.Router)();
router.get('/', psychologists_1.listPsychologists);
exports.default = router;
//# sourceMappingURL=psychologists.js.map