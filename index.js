const app = require('express')()
const mergeImg = require('merge-img')
const formidable = require('formidable');

app.get('/', (req, res) => res.sendFile(__dirname + '/client/index.html'))
app.get('/app.js', (req, res) => res.sendFile(__dirname + '/client/app.js'))
app.get('/app.css', (req, res) => res.sendFile(__dirname + '/client/app.css'))

app.get('/client/download.png',(req,res)=>{ // send bad image url
  res.sendFile(__dirname + '/client/download.png')
})

app.post('/fileupload', (req, res,next)=>{ // on file upload
  let imageArr = []
  let form = new formidable.IncomingForm();
  // parse the req to get the formData object
  form.parse(req);
  //when file is ready to be written to the temp folder
  form.on('fileBegin',(name, file)=>{
      file.path = __dirname + '/tempfolder/' + file.name;
      imageArr.push(__dirname + '/tempfolder/' + file.name); // add images to array to be passed to the merge-img function
  });

  form.on('file',(name, file)=>{
    console.log(file.type)
    if(!file.type.includes('image')){
      next('Something went wrong') // send error if someone was using something other then the html form
    }
  })

  form.on('error',(err)=>{
    res.send("Error occured please try again") // send error if the formidable framework was not working
  })
  // when all files have been uploaded
  form.on('end',()=>{
    mergeImg(imageArr) // pass array of paths saved in tempfolder
    .then((img) => {
      // Save image as file
      img.write(__dirname + '/tempfolder/output.png', (img)=>{
        res.sendFile(__dirname + '/tempfolder/output.png') // send the merged file to client to render
      })
    })
  })

});

app.get("*",(req,res)=>{
  res.send(":( Something went wrong please check your URL")
})

app.listen(3000, () => console.log('listening on port 3000!'))
