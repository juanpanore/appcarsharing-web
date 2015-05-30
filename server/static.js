
var express = require('express');
var rewrite = require('connect-modrewrite');
//Se establese el directorio donde se encuentra los archivos estáticos
module.exports = function(app, dirname) {

  app.use(rewrite(['!\\.html|\\.js|\\.css|\\.png|\\.jp(e?)g|\\.gif|\\.txt|\\.xml|\\.pdf|\\.woff|\\.ttf|\\.ico|\\.svg\\w+($|\\?) /index.html']));
  app.use(express.static(dirname + '/dist'));     
  
  app.get('/', function(req, res) {
    res.sendfile(dirname + 'index.html');
  });
    
  app.use(express.methodOverride());  

  var port = Number(process.env.PORT || 5000);
  app.listen(port, function() {
    console.log("Listening on " + port);
  });
}