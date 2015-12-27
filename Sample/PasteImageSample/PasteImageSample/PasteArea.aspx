<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PasteArea.aspx.cs" Inherits="PasteImageSample.PasteArea" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <div id="box" style="width: 800px; height: 400px; border: 1px solid;" contenteditable="true"></div>
            <div id="box2"><textarea id="box3"  style="width: 800px; height: 400px; border: 1px solid;"></textarea></div>
            



            <script type="text/javascript" src="PasteImage.js"></script>

            <script>

                new PasteArea("box", "UploadHandler.ashx").paste(function (xhr) {
                    var img = new Image();
                    img.src = xhr.responseText;
                    this.appendChild(img);
                });

                new PasteArea("box2", "UploadHandler.ashx").paste(function (xhr) {
                    document.getElementById("box3").value = xhr.responseText;
                });


            </script>
        </div>
    </form>
</body>
</html>
