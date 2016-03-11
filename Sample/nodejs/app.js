/**
 * Created by admin on 2016/3/3.
 */


var express = require("express"),
 bodyParser = require('body-parser');
app = express();
//http://localhost:10000/public/pasteArea.html
//
app.use('/public',express.static(__dirname + '/public'));
console.log(__dirname + '/public');
app.use(bodyParser.json());
app.post("/upload", function(req, res) {
        var fileName =new Date().toJSON()+".png";
        console.info("req.headers:");
        console.info(req.headers);
        console.info("req.params:");
        console.info(req.params);
        console.info("query:");
        console.info(req.query);
        console.info("body:");
        console.info(req.body);
        if(req.files&&req.files.AreaImgKey)
        {
            var obj = req.files.AreaImgKey; 
            var tmp_path = obj.path;  
            console.log(tmp_path);

        }
        else
        {
            processPaste(req,fileName);
        }
        
        res.send(fileName);
    
});


function processPaste(req,fileName)
{
    if(!req.body.AreaImgKey)
        return 
    
    var imgData = req.body.AreaImgKey
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    
    fs.writeFile(fileName, dataBuffer, function(err) {
        if(err){
          res.send(err);
        }else{
          res.send("保存成功！");
        }
    });
}

app.listen(10000,function(){
            console.log("server is listening on "+10000)
        });