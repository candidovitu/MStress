const readline = require("readline");
const axios = require('axios');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("\nQual o endereço do website? (ex.: https://google.com)\n> ", url=>{
    rl.question("\nPor quanto tempo deseja manter? (Segundos)\n> ", time=>{
        rl.question("\nQuantos usuários deseja?\n> ", size=>{
            if(!url || !time || !size) return console.log('Insira todas as entradas..'); 
            if(!Number(time) || !Number(size)) return console.log('\nValores incorretos. Insira apenas números nas entradas "tempo" e "treads"!');
             console.log('Verificando status do website...');
             check(url, (err, data)=>{
                if(!data.status || err){
                    console.log('Não foi possível conectar-se com o website!');
                    process.exit(1);
                }else if(data.status != 200){
                     console.log(`[!] O website retornou ${data.status}, continuando assim mesmo..`);
                }
            });
             stress(url,size,time);
        });
    });
});

rl.on("close", function() {
    console.log("\n\nTeste abortado!\n\n");
    process.exit(0);
});

function stress(url, size, time){
    let hits = 0;
    console.log('\n\n\nTeste iniciado!\n\n\n');

    var logsFileName = `logs/logs-${new Date()}`;
    fs.writeFileSync(logsFileName, `Usuários: ${size}\nURL: ${url}\nTempo: ${time}\n`);

    setInterval(()=>{
     for(var i = 1;i<size;i++){
         hits++;
         axios.get(url).then(data=>fs.appendFileSync(logsFileName, `${url} | ${new Date()} | ${data.status}\n`));
     }
    },500);

    setTimeout(()=>{
        fs.appendFileSync(logsFileName, `\n\n\nTeste finalizado..\n${new Date()}\nAcessos: ${hits}`);
        console.log('\n\n\nTeste finalizado! Os registros estão no diretório "logs".\n\n\n');
        process.exit(1);
    },time*1000);
}

var check = function(url, cb){
    axios.get(url).then(data=>cb(null,data)).catch(err=>cb(err, null));
}