md = require('markdown-it')({
	highlight: (str, lang) ->
		if lang and hljs.getLanguage(lang)
			try
				return hljs.highlight(lang, str).value
			catch $error
				console.log $error;
		return ''
	})
module.exports=(string)->
	md.render string

