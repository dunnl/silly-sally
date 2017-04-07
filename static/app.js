msgApp = function () {

    var prependLi = function(ul, li, nlis) {
        console.log("Prepend called");
        ul.insertBefore(li, ul.childNodes[0]);
        if (ul.childNodes.length > nlis) {
            ul.removeChild(ul.lastChild);
        }
    }
    var appendLi = function(ul, li, nlis) {
        console.log("Append called");
        ul.appendChild(li);
        if (ul.childNodes.length > nlis) {
            ul.removeChild(ul.firstChild);
        }
    }
    var attachApp = function(ul, nlis, appendAtTop) {
        var appendTextLi = function(txt) {
            var newli = document.createElement('li');
            newli.appendChild(document.createTextNode(txt));
            if (appendAtTop) {
                prependLi(ul, newli, nlis);
            } else {
                appendLi(ul, newli, nlis);
            }
        }
        var appendHtmlLi = function(html) {
            var newli = document.createElement('li');
            newli.innerHTML = html;
            if (appendAtTop) {
                prependLi(ul, newli, nlis);
            } else {
                appendLi(ul, newli, nlis);
            }
        }
        ul.appendTextLi = appendTextLi;
        ul.appendHtmlLi = appendHtmlLi;
    }

    return {
        "attachToUl" : attachApp
    }
}();

guessApp = function () {
    console.log("Running guessApp");
    var cmdExp = /\w*/;
    var socket = new WebSocket('ws://localhost:8080');
    var guess  = new Object();
        guess.form   = document.getElementById('guess.form');
        guess.likes  = document.getElementById('guess.likes')
        guess.notlikes = document.getElementById('guess.notlikes');

    var guessUl   = document.getElementById('guess-ul');
    var messageUl = document.getElementById('message.ul');

    msgApp.attachToUl(messageUl, 8, false);
    msgApp.attachToUl(guessUl, 8, true);

    var appClientMsg = function(txt) {
        messageUl.appendHtmlLi("<span class=\"client-msg\">Client</span>: " + txt);
    }

    var appSysMsg = function(txt) {
        console.log("Called");
        messageUl.appendHtmlLi("<span class=\"system-msg\">Server</span>: " + txt);
    }

    var appGuess = function(gsRes) {
        var msg = "<div class=\"prettyGuess\">" +
                "<p>Silly Sally likes " +
                "<span class=\"big\">" + gsRes.resGs.likes+"</span>, "
                + "but not " +
                "<span class=\"big\">" + gsRes.resGs.notlikes+"</span>. ";
        if (gsRes.resValid) {
            msg += "<span class=\"true\">Correct</span> ";
        } else {
            msg += "<span class=\"false\">Wrong</span> ";
        }
        date = new Date();
        date.setTime(Date.parse(gsRes.resTime));
        dateStr = moment(date).utc().format("MM/DD/YYYY HH:mm");
        msg += "<span class=\"time\">" + dateStr + " UST</span>";
        guessUl.appendHtmlLi(msg);
    }

    sendGuess = function(socket, newGuess) {
        var newMessage = new Object();
        newMessage.body = newGuess;
        newMessage.type = "guess";
        socket.send(JSON.stringify(newMessage));
    }

    // misc functions
    cutInput = function (el) {
        var ret = el.value
            el.value = ""
        return ret;
    }

    submitGuess = function(socket) {
        return function (e) {
            if (e.preventDefault) e.preventDefault();

            var newGuess = new Object();
            newGuess.notlikes = cutInput(guess.notlikes);
            newGuess.likes  = cutInput(guess.likes);
            appClientMsg("Submitting guess");
            sendGuess(socket,newGuess);
        }
    }

    socket.onopen = function (e) {
        appClientMsg("Socked opened successfully");
    }
    socket.onclose = function (e) {
        appClientMsg("Closing socket");
    }
    socket.onmessage = function (e) {
        console.log(e.data)
        var obj = JSON.parse(e.data);
        switch(obj.type) {
            case "guess":
                console.log("Received a guess");
                appGuess(obj.body)
                console.log("Appended guess");
                break;
            case "control":
                console.log("Received a system message");
                appSysMsg(obj.body);
                break;
            default:
               console.log("Received a strange message");
            }
    }
    guess.form.addEventListener('submit', submitGuess(socket));
    return 0;
}

window.onload = guessApp;
