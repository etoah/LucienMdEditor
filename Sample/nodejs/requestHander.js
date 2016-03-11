/**
 * Created by Lucien on 3/3/2016.
 */

var fs = require("fs");



function RequireHander()
{

}

RequireHander.prototype.upload=function(req,res)
{
    //接收前台POST过来的base64
    var imgData = req.body.imgData;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile("out.png", dataBuffer, function(err) {
        if(err){
            res.send(err);
        }else{
            res.send("保存成功！");
        }
    });
};








module.exports=RequireHander;