let app = require('./app');
let debug = require('debug')('page-structure:server');
let http = require('http');


let port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

let server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(value) {
    let port = parseInt(value);

    if(isNaN(port)) {
        return value; //Should be a named pipe
    }

    if(port >= 0) {
        return port; //It is a valid port number
    }

    return false;
} 

function onError(error) {
    if(error.syscall != 'listen') { throw error; }

    let bind = (typeof port === 'string'? 'Pipe': 'Port') + (' ' + port);
    switch(error.code) {
        case 'EACCESS':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
        break;
        case 'EADDRINUSE':
            console.error(bind + 'already in use.')
        break;
        default:
            throw error;
    }
}

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'? 'pipe ' + addr : 'port' + addr.port;
    debug('Listening on ' + bind);
}
