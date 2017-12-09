//已知一个 json 文件内容如下：

// {
//     "todos": ["吃饭", "睡觉", "打豆豆"]
//   }
// 调用该方法可以帮我把指定的数据存储到 json 文件中的 todos 中
 // 该方法肯定是异步的，所以无论操作成功与否你都必须告诉我
// err 是错误的标志，如果有错你就告诉我，如果没错就给我一个 null
// 那调用者就可以通过 err 参数来判定 addTodo 的操作结果到底成功与否


//加载核心模块
const fs=require('fs');
const http=require('http');

//自定义模块
const jsonFile='./02tools.json';

//创建服务器，获取实例对象
const server=http.createServer();

//监听request事件，设置世家你处理函数
server.on('request',(req,res)=>{
    //发送响应头，设置编码格式，解决乱码问题
    res.setHeader('Content-type','text/plain;charset=utf-8');
    //写一个方法，读取json文件中的内容（十六进制），将其转换为字符串格式，在转化为。。最终得到的结果为json文件中
    // 的数组对象
     
    //函数封装
    function addTodo(jsondata,callback){
        fs.readFile(jsonFile,(err,data)=>{
            if(err){
               return callback(err);
                // console.log('读取文件失败');
            }
            //如果读取成功，
            var dbData=JSON.parse(data.toString()); //{ todos: [ '吃饭', '睡觉', '打豆豆' ] }
            // callback(null,jsonData.todos);
            var newTodos=dbData.todos;  //数组
            newTodos.push(jsondata); //将要写入的代码追加到数组中

            //将要写入json文件的内容格式化为字符串
            const dbDataStr=JSON.stringify(dbData,null,2);
            fs.writeFile(jsonFile,dbDataStr,err=>{
                if(err){
                    return callback(err);
                }
                callback(null);
            })
            
        });
    }
    //调用函数
    // addTodo('写代码',err=>{
    //     if(err){
    //         return res.end('文件写入失败');
    //     }
    //         res.end('文件写入成功');
        
    // })
    addTodo('约会',err=>{
        if(err){
            return res.end('文件写入失败');
        }
            res.end('文件写入成功');
        
    })
    
});

//绑定端口号，启动服务器
server.listen(3000,()=>{
    console.log('server is running at port 3000');
});