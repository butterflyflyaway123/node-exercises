
//文件引入
//0.加载express
const express=require('express');
const expressArtTemplate=require('express-art-template');
const comment=require('./comment.js'); //建议不屑后缀
const bodyParser = require('body-parser'); //解析post表单提交的数据




//1.调用express()得到app
const app=express();

//开放统一静态资源目录--把node_modules目录开放出来
 app.use('/node_modules/',express.static('./node_modules/'));

 //配置使用artTemplate模板引擎，res.render()默认会找到views目录中查找指定的文件
app.engine('html',expressArtTemplate );

//配置bodyParser,req请求对象会多出一个属性:body,可以直接通过req.body来获取表单post请求体的数据了
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

//2.基本路由配置，设置请求对应的处理函数
app.get('/',(req,res)=>{

    // 首页展示
    //调用回调函数
    comment.findAll((err,comments)=>{

        if(err){
            return console.log('数据读取失败');
        }

        res.render('index.html',{
            comments:comments    //es6简写--相当于comments:comments
        });

    });
  
});

 //展示发表页
 app.get('/post',(req,res)=>{
    res.render('post.html');
 });

 //接收post表单页提交的数据
app.post('/post',(req,res)=>{
    //验证
    if(!req.body.name || !req.body.name.length){
        return res.send('用户名不能为空');
    }
    if(!req.body.content || !req.body.content.length){
        return res.send('评论内容不能为空');
    }

    // 通过req.body可以直接获取表单提交的数据
     //调用回调函数--持久化存储提交的数据
     comment.save(req.body,err=>{
         if(err){
             return res.end('500 server error');
         }
         //发送响应。express 为res 提供了一个redirect方法可以实现页面的重定向
         console.log(1);
         res.redirect('/');
     });
});


//3.监听端口号，启动web服务
app.listen(3000,()=>{
    console.log('app is listening on port 3000');
});