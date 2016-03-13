LucienMardown=require("./index.coffee")
show =document.querySelector("#show")
md = new LucienMardown({
  selector:"#box"
  url:"../Upload"
})
md.render()
md.setText("#hahahah\n\n##呵呵")
md.subscribe("imgLoaded",()->
  show.innerHTML=md.getHtml();
)
md.subscribe("keyup",(md)->
  show.innerHTML=md.getHtml();
)



