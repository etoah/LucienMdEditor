/**
 * Created by admin on 2016/3/3.
 */


var url = require("url");
var http = require('http');
var PORT = 8000;

var server = http.createServer(function(request, response) {

// TODO

    var pathname = url.parse(request.url).pathname;
    response.write(pathname);
    switch(pathname)
    {
        case "/":console.log(pathname);break;
        case "/upload":console.log(pathname);break;
        case "/":console.log(pathname);break;
        case "/":console.log(pathname);break;
    }


    response.end();
});



server.listen(PORT);

console.log("Server runing at port: " + PORT + ".");