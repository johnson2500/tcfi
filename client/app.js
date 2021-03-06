//=== Stateless components =====================================================
const ImageDisplay = ({imageUrl, displayImage})=>{
  return(
    <div id='imagePreviewArea' className='text-center' style={{display:displayImage}}>
      <h2>View Stiched Image</h2>
      <h4>Click image to download</h4>
      <a download href={imageUrl}>
        <img id='imagePreview' src={imageUrl}/>
      </a>
    </div>
  )
}

const Header = ()=>{
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <h1 className="navbar-brand">Ryan Johnson Submission</h1>
    </nav>
  )
}

const Footer = ()=>{
  return (
    <div className="jumbotron footer text-center bg-primary">
      <a href="https://github.com/johnson2500"><p className='white-text'>Click here to see my other projects! </p></a>
      <hr/>
      <a href="https://github.com/jTronixDevelopment"><p className='white-text'>Check out my other projects with others! </p></a>
    </div>
  )
}

const Thumbnail = ({src})=>{
  return (
    <image className='thumbnail-img' src={src}/>
  )
}

//=== Class components =========================================================

class FileInput extends React.Component{
  constructor(){
    super()
    this.drop = this.drop.bind(this)
    this.dragLeave = this.dragLeave.bind(this)
    this.dragEnter = this.dragEnter.bind(this)
  }

  dragEnter(e){
    e.target.classList.add('file-input-hover') // add css styling
  }

  dragLeave(e){
    e.target.classList.toggle('file-input-hover') // remove styling
  }

  drop(e){
    e.preventDefault();
    e.target.files= e.dataTransfer.files; // set draggable files to the input
    e.target.classList.remove('file-input-hover') // remove class
  }

  render(){
    return(
      <div className='text-center'>
        <h1>Image Sticher</h1>
        <form className='file-input-area jumbotron' id='imageForm' encType="multipart/form-data">
          <label htmlFor='filetoupload'>Upload 2-4 images. Drag and drop or choose from a folder.</label>
          <hr/>
          <input
            onDrop={this.drop}
            onDragEnter={this.dragEnter}
            onDragLeave={this.dragLeave}
            onChange={this.props.saveImagesOnchange}
            id="fileInput"
            type="file"
            name="filetoupload"
            multiple  max="4" min='2'
          />
          <button className='btn btn-primary margin-button' onClick={this.props.sendPhotosToBeStiched}>Send Pictures</button>
        </form>
      </div>
    )
  }
}

class App extends React.Component{
  constructor(){
    super()
    this.state = {
      displayImage : 'none' ,
      imageUrl:'http://localhost:3000/client/download.png' // if image is bad show place holder
    }
  }

  //== send photos if valid ==

  sendPhotosToBeStiched(e){
    e.preventDefault()
    // create form data object that can be process on the server
    if(this.checkFiles(this.imageInput.files)){
      fetch('http://localhost:3000/fileupload',{
        method: 'POST', // Post method
        body : new FormData(this.files)
      })
      .then(res=>res.blob()) // create blob
      .then(blob=>{
        this.setState({
          imageUrl:(window.URL).createObjectURL(blob),// convert blob to usable URL
          displayImage: "" // show image
        })
      })
      .then(()=>{
        this.scrollToResult()
      })
      .catch((err)=>{
        alert('Opps something went wrong. Check your file extensions and try again. ')
      })
    } else {
      alert(" Check Your files your files you have to have more then 1 and max 4 images. Or you files were not images")
    }
  }

  checkFiles(files){
    if(files.length <= 4 || files.length >= 2){ // check to make sure that the images can be stiched
      for(var i = 0;i < files.length; i++){ // check to make sure the files are actually images
        if(!files[i].type.includes('image'))
          return false
      }
      return true // if all files are of the right type
    } else {
      return false // files are not the correct length
    }
  }

  //== setstate when image input changes ==

  saveImagesOnchange(e){
    e.preventDefault()
    this.files = document.getElementById('imageForm')
  }

  //== scroll to result if available ==

  scrollToResult(){
    this.imagePreview.scrollIntoView();
  }

  //== save vars when compent is finished mounting ==

  componentDidMount(){
    this.imageInput = document.getElementById('fileInput')
    this.imagePreview = document.getElementById('imagePreviewArea')
  }

  render(){
    return(
      <div className='app'>
        <Header />
        <FileInput
          sendPhotosToBeStiched={this.sendPhotosToBeStiched.bind(this)}
          saveImagesOnchange={this.saveImagesOnchange.bind(this)}
          imagePreview = { this.state.imagePreview }
        />
        <ImageDisplay
          imageUrl = {this.state.imageUrl}
          displayImage={this.state.displayImage}
        />
        <Footer />
      </div>
    )
  }
}

//=== Render Components ========================================================

ReactDOM.render(React.createElement(App,{},null),document.getElementById('root'))
