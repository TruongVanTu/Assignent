var express = require('express');
var router = express.Router();
var fs = require('fs') ;
var ddb ='mongodb+srv://huyanh0109:FjdksLKD324k43JJ$@cluster0.g4sai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
/* GET home page. */
var MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const {ObjectID: ObjectId} = require("mongodb");
var listproduct
var dbo

MongoClient.connect(ddb, function(err, db) {
    if (err) throw err;
    dbo = db.db("myFirstDatabase");
});
router.get('/', function(req, res, next) {
 var danhsach = [
    {name : 'Quang Huy' , sdt:'0337960001'},
    {name : 'Quang Huy' , sdt:'0337960001'},
    {name : 'Quang Huy' , sdt:'0337960001'},
    {name : 'Quang Huy' , sdt:'0337960001'}
 ]
    var array = [4,5,656,7,766,75,6765,7]

var thongTin = {
     name :' Quang Huy', sdt: '0337960001',danhsach : [
        {name : 'Quang Huy' , sdt:'0337960001'},
        {name : 'Quang Huy' , sdt:'0337960001'},
        {name : 'Quang Huy' , sdt:'0337960001'},
        {name : 'Quang Huy' , sdt:'0337960001'}
    ]
}




  res.render('index', { title: 'Home', danhsach : danhsach , array : array});





})
router.get('/product', function(req, res, next) {

        dbo.collection("wallpp").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            listproduct = result

        });
    res.render('product', { title: 'Product', list:listproduct });
})
router.get('/', function(req, res, next) {

    dbo.collection("wallpp").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        listproduct = result

    });
    res.render('index', { title: 'Product', list:listproduct });
})
router.get('/news', function(req, res, next) {
  res.render('news', { title: 'News' });
})
router.get('/link', function(req, res, next) {
  res.render('link', { title: 'Link' });
})
router.get('/download', function(req, res, next) {
  res.render('download', { title: 'Download' });
})
router.get('/add', function(req, res, next) {
    res.render('add', { title: 'Add' });
})
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if ( file.mimetype == "image/jpeg") {
            cb(null, 'uploads/');
        }
        else {
            cb(new Error('not image'), false);
        }
    },
    filename: function(req, file, cb) {
        var random = Math.random();
        cb(null, random + Date.now()  + file.originalname);
    },
});
var upload = multer({ storage: storage, limits: {
        fileSize: 2 * 1024 *1024
    } })
router.get('/upload', function(req, res, next) {
    res.render('upload', { message: '' });
})
router.post('/upload', upload.array('avatar',5), function(req, res,next) {
            res.render('upload', {message: "susses"})

        // req.files là một mảng của các file `photos`
        // req.body sẽ giữ thông tin gắn kèm (vd: text fields), nếu có
})
router.post('/update', function(req, res, next) {
    var namee = req.body.namee
    var contentt = req.body.contentt
    var linkk = req.body.linkk
    var datee = req.body.datee
    const ObjectId = require('mongodb').ObjectID;
    var myobj ={$set: {namee:namee,contentt:contentt,linkk:linkk,datee:datee}}
    dbo.collection("wallpp").updateOne({_id: ObjectId(req.body.idd)}, myobj, function(err,ress) {
            if (err) throw err;
                console.log("1 document updated");
                res.redirect("/product")
        })
})
    var Pschema = new mongoose.Schema({
        namee :'string',
        contentt: 'string',
       linkk: 'string',
        datee: 'string'
   })
    var Product = mongoose.model('wallpp', Pschema);

   router.post('/addP',function (req,ress) {
       var namee = req.body.namee
       var contentt = req.body.contentt
       var linkk = req.body.linkk
       var datee = req.body.datee
       var myobj = {namee:namee,contentt:contentt,linkk:linkk,datee:datee}
       dbo.collection("wallpp").insertOne(myobj, function(err, res) {
           if (err){
               throw err
               ress.redirect("/product")
           }else{
               console.log("1 document inserted");
           }
       })
       })
router.get("/update/:id",function (req,res){
    dbo.collection("wallpp").findOne({},function (err,char){
        if(err) throw  err
        else {
            console.log(req.params.id);
        }
    })
    res.render('update',{file: req.params.id});
})
router.get("/del/:id", function (req, res) {
    const ObjectId = require('mongodb').ObjectID;
    var id =req.params.id
    console.log(id)
    dbo.collection("wallpp").deleteOne({_id: ObjectId(req.params.id)}, function (error,ress) {
        if (error) {
            console.log(error)
        }else {
            res.redirect("/product")
        }
    })
})
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
})
router.get('/abc', function(req, res, next) {
  fs.readFile('Save/data.txt','utf8', (err, data) => {
      var databases = JSON.parse(data);
      if (err) {
          console.log(err);
      } else {
          console.log(data);
      }





    res.render('abc', { title: 'ABC', danhsach: databases});
  })
})
    router.post('/contact',function (request,response){
  var name = request.body.NamE;
  var email = request.body.Email;
  var subject = request.body.Subject;

      console.log(name)
      console.log(email)
      console.log(subject)

  fs.appendFile('Save/'+email+'.txt',name+'\n'+subject,function (error) {
  })
})


router.get('/getAll',function (req,res){
    Product.find({},function (err, data){
        res.render(data)
    })
})
module.exports = router;
