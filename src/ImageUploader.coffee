Component=require('./components.coffee').Component
Sync=require("./sync.coffee")

class ImageUploader extends Component
  constructor:(id, url, key) ->
    super()
    @url = url #后端处理图片的路径
    @imgKey = key or "AreaImgKey" #提到到后端的name



#private


  preventDragDefault = -> #阻止浏览器默认将图片打开的行为
    document.addEventListener "dragleave", preventDefault() #拖离
    document.addEventListener "drop", preventDefault() #拖后放
    document.addEventListener "dragenter", preventDefault() #拖进
    document.addEventListener "dragover", preventDefault() #拖来拖去
  preventDefault = (e) ->
    e.preventDefault()
    e.returnValue = false
  dataReader = (file, callback) ->
    reader = new FileReader()
    reader.onload = callback
    reader.readAsDataURL file #获取base64编码


  UploadImage::paste = (callback, formData) ->
    _this = this
    @contain.addEventListener "paste", ((e) ->

      if e.clipboardData and e.clipboardData.items[0].type.indexOf("image") > -1
        that = this
        file = e.clipboardData.items[0].getAsFile()
        dataReader file, (e) ->
          fd = formData or (new FormData())
          fd.append thatthat.imgKey, @result
          Sync "POST", thatthat.url, fd,()->
            callback.apply(this,arguments)
            _this.publish("pasted",this)
          , that


    ), false

UploadImage::drag = (callback, formData) ->
  that = this
  @contain.addEventListener "drop", ((e) ->
    e.preventDefault()

    fileList = e.dataTransfer.files
    return false  if fileList.length is 0
    if fileList[0].type.indexOf("image") is -1
      console.log and console.log("您拖的不是图片！")
      return false
    fd = formData or (new FormData())
    fd.append that.imgKey, fileList[0]
    Sync "POST", that.url, fd, ()->
      that.publish("droped",this)
      callback.apply(this,arguments);
    , this

  ), false

UploadImage::upload = (callback, formData) ->
  @drag callback, formData
  @paste callback, formData

  module.exports=ImageUploader