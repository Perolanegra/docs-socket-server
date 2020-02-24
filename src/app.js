const app = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const documents = {};

io.on("connection", socket => {
    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId);
        previousId = currentId;
    };

    socket.on("getDoc", docId => {
        safeJoin(docId);
        console.log('documentos: ', documents[docId]);
        
        socket.emit("document", documents[docId]);
    });

    socket.on("addDoc", doc => {
        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit("documents", Object.keys(documents));
        socket.emit("document", doc);
    });

    socket.on("editDoc", doc => {
        console.log('oq bate aqui: ', doc);
        
        documents[doc.id] = doc;
        socket.to(doc.id).emit("document", doc);
    });

    io.emit("documents", Object.keys(documents));
});

http.listen(4444, () => {
    console.log('to servindo na porta 4444');
});