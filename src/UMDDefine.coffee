UMDDefine = (name, definition) ->
  'use strict'
  if window and typeof window.define == 'function'
    return window.define definition
  else if global and typeof global.module != 'undefined' and global.module.exports
    return global.module.exports = definition()
  else
    return window[name] = definition()


module.exports=UMDDefine