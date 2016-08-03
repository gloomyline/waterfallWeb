////引入mongoose模块
var db = require('mongoose');

var express = require('express');

var bodyParser = require('body-parser');

var app = express()

//// 链接数据库 mongodb 协议, localhost 主机ip, student_db 数据库名称
db.connect('mongodb://localhost/book_db');

var Book = db.model('book',{
  bookName:{type:String,required:true},
  author:{type:String,default:""},
  cate:{type:String,default:""},
  imgUrl:{type:String,default:""},
  create_time:{type:Date,default:Date.now},
  update_time:{type:Date,default:Date.now}
})

app.use(express.static('./public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 浏览器访问地址 'http://localhost/api/book' + page
app.get('/api/book/:page',(req,res)=>{
  var page = req.params.page;
  page = Number(page) || 1;
  // 代表每一页显示的数量
  var pageSize = 16;
  Book.find().count((err,totalCount)=>{
    if(err){
    }
    else{
      var pageCount = Math.ceil(totalCount / pageSize);
      if(pageCount < page){
        res.json({status:"n",msg:"已到最后一页"})
      }
      else{
        Book.find().skip((page - 1) * pageSize).limit(pageSize).exec((err,data)=>{
          if(err){
            res.json({status:"n",msg:"返回数据失败"})
          }
          else{
            res.json({status:"y",msg:"返回数据成功",data:data})
          }
        })
      }
    }
  })
})

app.get('/home/login',(req,res) => {
  console.log('这里是登陆页面！')
  res.send('用户登录！')
})

app.all('/admin/*',(req,res,next) => {
  console.log('正在访问管理后台的路径')
  next()
})

app.get('/admin/student',(req,res) => {
  res.send('学生信息管理')
})

app.get('/admin/admin_user',(req,res) => {
  res.send('管理员信息管理')
})


app.get('/admin/school_class',(req,res) => {
  res.send('班级信息管理')
})

app.listen(3000,function(){
  console.log('服务器运行中...')
})
