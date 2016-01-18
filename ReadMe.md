##图片上传插件

* 截图后直接粘贴上传。    
![](./doc/howtouse.gif)  

* 拖拽上传    
![](./doc/drap.gif)     
**http网络**     
![](./doc/requestAndRes.jpg) 

###使用示例

####直接调用：
```html
<div id="box" style="width: 800px; height: 400px; border: 1px solid;" contenteditable="true"></div>
<script type="text/javascript" src="UploadImage.js"></script>

  new UploadImage("box", "UploadHandler.ashx").upload(function (xhr) {
                    var img = new Image();
                    img.src = xhr.responseText;
                    this.appendChild(img);
                });
```

####AMD/CMD
```html
<div id="box" style="width: 800px; height: 400px; border: 1px solid;" contenteditable="true"></div>
            <script type="text/javascript" src="require.js"></script>
            <script>
                require(['UploadImage'], function (UploadImage) {

                    new UploadImage("box", "UploadHandler.ashx").upload(function (xhr) {
                        var img = new Image();
                        img.src = xhr.responseText;
                        this.appendChild(img);
                    });

                })
            </script>
   ```
   

###浏览器支持
当前版本只支持以下，浏览器，后期可能会支持更多浏览器，如ie10等。
* IE11
* Chrome
* FireFox
* Safari(未测式，理论应该支持)

###原理

1. 粘贴上传   
处理目标容器（id）的paste事件，读取e.clipboardData中的数据，如果是图片进行以下处理：
用H5 File API(FileReader)获取文件的base64代码，并构建FormData异步上传。
2. 拖拽上传    
处理目标容器（id）的drop事件，读取e.dataTransfer.files（H5 File API: FileList）中的数据，如果是图片并构建FormData异步上传。
    




