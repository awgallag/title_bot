// Import npm packages.
const express = require('express')
const axios = require('axios')
const app = express()

//Set constants.
const PORT = 8080
const HREF_OFFSET = 6

app.use(express.json())
app.use(express.urlencoded({extended:false}))

/* The get FaviconPath function takes a webpage's source code and the webpage's
	url as input and then returns a link to the webpage's favicon. */
function getFaviconPath(sourceCode, url){
	let faviconPath = ''
	let start = 0
	let end = 0
	
	// Get favicon path from the source code.
	start = sourceCode.search(/rel="icon"|rel='icon'/)

	if (start !== -1){
		start = sourceCode.indexOf('href=', start) + HREF_OFFSET
		
		end = sourceCode.substring(start).search(/"|'/)
		
		faviconPath =
			sourceCode.substring(start, start + end)
		
		// If faviconPath doesn't begin with a forward slash, then add one.
		if (faviconPath[0] !== '/'){
			faviconPath = '/' + faviconPath
		}
		
		// Check if favIcon is at the root http path.
		if (faviconPath[0] === '/' && 
			faviconPath[1] === '/')
		{
			faviconPath = 'https:' + faviconPath
		} else if (faviconPath.includes('https://') ||
			faviconPath.includes('http://'))
		{
			/* Remove the forward slash that was previously added if
				faviconPath is already a complete url path. */
			faviconPath = faviconPath.substring(1)
		}else {
			faviconPath = url + faviconPath
		}
	}
	
	return faviconPath
}

app.post('', (req, res) => {
	let start = 0
	let end = 0
	let payload = {
		'title': '',
		'faviconPath': ''
	}
	
	// Make sure the client sent a url.
	if (req.body.url === undefined){
		return res.status(400).send('URL Required')
	}
	
	// Get the source code from the webpage located at the provided url.
	axios.get(req.body.url)
		.then((response) => {
			start = 0
			end = response.data.indexOf('</title>')
			
			// Get title.
			for (let i=end; i>0; i--){
				if (response.data[i] === '>'){
					start = i + 1
					break
				}
			}
			
			payload.title = response.data.substring(start, end)
			
			// Check if favicon image is located at the base url.
			payload.faviconPath = 'https://' + response.request.host +
				'/favicon.ico'

			axios.get(payload.faviconPath)
				.then((response) => {
					return res.status(200).send(payload)
				})
				.catch(() => {
					/* If favicon is not at the base url then check the source
						code. */
					payload.faviconPath =
						getFaviconPath(response.data, req.body.url)

					return res.status(200).send(payload)
				})
		})
		.catch((error) => {
			if (error.code === 'ETIMEDOUT'){
				console.log('Error: Requested URL Does Not Exist')
				return res.status(404).send('Error Webpage Not Found')
			} else {
				console.log(error)
				console.log('Error: Internal Server Error')
				return res.status(500).send('Internal Server Error')
			}
		})
})

app.listen(PORT, console.log(`Server is running on localhost:${PORT}`))