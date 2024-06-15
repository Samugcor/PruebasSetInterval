const readlineSync = require('readline-sync');

const readline=require("readline");


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


function decirhola(){
    console.log("Hola")
}

async function menu(){
    let funcionando=true;

    while (funcionando==true) {
        // Display the menu
        console.log("Menu:");
        console.log("1. Option 1");
        console.log("2. Option 2");
        console.log("3. Exit");
        choice = await askQuestion("Elige una opcion: ");
    
        // Handle the choice using a switch statement
        switch (choice) {
            case '1':
                console.log("You chose Option 1.");
                // Add code for Option 1 here
                break;
            case '2':
                console.log("You chose Option 2.");
                // Add code for Option 2 here
                break;
            case '3':
                console.log("Exiting the menu.");
                funcionando=false;
                break;
            default:
                console.log("Invalid choice. Please enter 1, 2, or 3.");
        }
    }
}

menu();
setInterval(decirhola, 2000);