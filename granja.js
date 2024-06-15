const readlineSync = require('readline-sync');
const readline=require("readline");
const hr=require("./herramientas")

const rojo = "\u001b[31m";
const azul = "\u001b[34m";
const verde = "\u001b[32m";
const amarillo = "\u001b[33m";
const magenta = "\u001b[35m";
const cian = "\u001b[36m";
const RESET = "\u001b[0m";

const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout,
});

function askQuestion(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            
            resolve(answer);
        });
    });
}
//==========================================================
class Cultivo{
    constructor(id,tipo,tiempoRegado,tiempoRecoleccion){
        //Datos id cultivo
        this.id=id;
        this.tipo=tipo;

        //Datos características
        this.tiempoRegado=tiempoRegado;
        this.tiempoRecoleccion=tiempoRecoleccion;

        //Datos estado
        this.humedo=false;
        this.listo=false;
        this.muerto=false;

        //Contadores
        this.countHumedo=0;// de 200 para que este listo
        this.countSeco=0;// de 44 tics para que muera
        this.countListo=0;// de 400 tics para que muera
    }
    
   
    comprobacionesTic(){
        if (this.muerto==true) {
            return;
        }
        else{
            if (this.listo==true) {
                this.countListo++;
                if (this.countListo>(this.tiempoRecoleccion*2)) {
                    this.muerto=true;
                    console.log(`\n${rojo}El cultivo ${this.id}_${this.tipo} se ha muerto\n${RESET}`);
                    return;
                }
                else{
                    return;
                }
            }
            else{
                if (this.humedo==true) {
                    this.countHumedo++;
                    if (this.countHumedo>=this.tiempoRecoleccion) {
                        console.log(`\n${verde}El cultivo ${this.id}_${this.tipo} se puede recoger\n${RESET}`);
                        this.listo=true;
                        return;
                    }
                    else if(this.countHumedo%this.tiempoRegado==0){
                        console.log(`\n${amarillo}El cultivo ${this.id}_${this.tipo} necesita riego\n${RESET}`);
                        this.humedo=false;
                    }
                    else{
                        return;
                    }
                }
                else{
                    this.countSeco++;

                    if (this.countSeco>(this.tiempoRegado*2)) {
                        this.muerto=true;
                        console.log(`\n${rojo}El cultivo ${this.id}_${this.tipo} se ha muerto\n${RESET}`);
                        return;
                    }
                    else{
                        return;
                    }
                }
            }
        }
    }
    
    toString(){
        
        if (this.muerto==true) {
            return `${rojo}${this.id}_${this.tipo}: ${RESET} Muerto`;
        }
        else if(this.listo==true){
            return `${verde}${this.id}_${this.tipo}: ${RESET} Listo`;
        }
        else if(this.humedo==false){
            return `${amarillo}${this.id}_${this.tipo}: ${RESET} Seco`;
        }
        else{
            return `${cian}${this.id}_${this.tipo}: ${RESET} Regado`;
        }
    }
}
class Granja{
    constructor(){
        //this.log=[]
        this.huerto=[];
        this.semillas=hr.abrirParsedJSON("semillas");
        this.recolectado=[];
        this.countCultivos=1;
        this.idInterval=setInterval(()=>{
            this.huerto.forEach(element => {
                
                element.comprobacionesTic();
                //let instance=JSON.parse(JSON.stringify(element));
                //this.log.push(instance);
            });
        },250)

    }

