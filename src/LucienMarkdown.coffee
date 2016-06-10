sync=require("./sync.coffee")
markdown=require("./markdown.coffee")
component=require("./components.coffee").Component
imageUploader=require("./imageuploader.coffee")
storage=require("./storage.coffee")
umdDefine=require("umd-define")

class LucienMardown  extends component
  constructor:(opt) ->
    super(opt.selector)
    opt.url&&@imgUploader=new imageUploader(@contain,opt.url,opt.key)
    @keyupDelay=opt.delay||500
    @storage=new storage({saveGap:3000})
    @subscribe('init',()->
	    @storage.autoSave(@textarea)
	    @storage.addExitListener(@textarea)
    ,@)

  insertTextByObj = (obj, str) ->
    if document.selection
      sel = document.selection.createRange()
      sel.text = str
    else if typeof obj.selectionStart is "number" and typeof obj.selectionEnd is "number"
      startPos = obj.selectionStart
      endPos = obj.selectionEnd
      cursorPos = startPos
      tmpStr = obj.value
      obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length)
      cursorPos += str.length
      obj.selectionStart = obj.selectionEnd = cursorPos
    else
      obj.value += str


  init:()->
    renderTimer=null
    _this=@
    @contain.innerHTML="<textarea style='min-height: 100%;width: 100%;'></textarea>"
    @textarea=@contain.querySelector('textarea')
    @imgUploader.upload((xhr)=>
      @insertText "![img](#{xhr.responseText})"
      @publish('imgLoaded',xhr,@)
    )

    @contain.addEventListener("keyup",()->
      clearTimeout(renderTimer)
      renderTimer=setTimeout(()->
        _this.publish("keyup",_this)
      ,_this.keyupDelay)
    )
    @publish('init',@)


  getText:()->
    return @textarea.value

  setText:(val)->
    return @textarea.value=val

  addText:(val)->
    return @textarea.value=@textarea.value+val

  insertText:(val)->
    return insertTextByObj(@textarea,val)


  getHtml:()->
    @publish('complie',@)
    return markdown(@getText())


umdDefine "LucienMardown",()->
  return LucienMardown

module.exports=LucienMardown


