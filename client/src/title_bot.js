// Import npm packages.
import React, { Component } from 'react'
import axios from 'axios'

/* The TitleBot component provides a user interface for interacting with the
	TitleBot API. */
class TitleBot extends Component {
	
	constructor(props){
		super(props)
		
		this.getTitle = this.getTitle.bind(this)
		this.getFormattedURL = this.getFormattedURL.bind(this)
		this.updateURL = this.updateURL.bind(this)
		this.startTitleSearch = this.startTitleSearch.bind(this)
		this.removeTitle = this.removeTitle.bind(this)
		this.closeOverlay = this.closeOverlay.bind(this)

		this.state = {
			url: '',
			tableRows: [],
			loadingStyle: 'loading--hidden',
			overlay: 'overlay--hidden',
			errorMessage: '',
			storage: []
		}
	}
	
	closeOverlay(){
		this.setState({
			errorMessage: '',
			overlay: 'overlay--hidden'
		})
	}
	
	updateURL(e){
		e.preventDefault()

		this.setState({
			url: e.target.value
		})
	}
	
	/* The removeTitle method removes a title from both the local storage and
		the component state memory. */
	removeTitle(e){
		let currentTableRows = []
		let currentTableRow
		let currentStorage = []
		let removeKey = e.target.name
		
		// Remove current item from tableRows and currentStorage.
		for	(let i=0; i<this.state.tableRows.length; i++){
			if (removeKey !== this.state.tableRows[i].key){
				currentStorage.push(this.state.storage[i])
				currentTableRows.push(this.state.tableRows[i])
			}
		}

		// Remove current item from local storage.
		localStorage.setItem('titleBotTitles', JSON.stringify(currentStorage))
		
		this.setState({
			tableRows: currentTableRows,
			storage: currentStorage
		})
	}
	
	/* The getFormattedURL method returns a formatted version of the user input
		url. */
	getFormattedURL(){
		let url = this.state.url
		let formattedURL = ''
		let finalIndex = 0
		
		// Remove http and https from url.
		if (url.includes('https://')){
			formattedURL = url.replace('https://', '')
		} else if (url.includes('http://')){
			formattedURL = url.replace('http://', '')
		} else {
			formattedURL = url
		}

		// Remove any trailing forward slashes from the end of the url.
		finalIndex = formattedURL.lastIndexOf('/')
		
		if(finalIndex !== -1 && finalIndex === formattedURL.length - 1){
			formattedURL  = formattedURL.substring(0, finalIndex)
		}
		
		// Add https to url.
		formattedURL = 'https://' + formattedURL
		
		return formattedURL
	}
	
	/* The startTitleSearch method displays a loading gif before the getTitle
		method calls the TitleBot API */
	startTitleSearch(e){
		this.setState({
			loadingStyle: 'loading'
		}, () => {
			this.getTitle(e)
		})
	}
	
	/* 
		The getTitle method calls the TitleBot API with a formatted user 
		input url to get the website title and favicon associated with the
		given url. 
	*/
	getTitle(e){
		e.preventDefault()
		let urlObject = {url: this.getFormattedURL()}
		let currentTime
		let currentRows
		let tableRow
		let currentStorage

		axios.post('', urlObject)
			.then((response) => {
				currentStorage = this.state.storage
				currentRows = this.state.tableRows
				currentTime = new Date()
				
				// Adds new title and favicon to the TitonBot display.
				tableRow =
					<tr key={currentTime.getTime() + response.data.title}>
						<td>
							<img
								name={currentTime.getTime() + response.data.title}
								title='remove'
								onClick={this.removeTitle}
								src={response.data.faviconPath}
							/>
						</td>
						<td>
							{response.data.title}
						</td>
					</tr>

				currentRows.unshift(tableRow)
				
				// Save user input to local storage.
				currentStorage.unshift({
					'title': response.data.title,
					'favicon': response.data.faviconPath
				})
				
				localStorage.setItem('titleBotTitles', 
					JSON.stringify(currentStorage))
				
				this.setState({
					url: '',
					tableRows: currentRows,
					loadingStyle: 'loading--hidden',
					storage: currentStorage
				})
			})
			.catch((error) => {
				this.setState({
					url: '',
					loadingStyle: 'loading--hidden',
					overlay: 'overlay',
					errorMessage: 'Request failed try using the full url ' +
						'with prefixes.'
				})
			})
	}

	componentDidMount(){
		let currentStorage = []
		let currentTableRows = []
		let currentRow
		document.title = 'Title Bot'
		
		// Load local storage into the app.
		if (localStorage.getItem('titleBotTitles')){
			currentStorage = JSON.parse(localStorage.getItem('titleBotTitles'))
		
			for(let i = 0; i < currentStorage.length; i++){
				currentRow =
					<tr key={i}>
						<td>
							<img
								name={i}
								title='remove'
								onClick={this.removeTitle}
								src={currentStorage[i].favicon}
							/>
						</td>
						<td>
							{currentStorage[i].title}
						</td>
					</tr>
				
				currentTableRows.push(currentRow)
			}
		}
		
		this.setState({
			tableRows: currentTableRows,
			storage: currentStorage
		})
	}
	
	render(){
		return (
			<>
				<form onSubmit={this.startTitleSearch}>
					<legend>
						Enter a url to get the website's title and favicon.
					</legend>
					<input
						type='text'
						value={this.state.url}
						onChange={this.updateURL}
						className='input-box'
					/>
					<br />
					<input
						type="submit"
						value="Get Title"
						className='submit-button'
					/>
					<br />
					<img 
						src={require('./images/loading.gif')}
						className={this.state.loadingStyle}
					/>
					<br />
					<output>
						<table>
							<tbody>
								{this.state.tableRows}
							</tbody>
						</table>
					</output>
				</form>
				{/* Overlay for error messages. */}
				<div className={this.state.overlay}>
					<div className='overlay__div'>
						<button
							onClick={this.closeOverlay}
							className='overlay__button'
							>X
						</button>
						<p className='error__message'>
							{this.state.errorMessage}
						</p>
					</div>
				</div>
			</>
		)
	}
}

export default TitleBot