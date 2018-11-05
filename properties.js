/** @type Properties */
let instance;

function Properties() {
    this.PORT = 3200;
    this.FILES_UPLOAD_FOLDER = 'storage';
    this.MAX_FILE_RESOLUTION = 300;
}

/**
 * @returns {Properties}
 */
function get() {
    instance = instance ? instance : new Properties();
    return instance;
}

module.exports.get = get;
