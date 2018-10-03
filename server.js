let express = require('express');
let app = express();
let path = require('path');
const PORT = 3000;

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/hello', function (req, res) {
    let name = req.query.name;
    if(name == undefined){
        res.send('Please provide name');
    } else {
        res.send('Hello ' + name);
    }
});



app.listen(PORT, function(){
    console.log('Server start at port ' + PORT);
});