imageUploader=require("./imageUploader.coffee")
sync=require("./sync.coffee")
markdown=require("./markdown.coffee")
component=require("./components.coffee").Component
class LucienMardown extends component
  constructor:(selector,url,key) ->
    super()
    @imgUploader=new imageUploader(@contain,url,key)
#    new UploadImage("box", "../Upload").upload(function (xhr) {
#    var img = new Image();
#    img.src = xhr.responseText;
#    this.appendChild(img);
#    });


  init:()->
    @contain.innerHTML="<textarea style='height: 100%;width: 100%'></textarea>"
    @textarea=@contain.querySelector('textarea')
    @imgUploader.upload((xhr)->
      img = new Image();
      img.src = xhr.responseText;

    )


  getText:()->
    return @textarea.value

  setText:(val)->
    return @textarea.value=val

  getHtml:()->
    @publish('complie',@)
    return markdown(@getText())






