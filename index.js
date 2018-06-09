const app = require('express')()
const mergeImg = require('merge-img')
const formidable = require('formidable');

app.get('/', (req, res) => res.sendFile(__dirname + '/client/index.html'))

app.get('/app.js', (req, res) => res.sendFile(__dirname + '/client/app.js'))

app.get('/app.css', (req, res) => res.sendFile(__dirname + '/client/app.css'))

app.get('/client/download.png',(req,res)=>{
  console.log('getting image');
  res.sendFile(__dirname + '/client/download.png')
})

app.post('/fileupload', function (req, res) {
  let imageArr = []
  var form = new formidable.IncomingForm();
  // parse the req to get the formData
  form.parse(req);
  //when file is ready to be written to the temp folder
  form.on('fileBegin', function (name, file){
      file.path = __dirname + '/tempfolder/' + file.name;
      imageArr.push(__dirname + '/tempfolder/' + file.name)
  });

  form.on('error',(err)=>{
    res.send("Error occured please try again")
  })

  // when all files have been uploaded
  form.on('end',()=>{
    console.log(imageArr)
    mergeImg(imageArr)
    .then((img) => {
      // Save image as file
      img.write(__dirname + '/tempfolder/output.png', (img)=>{
        console.log(img)
        res.sendFile(__dirname + '/tempfolder/output.png')
      })
    })
  })

});

app.get("*",(req,res)=>{

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
