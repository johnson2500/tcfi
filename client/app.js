class FileInput extends React.Component{

  constructor(){
    super()
    this.drop = this.drop.bind(this)
    this.dragLeave = this.dragLeave.bind(this)
    this.dragEnter = this.dragEnter.bind(this)

  }

  dragEnter(e){
    e.preventDefault();
    console.log(e)
    e.target.classList.add('file-input-hover')
  }

  dragLeave(e){
    e.preventDefault();
    e.target.classList.toggle('file-input-hover')
  }

  drop(e){
    e.preventDefault();
    e.target.files= e.dataTransfer.files; // set draggable files to the input
    e.target.classList.remove('file-input-hover')
  }

  render(){
    return(
      <div className='jumbotron'>
        <form className='file-input-area' id='imageForm' encType="multipart/form-data">
          <label htmlFor='filetoupload'>Upload 2-4 images. Drag and drop or choose from a folder.</label>
          <hr/>
          <input onDrop={this.drop} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave}  id="fileInput" type="file" name="filetoupload" multiple  max="4" min='2' onChange={this.props.saveImagesOnchange}/>
        </form>
        <button className='btn btn-primary' onClick={this.props.sendPhotosToBeStiched}>Send Pictures</button>
      </div>
    )
  }
}

class ImageDisplay extends React.Component{
  constructor(){
    super()
  }

  render(){
    return(
      <div style={{display:this.props.displayImage}}>
        <h1>View Stiched Image</h1>
        <h4>Click image to download</h4>
        <a download href={this.props.imageUrl}>
        <img id='imagePreview' src={this.props.imageUrl}/>
        </a>
      </div>
    )
  }
}

const Header = ()=>{
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <h1 className="navbar-brand" href="#">Testing</h1>
    </nav>
  )
}

class App extends React.Component{
  constructor(){
    super()
    this.state = {
      displayImage : 'none' ,
      imageUrl:'http://localhost:3000/client/download.png'
    }
  }

  sendPhotosToBeStiched(e){
    e.preventDefault()
    // create form data object that can be process on the server
    console.log('files good', this.checkFiles(document.getElementById('fileInput').files))
    if(this.checkFiles(document.getElementById('fileInput').files)){
      var formData = new FormData(this.files);
      fetch('http://localhost:3000/fileupload',{
        method: 'POST', // Post method
        body : formData
      })
      .then((res)=>res.blob()) // create blob
      .then(blob=>{
        this.setState({
          imageUrl:(window.URL).createObjectURL(blob),// convert blob to usable URL
          displayImage: "" // show image
        })
      })
      .catch((err)=>{
        console.log(err);
      })
    } else {
        alert(" Check Your files your files you have to have more then 1 and max 4 images. Or you files were not images")}

  }

  checkFiles(files){
    if(files.length <= 4 || files.length >= 2){ // check to make sure that the images can be stiched
      for(var i = 0;i < files.length; i++){ // check to make sure the files are actually images
        if(files[i].type !== 'image/png' && files[i] !== 'image/jpg')
          return false
      }
      return true // if all files are of the right type
    } else {
      return false // files are not the correct length
    }
  }

  saveImagesOnchange(e){
    e.preventDefault()
    this.files = document.getElementById('imageForm')
  }

  render(){
    return(
      <div>
        <Header />
        <FileInput sendPhotosToBeStiched={this.sendPhotosToBeStiched.bind(this)} saveImagesOnchange={this.saveImagesOnchange.bind(this)}/>
        <ImageDisplay imageUrl = {this.state.imageUrl} displayImage={this.state.displayImage}/>
      </div>
    )
  }
}

ReactDOM.render(React.createElement(App,{},null),document.getElementById('root'))
