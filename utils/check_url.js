
/**
 * URL operations
 */

var checkTwitterURL = require('../widgets/twitter/utils/check_url');

function isURL(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    if (!pattern.test(url)) {
        return false;
    } else {
        return true;
    }
}

function checkURL(url) {
    if (isURL(url)) {
        if (checkTwitterURL(url)) {
            return {type: 'twitter-url'}
        } else {
            return {type: 'url'}
        }
    } else {
        return {type: 'normal'}
    }
}

module.exports = checkURL;