    async menu() {
        let funcionando=true;
        let valid=false;
        let selectCultivo;
        let selecSemilla;
        let enter;

        while (funcionando==true) {
            console.clear();

            console.log("1.Plantar cultivo\n2.Regar cultivo\n3.Recolectar cultivo\n4.Listar cultivos\n5.Elimnar cultivos\n6.Consultar cultivos recolectados\n7.Salir")
            let opcion = await askQuestion("Elige una opcion: ");
        
            
            switch (opcion) {
                case '1'://PLANTAR_________________________________________________________________
                    console.clear();
                    //Mostramos las semillas que se pueden plantar
                    this.printSemillas()

                    //Seleccion de la semilla y validacion del input
                    valid=false;
                    while (valid==false) {
                        selecSemilla = await askQuestion("\nElige una semilla para plantar: ");
                        valid=hr.isValidIntInput(selecSemilla,1,this.semillas.length);
                    }
                    
                    //Llamada a la funcion que planta el cultivo
                    this.plantarCultivo(selecSemilla);
                    enter=await askQuestion("Pulsa enter para volver al menu")
                    break;
                    
                case '2'://REGAR_______________________________________________________________________
                    console.clear();
                
                    //Ver si hay cultivos
                    if (this.huerto.length<1) {
                        console.log(amarillo+"No hay cultivos plantados"+RESET)
                        enter=await askQuestion("Pulsa enter para volver al menu")
                        break
                    }

                    this.printCultivos();
                    console.log();

                    //Seleccionar cultivo
                    valid=false;
                    while (valid==false) {
                        selectCultivo = await askQuestion("Introduce el numero de un cultivo para regarlo: ");
                        valid=hr.isValidIntInput(selectCultivo);
                        if (valid==false) {
                            console.log(amarillo+"El input no es valido"+RESET)
                        }
                    }
                    //Llamada a la funcion que riega el cultivo
                    this.regarCultivo(selectCultivo);
                    enter=await askQuestion("Pulsa enter para volver al menu")
                    break;

                case '3'://RECOLECTAR_____________________________________________________________________
                    console.clear();
                    //Ver si hay cultivos
                    if (this.huerto.length<1) {
                        console.log(amarillo+"No hay cultivos plantados"+RESET)
                        enter=await askQuestion("Pulsa enter para volver al menu")
                        break
                    }

                    this.printCultivos();
                    console.log();

                    valid=false;
                    while (valid==false) {
                        selectCultivo = await askQuestion("\Introduce el numero de un cultivo para recolectarlo: ");
                        valid=hr.isValidIntInput(selectCultivo);
                        if (valid==false) {
                            console.log(amarillo+"El input no es valido"+RESET)
                        }
                    }

                    //Llamada a la funcion que recoje el cultivo
                    this.recojerCultivo(selectCultivo);
                    enter=await askQuestion("Pulsa enter para volver al menu")
                    break;

                case '4'://LISTAR_________________________________________________________________________
                    console.clear();
                    //Ver si hay cultivos
                    if (this.huerto.length<1) {
                        console.log(amarillo+"No hay cultivos plantados"+RESET)
                        enter=await askQuestion("Pulsa enter para volver al menu")
                        break
                    }    
                    this.printCultivos();
                    enter=await askQuestion("\nPulsa enter para volver al menu")
                    break;
                        
                case '5'://ELIMINAR_______________________________________________________________________
                    console.clear();
                    //Ver si hay cultivos
                    if (this.huerto.length<1) {
                        console.log(amarillo+"No hay cultivos plantados"+RESET)
                        enter=await askQuestion("Pulsa enter para volver al menu")
                        break
                    }

                    this.printCultivos();
                    console.log();
                
                    //Seleccion del cultivo y validacion del input
                    valid=false;
                    while (valid==false) {
                        selectCultivo = await askQuestion("\nIntroduce el numero de un cultivo para eliminarlo: ");
                        valid=hr.isValidIntInput(selectCultivo);
                        if (valid==false) {
                            console.log(amarillo+"El input no es valido"+RESET)
                        }
                    }
                    
                    this.eliminarCultivo(selectCultivo);
                    enter=await askQuestion("Pulsa enter para volver al menu")
                    break;
    
                case '6'://CULTIVOS RECOLECTADOS___________________________________________________________
                    console.clear();
                    //Ver si hay cultivos
                    if (this.recolectado.length<1) {
                        console.log(amarillo+"No hay cultivos recolectados"+RESET)
                        enter=await askQuestion("Pulsa enter para volver al menu")
                        break
                    }
                    this.printRecolectados();
                    enter=await askQuestion("\nPulsa enter para volver al menu")
                    break;

                case '7':
                    clearInterval(this.idInterval)
                    //hr.guardarJSON(this.log,"log")
                    funcionando=false;
                    rl.close();
                    break;

                default:
                    console.log("La opcion no es valida");
            }
        }
    }
    printSemillas(){
        
        console.log("Estas son las semillas disponibles!");
        this.semillas.forEach((semilla,index) => {
            console.log("    "+(index+1)+". "+semilla.nombre)
        });
    }
    printRecolectados(){
        console.log("Los cultivos recolectados:")
        this.recolectado.forEach((element,index) => {
            console.log(element.toString());
        });
    }
    printCultivos(){
        console.log("Nuestro huerto tiene:")
        this.huerto.forEach((element,index) => {
            console.log(element.toString());
        });
    }
    plantarCultivo(selecSemilla){
        
        //Datos para el nuevo cultivo
        let id=this.countCultivos;
        let semilla=this.semillas[selecSemilla-1];

        //Añadir nuevo cultivo al huerto
        this.huerto.push(new Cultivo(id,semilla.nombre,semilla.tiempo_regado,semilla.tiempo_recoleccion));
        console.log(`\n${verde}Se ha plantado una ${semilla.nombre}${RESET}`);
        this.countCultivos++;
    }
    regarCultivo(selecCultivo){
        selecCultivo=Number(selecCultivo);
        
        for (const cultivo of this.huerto) {
            if (cultivo.id==selecCultivo) {
                if (cultivo.humedo==false) {
                    cultivo.humedo=true;
                    cultivo.countSeco=0;
                    console.log(`\n${cian}Se ha regado el cultivo ${cultivo.id}_${cultivo.tipo}${RESET}`)
                    return
                }
                else{
                    console.log(amarillo+"\nNo se puede regar un cultivo que ya está humedo"+RESET)
                    return
                }
            }
        }

        console.log(amarillo+"\nNo hay plantado un cultivo con ese número"+RESET)
        
    }
    recojerCultivo(selecCultivo){
        selecCultivo=Number(selecCultivo);
        
        for (let i = 0; i < this.huerto.length; i++) {
            
            if (this.huerto[i].id==selecCultivo) {
                if(this.huerto[i].listo==true){
                    console.log(`\n${verde}Se ha recogido el cultivo ${this.huerto[i].id}_${this.huerto[i].tipo}${RESET}`)
                    let recolectando=this.huerto.splice(i,1);
                    this.recolectado.push(recolectando[0])
                    return
                }
                else if(this.huerto[i].muerto==true){
                    console.log(amarillo+"\nNo se puede recoger un cultivo que esta muerto, prueba a eliminarlo"+RESET)
                    return
                }
                else{
                    console.log(amarillo+"\nNo se puede recoger un cultivo que no esta listo"+RESET)
                    return
                }
            }
        }
            
        console.log(amarillo+"\nNo hay plantado un cultivo con ese número"+RESET)
        
    }
    eliminarCultivo(selecCultivo){
        
        for (let i = 0; i < this.huerto.length; i++) {
            
            if (this.huerto[i].id==selecCultivo) {
                console.log(`\n${rojo}Se ha eliminado el cultivo ${this.huerto[i].id}_${this.huerto[i].tipo}${RESET}`)
                this.huerto.splice(i,1);
                return
            }
        }
            
        console.log(amarillo+"\nNo hay plantado un cultivo con ese número"+RESET)
        
    }
    
    
}
//============

let granja1=new Granja();
granja1.menu();


 