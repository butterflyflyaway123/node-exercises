
const fs=require('fs');
const http = require('http');
const mime=require('mime');
const artTemplate=require('art-template');
const queryString=require('querystring');  //包名小写
const comment=require('./comment.js');

//方法1.解析执行字符串的方式展示列表 ============================

//方法2.采用artTemplate模板引擎展示评论列表


http.createServer((req, res) => {

    //响应数据
  
   const url=req.url;

   const method=req.method.toLowerCase();  //所有以回车结束的请求方式都为get方式，form为post提交

   //请求日志目录
   console.log(url,method);


   //首页
   if(method==='get' && url==='/'){

        fs.readFile('./views/index.html',(err,tpldata)=>{
            if(err){
                return res.end('404 Not Found...')
            }

            // data=data.toString(); //data为模板字符串，第二个参数为需要解析替换的对象
            // data=artTemplate.render(data,{
            //     comments:comments
            // });
           // data = data.toString()
                    // 第一个参数 data 是模板字符串
                    // 第二个参数对象是解析替换的对象
                  //  data = artTemplate.render(data, {
                    //  comments: comments
                  //  })

            //调用封装的函数-渲染首页,commet为自己写的模块
            comment.findAll((err,comments)=>{
                if(err){
                    return res.end('404 Not Found...')
                }
                //artTemplate得到render方法间返回渲染结果
                const htmlStr=artTemplate.render(tpldata.toString(),{
                    comments:comments 
                    //键名:键值(形参comments  对应 comment.js函数中解析完的评论内容)
                });
                 //发送响应头
            res.setHeader('Content-Type','text/html;charset=utf-8')
            res.end(htmlStr);

            });//end findAll
           
        })  //end readfile
    //发表页
   }else if(method==='get' && url==='/post'){

    fs.readFile('./views/post.html',(err,data)=>{
        if(err){
            return res.end('404 Not Found...')
        }
        //发送响应头
        res.setHeader('Content-Type','text/html;charset=utf-8')
        res.end(data);
    })  
    //开放公开目录public
        // 例如/public/css/main.css，如果用户请求了这样的公开数据，我们就将他显示出来，如果没有，就提示404错误
  }else if(method==='get' && (url.startsWith('/public/') || url.startsWith('/node_modules/'))){
            //在文件操作中，文件以/开头，表示绝对路径，以./开头表示相对路径
           // console.log(`.${url}`);
           const filePath=`.${url}`;
            fs.readFile(filePath,(err,data)=>{
                if(err){
                    return res.end('404 Not Found...')
                }
                //发送响应头-使用第三方包处理content-type问题，根据后缀名动态获取
                res.setHeader('Content-Type',mime.getType(filePath));
                res.end(data);
            })
        
           }else if(method==='post' && url=='/post'){
                // res.end('用户发表了留言');
                //1.接收表单post请求体的数据
                //客户的表单提交数据可能很大，需要分批次处理，--流
                let rawData='';  //定义变量用来存储拼接每次接收的数据
                let count=0;
                //相当于  function(chunk){},又因为 es6简介语法可以省略 ();
                req.on('data',chunk =>{  // 监听data事件  data事件 执行的次数与客户表单数据的多少有关，
                    //有时可能执行一次，有时可能执行多次，chunk为数据块
                   // console.log(++count);
                   rawData+=chunk;
                })

                req.on('end',() =>{
                   // console.log('数据接收完毕');
                   // console.log(data);
                    //2。使用核心模块queryString的pase方法将查询字符串转换为对象
                    const bodyData=queryString.parse(rawData);
                    console.log(bodyData);
                    //3.检验客户端提交的表单数据--h5验证功能不完善，但又因为客户端可以禁用js，从而js校验可能无效
                    // 3.1检验用户名是否非空
                    if(!bodyData.username || bodyData.username.length==0){
                        res.setHeader('Content-Type','text/plain;charset=utf-8');
                        return res.end('用户名 不能为空');
                    }
                    //3.2 校验留言内容是否可用
                    if(!bodyData.content || bodyData.content.length==0){
                        res.setHeader('Content-Type','text/plain;charset=utf-8');
                        return res.end('评论内容不能为空');
                    }
                    //4.校验通过，将数据添加到数组中存储起来，
                    //方法为调用封装的回调函数，将数据持久化保存到json 文件中
                    comment.save(bodyData,err=>{
                        if(err){
                            return res.end('500 Server err');
                        }
                         //如果保存（写入)成功，就重定向
                        res.statusCode=302;
                        res.setHeader('Location','/');  //跳转到首页
                        res.end(); 
                    });


                })
                //end end事件 

           }
           else{
            res.end('404 Not Found...');
           }
   

   //结束响应并发送数据，  一个请求只能响应一次
    // res.end('hello world'); ,readFile是异步的，所以不注释的时候先执行到此处

}).listen(3000, () => {

    console.log('server is running at port 80');

})