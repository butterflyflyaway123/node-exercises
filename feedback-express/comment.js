

const fs=require('fs');

const dbPath='./db.json';

// 该文件提供对db.json文件操作的业务方法

//1.封装一个获取db.json文件数据的方法，返回值为comments数组
exports.findAll=(callback)=>{  //将该方法导处去（暴露），以供外面的文件使用

    //读取文件内容
    fs.readFile(dbPath,(err,data)=>{
        if(err){
            //错了，只需要传递一个参数,此时第二个参数为undefined
            return callback(err);
        }
        const comments=JSON.parse(data.toString()).comments; 
        //成功了，传递两个参数，因为不论失败或成功，err和comments 都是object类型，没法判断谁是正确的谁是错误的，
        //所以传递两个参数 ,正确的时候，错误对象为null,返回成功读取的结果
        callback(null,comments);
    });
}

//函数调用
// findAll((err,comments)=>{
//  if(err){
//      return console.log('findAll 方法调用失败');
//  }
//     console.log(comments);
// });

//2.封装一个方法可以持久化保存表单提交的数据到json文件的comments数组
exports.save =(bodyData,callback)=>{
    fs.readFile(dbPath,(err,data)=>{
        if(err){
            return callback(err);
        }
        const dbData=JSON.parse(data.toString()); //将json文件中的内容转为json对象
        const comments=dbData.comments;  //获取对象中的comments数组
        //将post表单页面的数据持久化存储到json文件中
        bodyData.id=comments[comments.length-1].id+1;
        comments.push(bodyData);  //将评论内容追加到数组中

        //将要写入json文件 的数据格式化为字符串
        const dbDataStr=JSON.stringify(dbData,null,4);
        fs.writeFile(dbPath,dbDataStr,err=>{
            if(err){
                return callback(err);
            }
            callback(null);  //没错，就空调用，因为此writeFile方法不需要结果
        });
    });
};