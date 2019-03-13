const fs = require('fs');
const path = require('path');

function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}

function mkdir(dirpath,dirname){
  //判断是否是第一次调用
  if(typeof dirname === "undefined"){ 
    if(fs.existsSync(dirpath)){
      return;
    }else{
      mkdir(dirpath,path.dirname(dirpath));
    }
  }else{
    //判断第二个参数是否正常，避免调用时传入错误参数
    if(dirname !== path.dirname(dirpath)){ 
      mkdir(dirpath);
      return;
    }
    if(fs.existsSync(dirname)){
      fs.mkdirSync(dirpath)
    }else{
      mkdir(dirname,path.dirname(dirname));
      fs.mkdirSync(dirpath);
    }
  }
}

function error(err,info) {
  console.error(info,err)
}

function writeFile(dirpath, data) {
  mkdir(path.dirname(dirpath))
  fs.writeFile(dirpath, data, function (err) {
    if(err){
      error(err,'写入文件失败')
    }else{
    }
  })
}

module.exports = {
  mkdir,delDir,error,writeFile
};