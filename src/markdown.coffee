md = require('markdown-it')()
module.exports=(string)->
	md.render string

