const fs=require("node:fs");

function abrirParsedJSON(nombreArchivo){
  try {
      console.log("Abriendo el archivo " + nombreArchivo);
      return JSON.parse(fs.readFileSync('./'+nombreArchivo+'.json', 'utf8'));
      
  } catch (err) {
      console.error("no se pudo abrir el archivo");
  }
}

function guardarJSON(datos,nombreArchivo){
  try {
      console.log("Intentando guardar en el archivo "+nombreArchivo);
      fs.writeFileSync('./'+nombreArchivo+'.json', JSON.stringify(datos));
      console.log("Guardado exitoso en el archivo "+nombreArchivo);
  } catch (err) {
      console.error("no se pudo guardar");
  }
}

function isValidIntInput(input,from = -Infinity, to = Infinity){
  if (isNaN(input)==true) {
    return false
  }
  if (input<from || input>to) {
    return false;
  }
  else{
    return true;
  }
}
module.exports={abrirParsedJSON, guardarJSON, isValidIntInput}