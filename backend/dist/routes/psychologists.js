"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const psychologists_1 = require("../controllers/psychologists");
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
    Promise.resolve((0, psychologists_1.listPsychologists)(req, res)).catch(next);
});
router.get('/:id', (req, res, next) => {
    Promise.resolve((0, psychologists_1.getPsychologist)(req, res)).catch(next);
});
exports.default = router;
//# sourceMappingURL=psychologists.js.map