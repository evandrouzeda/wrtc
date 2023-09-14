import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 5000 });
const offers = {}
const answers = {}
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    let pearid = ""
    ws.on('message', function message(data) {
        try {
            const msg = JSON.parse(data)
            console.log('received:', pearid, msg.cmd);
            if (!msg.cmd) return ws.send("invalido")
            switch (msg.cmd) {
                case "setpearid":
                    pearid = msg.pearid
                    break;
                case "setoffer":
                    offers[msg.pearid] = msg.offer
                    ws.send(JSON.stringify("ok"))
                    break;
                case "getoffer":
                    ws.send(JSON.stringify(offers[msg.pearid]))
                    break;
                case "setanswer":
                    answers[msg.pearid] = msg.answer
                    ws.send(JSON.stringify("ok"))
                    break;
                case "getanswer":
                    ws.send(JSON.stringify(answers[msg.pearid]))
                    break;
                default:
                    break;
            }
        } catch (error) {
            ws.send(error.toString())
        }
    });

    ws.on("close", () => {
        delete offers[pearid]
        delete answers[pearid]
    })
});