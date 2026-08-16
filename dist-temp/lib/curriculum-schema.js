"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFamilyPremiumProjection = createFamilyPremiumProjection;
exports.serializeForFamily = serializeForFamily;
exports.validateCurriculumLesson = validateCurriculumLesson;
function createFamilyPremiumProjection(lesson) {
    const { teacherPreparation, teacherAnswerKey, privateTeacherNotes, internalFactCheckNotes, sourceNotes, factualSources, ...familySafe } = lesson;
    return familySafe;
}
// Exclude teacher-only fields for Family serialization
function serializeForFamily(lesson) {
    const { teacherPreparation, teacherAnswerKey, privateTeacherNotes, internalFactCheckNotes, ...familyVisible } = lesson;
    return familyVisible;
}
// Lightweight runtime validator — useful for build-time checks and unit tests
function validateCurriculumLesson(value) {
    const errors = [];
    if (!value || typeof value !== 'object') {
        errors.push('Value must be an object');
        return { ok: false, errors };
    }
    const mustBeString = (k) => {
        if (!(k in value) || typeof value[k] !== 'string')
            errors.push(`${k} must be a string`);
    };
    mustBeString('id');
    mustBeString('date');
    mustBeString('title');
    mustBeString('topic');
    mustBeString('ageRange');
    mustBeString('unit');
    if (!Array.isArray(value.learningObjectives) || value.learningObjectives.some((v) => typeof v !== 'string')) {
        errors.push('learningObjectives must be an array of strings');
    }
    if (!Array.isArray(value.vocabulary)) {
        errors.push('vocabulary must be an array');
    }
    else {
        value.vocabulary.forEach((v, i) => {
            if (!v || typeof v.word !== 'string')
                errors.push(`vocabulary[${i}].word must be a string`);
        });
    }
    if (!Array.isArray(value.materials))
        errors.push('materials must be an array');
    if (!Array.isArray(value.factualMediaRequirements))
        errors.push('factualMediaRequirements must be an array');
    if (value.mediaReferences && (!Array.isArray(value.mediaReferences) || value.mediaReferences.some((m) => typeof m !== 'string'))) {
        errors.push('mediaReferences must be an array of strings when present');
    }
    if (value.factualSources && !Array.isArray(value.factualSources)) {
        errors.push('factualSources must be an array when present');
    }
    else if (Array.isArray(value.factualSources)) {
        value.factualSources.forEach((src, i) => {
            if (!src || typeof src.source !== 'string')
                errors.push(`factualSources[${i}].source must be a string`);
            if (src.url && typeof src.url !== 'string')
                errors.push(`factualSources[${i}].url must be a string`);
            if (src.note && typeof src.note !== 'string')
                errors.push(`factualSources[${i}].note must be a string`);
        });
    }
    if (!value.activities || typeof value.activities !== 'object')
        errors.push('activities must be present and an object');
    else {
        if (typeof value.activities.beginnerSupport !== 'string')
            errors.push('activities.beginnerSupport must be a string');
        if (typeof value.activities.coreActivity !== 'string')
            errors.push('activities.coreActivity must be a string');
        if (typeof value.activities.advancedChallenge !== 'string')
            errors.push('activities.advancedChallenge must be a string');
    }
    // Validate knowledgeCheck shape
    if (!Array.isArray(value.knowledgeCheck))
        errors.push('knowledgeCheck must be an array');
    else {
        value.knowledgeCheck.forEach((q, i) => {
            if (!q || typeof q.question !== 'string')
                errors.push(`knowledgeCheck[${i}].question must be a string`);
            if (!Array.isArray(q.options) || q.options.some((o) => typeof o !== 'string'))
                errors.push(`knowledgeCheck[${i}].options must be an array of strings`);
            if (typeof q.correctAnswer !== 'string')
                errors.push(`knowledgeCheck[${i}].correctAnswer must be a string`);
        });
    }
    // Date format basic check YYYY-MM-DD
    if (value.date && !/^\d{4}-\d{2}-\d{2}$/.test(value.date))
        errors.push('date must be ISO YYYY-MM-DD');
    mustBeString('privacyClassification');
    if (value.privacyClassification && !["family-safe", "teacher-only", "private", "public"].includes(value.privacyClassification)) {
        errors.push('privacyClassification must be one of family-safe, teacher-only, private, public');
    }
    mustBeString('publicationStatus');
    if (value.publicationStatus && !["draft", "pilot", "published"].includes(value.publicationStatus)) {
        errors.push('publicationStatus must be one of draft, pilot, published');
    }
    if (value.gratitudePrompt && typeof value.gratitudePrompt !== 'string')
        errors.push('gratitudePrompt must be a string when present');
    if (value.prayerPrompt && typeof value.prayerPrompt !== 'string')
        errors.push('prayerPrompt must be a string when present');
    if (value.sourceNotes && typeof value.sourceNotes !== 'string')
        errors.push('sourceNotes must be a string');
    if (value.mediaAttributionNotes && typeof value.mediaAttributionNotes !== 'string')
        errors.push('mediaAttributionNotes must be a string');
    if (value.accessibilityNotes && typeof value.accessibilityNotes !== 'string')
        errors.push('accessibilityNotes must be a string');
    // Ensure teacher-only fields presence and types
    if (!('teacherPreparation' in value) || typeof value.teacherPreparation !== 'string')
        errors.push('teacherPreparation must be present as a string');
    if (!('teacherAnswerKey' in value) || typeof value.teacherAnswerKey !== 'object')
        errors.push('teacherAnswerKey must be present as an object');
    return { ok: errors.length === 0, errors };
}
