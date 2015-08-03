#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

// Lectura de parametros pasados e inicializamos variables requeridas
var options = process.argv.slice(2);
var dir;
var ext = ['html','js','py','php'];
var regexp = /(<\?)(\W|$)/g;

//Asignamos la ruta del directoria según los parametros o se asigna la actual
if ( options.length >= 1 ) {
  dir = options[0];
}else{
  dir = '.';
}

//Llamada inical a la lectura del directorio
readDir(dir+path.sep);

//Lectura del directorio
function readDir (dirpath) {
  fs.readdir(dirpath, function(err, files){
    if ( files.length > 0 ) {
      files.forEach(function(file){
        fs.stat(dirpath+file,function(err,stats){
          if ( stats && stats.isDirectory() ) {
            readDir(dirpath+file+path.sep);
          }
          if( stats && stats.isFile() ){
            var type_ = file.split('.');
            if (ext.indexOf(type_[type_.length - 1]) >= 0) {
              readfile(dirpath+file);
            }
          }
        });
      });
    }
  });
}

//Lectura del archivo permitido
function readfile (filepath) {
  var data = fs.readFileSync(filepath, {encoding: 'utf-8'});
  var lines = data.split('\n'),
      flag = false;
  for (var i = lines.length - 1; i >= 0; i--) {
      var re = lines[i].match(regexp);
      if ( re ) {
        lines[i] = lines[i].replace(regexp,re[0].trim()+"php ","gi");
        flag = true;
      }
  }
  if (flag) {
    data = lines.join('\n');
    fs.writeFile(filepath,data,function(err){
      if (err) throw err;
      console.log(filepath+" Saved!");
    });
  }
}
