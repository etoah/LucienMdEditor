
xhRequest = (method, url, formData, callback, callbackContext) ->
  xhr = new XMLHttpRequest()
  xhr.open method, url, true
  xhr.onload = ->
    callback and callback.call(callbackContext or this, xhr)
  xhr.send formData or (new FormData())

module.exports=xhRequest