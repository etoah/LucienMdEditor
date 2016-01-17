using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;

namespace PasteImageSample
{
    /// <summary>
    /// UploadHandler 的摘要说明
    /// </summary>
    public class UploadHandler : IHttpHandler
    {
        const string IMG_PATH = "upload";
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string strData = context.Request["AreaImgKey"].ToString(); //取的base64编码
            Bitmap img=Base64StringToImage(strData);
            string imgName ="/"+ DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".jpg";
            if (img != null)
            {
                img.Save(HttpContext.Current.Server.MapPath(IMG_PATH) + imgName, System.Drawing.Imaging.ImageFormat.Jpeg);

                context.Response.Write(IMG_PATH+imgName);
            }

        }
        protected Bitmap Base64StringToImage(string strbase64)
        {
            try
            {
                byte[] arr = Convert.FromBase64String(strbase64.Split(',')[1]);
                MemoryStream ms = new MemoryStream(arr);
                Bitmap bmp = new Bitmap(ms);
                ms.Close();
                return bmp;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        
    }
}