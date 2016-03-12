
sync=require("./sync.coffee")
markdown=require("./markdown.coffee")
component=require("./components.coffee").Component
imageUploader=require("./imageUploader.coffee")
class LucienMardown extends component
  constructor:(selector,url,key) ->
    super(selector)
    @imgUploader=new imageUploader(@contain,url,key)


  init:()->
    @contain.innerHTML="<textarea style='height: 100%;width: 100%'></textarea>"
    @textarea=@contain.querySelector('textarea')
    @imgUploader.upload((xhr)=>
      @insertTest "#![img](#{xhr.responseText})"
      @publish('imgLoaded',xhr)
    )


  getText:()->
    return @textarea.value

  setText:(val)->
    return @textarea.value=val

  insertTest:(val)->
    return @textarea.value=@textarea.value+val

  getHtml:()->
    @publish('complie',@)
    return markdown(@getText())


module.exports=LucienMardown


