const { URL } = require('url');

const isValidUrl = function (url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = {
    isValidUrl,
};
