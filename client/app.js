class FileInput extends React.Component{
  constructor(){
    super()
  }

  componentDidMount(){
    document.getElementById("imageUpload").addEventListener("click", function(event){
      event.preventDefault()
    });
  }

  render(){
    return(
      <div className='jumbotron'>
        <form  action="fileupload" method="post" encType="multipart/form-data">
          <input type="file" name="filetoupload" multiple  max="4" min='2'/>
          <br/>
          <input id='imageUpload' type="submit"/>
        </form>
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
      <div style={{display:'none'}}>
        <h1>
          Testing
        </h1>
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
    this.images;
  }

  sendPhotosToBeStiched(e){
    e.preventDefault()
    console.log("stiching")
    fetch('http://localhost:3000/mergeimg',{
      method: 'POST',
      body : this.images
    })
    .then(()=>{
      console.log('good')
    })
    .catch((err)=>{
      console.log(err);
    })


    var xhr = new XMLHttpRequest() xhr.open("POST", "myscript.php");
    xhr.onload= function(event){ alert("The server says: " + event.target.response); }; 
    var formData = new FormData(document.getElementById("myForm"));
    xhr.send(formData);


  }

  saveImagesOnchange(e){
    const formData = new FormData()
    formData.append('photo',e.target.files[0])
    formData.append('enctype', 'some value user types');
    formData.append('description', 'some value user types');
    this.images = formData
    console.log(this.images,formData)
  }

  render(){
    return(
      <div>
        <Header />
        <FileInput buttonHandler={this.sendPhotosToBeStiched.bind(this)} saveImagesOnchange={this.saveImagesOnchange.bind(this)}/>
        <ImageDisplay />
      </div>
    )
  }
}


ReactDOM.render(React.createElement(App,{},null),document.getElementById('root'))
