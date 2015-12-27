##粘贴上传插件

截图后直接粘贴上传。

###使用示例

####直接调用：
```html
<div id="box" style="width: 800px; height: 400px; border: 1px solid;" contenteditable="true"></div>
<script type="text/javascript" src="PasteImage.js"></script>

 new PasteArea("box", "UploadHandler.ashx").paste(function (xhr) {
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

                require(['PasteImage'], function (PasteArea) {

                    new PasteArea("box", "UploadHandler.ashx").paste(function (xhr) {
                        var img = new Image();
                        img.src = xhr.responseText;
                        this.appendChild(img);
                    });

                })


            </script>

```

###浏览器支持

IE11,Chrome,FireFox

###原理

处理目标容器（id）的paste事件，读取e.clipboardData中的数据，如果是图片进行以下处理：
获取文件的base64代码，并构建FormData上传。

###代码

```javascript
function PasteArea(id, url, key)
    {
        this.element = document.getElementById(id); 
        this.url = url; //后端处理图片的路径
        this.imgKey = key || "PasteAreaImgKey"; //提到到后端的name

    }
    PasteArea.prototype.paste = function (callback, formData) 
    {
        var thatthat = this;
        this.element.addEventListener('paste', function (e) {//处理目标容器（id）的paste事件

                if (e.clipboardData && e.clipboardData.items[0].type.indexOf('image') > -1) {
                    var that = this,
                        reader =  new FileReader();
                    file = e.clipboardData.items[0].getAsFile();//读取e.clipboardData中的数据

                    reader.onload = function (e) { //reader读取完成后，xhr上传
                        var xhr = new XMLHttpRequest(),
                            fd = formData || (new FormData());;
                        xhr.open('POST', thatthat.url, true);
                        xhr.onload = function () {
                            callback.call(that, xhr);
                        }
                        fd.append(thatthat.imgKey, this.result); // this.result得到图片的base64
                        xhr.send(fd);
                    }
                    reader.readAsDataURL(file);//获取base64编码
                }
            }, false);
    }

```



