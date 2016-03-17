var s="askenhwowdmjajqqowprkcka";
var a=s.split(''),count={};
for(var i=0;i<a.length;i++){
	if(!count[a[i]]){
		// var reg = "/"+a[i]+"/ig";
		// var re = new RegExp("$",a[i]); 
		var t=s.match(eval("/"+a[i]+"/ig"));
		console.log( t);
		// count[a[i]]=
	}
}
console.log( count );