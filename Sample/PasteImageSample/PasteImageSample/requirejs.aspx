<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="requirejs.aspx.cs" Inherits="PasteImageSample.requirejs" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
     请截图后粘贴：
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
    </div>
    </form>
</body>
</html>
