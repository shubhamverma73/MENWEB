//handle email or username duplicates
exports.handleError = function (err, res, msg) {
    const code = 400;
    const errorMSG = msg != '' ? msg : err;
    res.setHeader('Content-Type', 'application/json');
    res.status(code).send(JSON.stringify({ status: 400, data: [], message: errorMSG }));
}

exports.handleSuccess = function (req, res, msg) {
    const code = 200;
    res.setHeader('Content-Type', 'application/json');
    res.status(code).send(JSON.stringify({ status: 200, data: [], message: msg }));
}

exports.handleData = function (req, res, result) {
    const code = 201;
    res.setHeader('Content-Type', 'application/json');
    res.status(code).send(JSON.stringify({ status: 201, data: result, message: '' }));
}