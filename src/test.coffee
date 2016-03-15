LucienMardown=require("./index.coffee")
show =document.querySelector("#show")
md = new LucienMardown({
  selector:"#box"
  url:"../Upload"
})
md.subscribe("imgLoaded",()->
  show.innerHTML=md.getHtml();
)
md.subscribe(["init","keyup"],(md)->
  show.innerHTML=md.getHtml();
)
md.render()
