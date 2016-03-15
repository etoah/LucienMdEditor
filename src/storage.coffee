event=require("./components.coffee").Event
_storage = (key, value, isDel, storage) ->
  return storage.removeItem(key)  if isDel is false
  if value is `undefined`
    storage.getItem key
  else
    storage.setItem key, value

local=(key, value, isDel)->
  return _storage(key, value, isDel,window.localStorage)

session=(key, value, isDel)->
  return _storage(key, value, isDel,window.sessionStorage)

SElement=(idx,val)->
    @idx=idx
    @time=new Date()
    @value=val
    return @

class Storage extends event
  constructor:(opt)->
    super()
    opt=opt||{}
    @key=opt.key||"Markdown"
    @autoSaveKey=opt.autoSavePrefix||"Lucien_AutoSave_"+@key
    @manualSaveKey=opt.manualSavePrefix||"Lucien_ManualSave_"+@key
    @exitSaveKey=opt.manualSavePrefix||"Lucien_ExitSave_"+@key
    @saveGap=opt.saveGap||20000
    @autoSaveDeep=opt.autoSaveDeep||5


  ###
  min time
  20s
  1min
  3min
  9min
  27min
  81min
  ###

  autoSave:(element)->
	  deep=@autoSaveDeep
	  idx=0
	  setInterval(()=>
      currentValue=JSON.parse @getAutoValue()
      if(!currentValue)
        currentValue={}
        currentValue[0]=new SElement(idx,element.value)
      else if(element.value!=currentValue[0].value)
        @publish('autosave',@)
        currentValue["i0"]=currentValue[0];
        idx++
        currentValue[0]=new SElement(idx,element.value)
        for i in [1...deep]
          if(currentValue["i#{i-1}"]&&currentValue["i#{i-1}"].idx%Math.pow(3,i)==0)
            currentValue[i]=currentValue["i#{i-1}"]
      @setAutoValue(JSON.stringify(currentValue))
    , @saveGap)


  manualSave:(element)->
    deep=@autoSaveDeep
    idx=-1
    _this=@
    currentValue=JSON.parse @getManualValue()
    if(element.value==currentValue[0].value)
      return
    return (()->
      return ()->
        idx++
        if(idx==deep)
          idx=0
        currentValue[idx]={
          value:element.value
          time:new Date()
        }
        _this.setManualValue(JSON.stringify(currentValue))
    )()

  addExitListener:(ele)->
    @recoverValue(ele)
    window.onbeforeunload=()=>
      @setExitValue(ele.value)

  getAutoValue:()->
    return local(@autoSaveKey)
  setAutoValue:(val)->
    return local(@autoSaveKey,val)

  getManualValue:()->
    return local(@manualSaveKey)
  setManualValue:(val)->
	  @publish('manualsave',@)
	  return local(@manualSaveKey,val)

  getExitValue:()->
    return local(@exitSaveKey)
  setExitValue:(val)->
    return local(@exitSaveKey,val)

  recoverValue:(element)->
    val=@getExitValue()
    if(val)
	    element.value=val
	    @setExitValue ''


#static
Storage.local=local

Storage.session=session

module.exports=Storage