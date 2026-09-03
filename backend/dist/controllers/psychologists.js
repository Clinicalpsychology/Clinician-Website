"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPsychologist = exports.listPsychologists = void 0;
const database_1 = __importDefault(require("../utils/database"));
const response_1 = require("../utils/response");
const MAX_PAGE_SIZE = 50;
const asBoolean = (value) => {
    if (value === undefined)
        return undefined;
    if (value === 'true' || value === true)
        return true;
    if (value === 'false' || value === false)
        return false;
    return undefined;
};
const asList = (value) => {
    if (typeof value !== 'string')
        return [];
    return value.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
};
const listPsychologists = async (req, res) => {
    const pageValue = Number(req.query.page || 1);
    const limitValue = Number(req.query.limit || 20);
    const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
    const limit = Number.isInteger(limitValue) && limitValue > 0 ? Math.min(limitValue, MAX_PAGE_SIZE) : 20;
    const offset = (page - 1) * limit;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const specialization = typeof req.query.specialization === 'string' ? req.query.specialization.trim().toLowerCase() : '';
    const location = typeof req.query.location === 'string' ? req.query.location.trim().toLowerCase() : '';
    const deliveryMethod = typeof req.query.delivery_method === 'string' ? req.query.delivery_method.trim().toLowerCase() : '';
    const languages = asList(req.query.languages);
    const verifiedOnly = asBoolean(req.query.verified_only);
    const acceptingClients = asBoolean(req.query.accepting_clients);
    const minRating = req.query.min_rating === undefined ? undefined : Number(req.query.min_rating);
    if (minRating !== undefined && (!Number.isFinite(minRating) || minRating < 1 || minRating > 5)) {
        (0, response_1.sendError)(res, 'min_rating must be between 1 and 5', 400, 'VALIDATION_ERROR');
        return;
    }
    const where = ['u.is_active = TRUE'];
    const bindings = [];
    const addBinding = (value) => {
        bindings.push(value);
        return '?';
    };
    if (search) {
        const searchParam = addBinding(`%${search}%`);
        where.push(`LOWER(CONCAT_WS(' ', u.first_name, u.last_name, p.bio)) LIKE LOWER(${searchParam})`);
    }
    if (specialization) {
        const specializationParam = addBinding(specialization);
        where.push(`EXISTS (SELECT 1 FROM psychologist_specializations ps_filter WHERE ps_filter.psychologist_id = p.id AND LOWER(ps_filter.specialization) = ${specializationParam})`);
    }
    if (location) {
        const locationParam = addBinding(`%${location}%`);
        where.push(`EXISTS (SELECT 1 FROM clinic_locations cl_filter WHERE cl_filter.psychologist_id = p.id AND LOWER(CONCAT_WS(' ', cl_filter.city, cl_filter.state_province, cl_filter.country)) LIKE LOWER(${locationParam}))`);
    }
    if (deliveryMethod) {
        const deliveryParam = addBinding(deliveryMethod);
        where.push(`EXISTS (SELECT 1 FROM psychologist_services service_filter WHERE service_filter.psychologist_id = p.id AND service_filter.delivery_method::text = ${deliveryParam})`);
    }
    if (languages.length) {
        const languageParams = languages.map((language) => addBinding(language)).join(', ');
        where.push(`EXISTS (SELECT 1 FROM psychologist_languages lang_filter WHERE lang_filter.psychologist_id = p.id AND LOWER(lang_filter.language) IN (${languageParams}))`);
    }
    if (verifiedOnly !== undefined)
        where.push(`p.license_verified = ${addBinding(verifiedOnly)}`);
    if (acceptingClients !== undefined)
        where.push(`p.accepting_new_clients = ${addBinding(acceptingClients)}`);
    if (minRating !== undefined) {
        where.push(`(SELECT COALESCE(AVG(r.rating), 0) FROM reviews r WHERE r.psychologist_id = p.id AND r.is_published = TRUE) >= ${addBinding(minRating)}`);
    }
    const whereClause = where.join(' AND ');
    const countResult = await database_1.default.raw(`SELECT COUNT(*)::int AS total FROM psychologists p JOIN users u ON u.id = p.user_id WHERE ${whereClause}`, bindings);
    const total = countResult.rows[0]?.total || 0;
    const pageBindings = [...bindings, limit, offset];
    const result = await database_1.default.raw(`
    SELECT
      p.id,
      p.user_id,
      p.license_verified,
      p.license_verification_date,
      p.bio,
      p.years_experience,
      p.hourly_rate,
      p.accepting_new_clients,
      json_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'profile_picture_url', u.profile_picture_url
      ) AS user,
      COALESCE((SELECT json_agg(DISTINCT ps.specialization ORDER BY ps.specialization) FROM psychologist_specializations ps WHERE ps.psychologist_id = p.id), '[]') AS specializations,
      COALESCE((SELECT json_agg(jsonb_build_object('id', service.id, 'service_name', service.service_name, 'service_type', service.service_type, 'delivery_method', service.delivery_method, 'price', service.price) ORDER BY service.id) FROM psychologist_services service WHERE service.psychologist_id = p.id), '[]') AS services,
      COALESCE((SELECT json_agg(DISTINCT pl.language ORDER BY pl.language) FROM psychologist_languages pl WHERE pl.psychologist_id = p.id), '[]') AS languages,
      COALESCE((SELECT json_agg(jsonb_build_object('id', cl.id, 'clinic_name', cl.clinic_name, 'city', cl.city, 'state_province', cl.state_province, 'country', cl.country, 'is_primary', cl.is_primary) ORDER BY cl.is_primary DESC, cl.id) FROM clinic_locations cl WHERE cl.psychologist_id = p.id), '[]') AS clinic_locations,
      ROUND((SELECT AVG(r.rating)::numeric FROM reviews r WHERE r.psychologist_id = p.id AND r.is_published = TRUE), 2) AS average_rating,
      (SELECT COUNT(*)::int FROM reviews r WHERE r.psychologist_id = p.id AND r.is_published = TRUE) AS total_reviews
    FROM psychologists p
    JOIN users u ON u.id = p.user_id
    WHERE ${whereClause}
    ORDER BY p.license_verified DESC, p.created_at DESC, p.id DESC
    LIMIT ? OFFSET ?
  `, pageBindings);
    (0, response_1.sendSuccess)(res, {
        psychologists: result.rows,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
};
exports.listPsychologists = listPsychologists;
const getPsychologist = async (req, res) => {
    const psychologistId = Number(req.params.id);
    if (!Number.isInteger(psychologistId) || psychologistId < 1) {
        (0, response_1.sendError)(res, 'Psychologist id must be a positive integer', 400, 'VALIDATION_ERROR');
        return;
    }
    const result = await database_1.default.raw(`
    SELECT p.id, p.license_verified, p.license_verification_date, p.bio,
      p.years_experience, p.hourly_rate, p.accepting_new_clients,
      json_build_object('id', u.id, 'first_name', u.first_name, 'last_name', u.last_name, 'profile_picture_url', u.profile_picture_url) AS user,
      COALESCE((SELECT json_agg(DISTINCT ps.specialization ORDER BY ps.specialization) FROM psychologist_specializations ps WHERE ps.psychologist_id = p.id), '[]') AS specializations,
      COALESCE((SELECT json_agg(jsonb_build_object('id', s.id, 'service_name', s.service_name, 'service_description', s.service_description, 'service_type', s.service_type, 'delivery_method', s.delivery_method, 'price', s.price) ORDER BY s.id) FROM psychologist_services s WHERE s.psychologist_id = p.id), '[]') AS services,
      COALESCE((SELECT json_agg(DISTINCT pl.language ORDER BY pl.language) FROM psychologist_languages pl WHERE pl.psychologist_id = p.id), '[]') AS languages,
      COALESCE((SELECT json_agg(jsonb_build_object('id', cl.id, 'clinic_name', cl.clinic_name, 'street_address', cl.street_address, 'city', cl.city, 'state_province', cl.state_province, 'country', cl.country, 'is_primary', cl.is_primary) ORDER BY cl.is_primary DESC, cl.id) FROM clinic_locations cl WHERE cl.psychologist_id = p.id), '[]') AS clinic_locations,
      COALESCE((SELECT json_agg(jsonb_build_object('id', e.id, 'institution_name', e.institution_name, 'degree', e.degree, 'field_of_study', e.field_of_study, 'graduation_year', e.graduation_year) ORDER BY e.graduation_year DESC NULLS LAST, e.id) FROM psychologist_education e WHERE e.psychologist_id = p.id), '[]') AS education,
      ROUND((SELECT AVG(r.rating)::numeric FROM reviews r WHERE r.psychologist_id = p.id AND r.is_published = TRUE), 2) AS average_rating,
      (SELECT COUNT(*)::int FROM reviews r WHERE r.psychologist_id = p.id AND r.is_published = TRUE) AS total_reviews
    FROM psychologists p JOIN users u ON u.id = p.user_id
    WHERE p.id = ? AND u.is_active = TRUE
  `, [psychologistId]);
    if (!result.rows[0]) {
        (0, response_1.sendError)(res, 'Psychologist not found', 404, 'NOT_FOUND');
        return;
    }
    (0, response_1.sendSuccess)(res, result.rows[0]);
};
exports.getPsychologist = getPsychologist;
//# sourceMappingURL=psychologists.js.map