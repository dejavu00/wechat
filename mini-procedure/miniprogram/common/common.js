console.log('common.js 被执行了');
for(var i=1;i<11;i++){
  var str='';
  for(var j =1;j<i+1;j++){
    str += `${j}*${i}=${i * j}`+',';
    console.log()
  }
  console.log(str)

}