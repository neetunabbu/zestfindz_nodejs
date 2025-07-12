// D:\zestfindz_nodejs\src\requests\SearchRequest.js

const { body } = require('express-validator');

const SearchRequest = [
  body('search')
    .exists({ checkFalsy: true })
    .withMessage('Search is required')
    .isString()
    .withMessage('Search must be a string')
];

module.exports = SearchRequest;
