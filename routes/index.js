var express = require('express');

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

// var fs = require('fs');
var router = express.Router();


var urlbase="https://www.staging.com.tw/"
var foldername = "text7"
var url1 = urlbase+foldername+"/index.html"
var url2 = urlbase+foldername+"/istaging3.plist"



var plist = {
	 filename : "istaging3.plist",
	 bundle_identifier : "com.istaging.istagingHomeProDist",
	 bundle_version : 1.5,
	 title : "istagingHomePro",
	 ipa :  "https://www.staging.com.tw/ipa/20160218istagingHomeIosPadUrlChange.ipa"
}

var html = {
	 filename : "index.html",
	 plist_url : url2
}

var generatePlistContect=function(plist){
	return  '<?xml version="1.0" encoding="UTF-8"?>\n\
	<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n\
	<plist version="1.0">\n\
	<dict>\n\
		<key>items</key>\n\
		<array>\n\
			<dict>\n\
				<key>assets</key>\n\
				<array>\n\
					<dict>\n\
						<key>kind</key>\n\
						<string>software-package</string>\n\
						<key>url</key>\n\
					  <string>'+plist.ipa+'</string>\n\
	        </dict>\n\
					<dict>\n\
						<key>kind</key>\n\
						<string>display-image</string>\n\
						<key>url</key>\n\
						<string>https://storage.googleapis.com/bundle_asia_dra/app/Logo.jpg</string>\n\
					</dict>\n\
					<dict>\n\
						<key>kind</key>\n\
						<string>full-size-image</string>\n\
						<key>url</key>\n\
						<string>https://storage.googleapis.com/bundle_asia_dra/app/Logo.jpg</string>\n\
					</dict>\n\
				</array>\n\
				<key>metadata</key>\n\
				<dict>\n\
					<key>bundle-identifier</key>\n\
					<string>'+plist.bundle_identifier+'</string>\n\
					<key>bundle-version</key>\n\
					<string>'+plist.bundle_version+'</string>\n\
					<key>kind</key>\n\
					<string>software</string>\n\
					<key>title</key>\n\
					<string>'+plist.title+'</string>\n\
				</dict>\n\
			</dict>\n\
		</array>\n\
	</dict>\n\
	</plist>'
}


var generateHtmlContect=function(html){
	return '<html>\n\
	  <head>\n\
	    <title>Istaging</title>\n\
	    <style>\n\
	    body { font-family: Helvetica, Arial, sans-serif; }\n\
	    div { width: 800px; height: 400px; margin: 40px auto; padding: 20px; border: 2px solid #5298fc; }\n\
	    h1 { font-size: 30px; margin: 0; }\n\
	    p { margin: 40px 0; }\n\
	    em { font-family: monospace; }\n\
	    a { color: #5298fc; text-decoration: none; }\n\
	    </style>\n\
	    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script> \n\
	    <script type="text/javascript">\n\
			$( document ).ready(function() {\n\
				window.location="itms-services://?action=download-manifest&url='+html.plist_url+'";\n\
			});\n\
		</script>\n\
	  </head>\n\
	  <body>\n\
	    <img src="msgImg2.png" alt="msgImg" width="422" height="243">\n\
	  </body>\n\
	</html>'
}
/* GET home page. */
router.get('/promise', function(req, res, next) {


	var dir ='./'+foldername
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}

	fs.writeFileAsync('./'+foldername+'/'+plist.filename, generatePlistContect(plist))
	.then(function(){
        return fs.writeFileAsync('./'+foldername+'/'+html.filename, generateHtmlContect(html))
    }).then(function(){
    	res.render('index', { title: foldername+" is created in promise" });
    }).catch(function(error){
    	res.render('index', { title: error });
	});
});

/* GET home page. */
router.get('/promise_parallel', function(req, res, next) {

	var pro = [];

	// var dir ='./'+foldername
	// if (!fs.existsSync(dir)){
	//     fs.mkdirSync(dir);
	// }

	pro.push(fs.writeFileAsync('./'+foldername+'/'+plist.filename, generatePlistContect(plist)))
	pro.push(fs.writeFileAsync('./'+foldername+'/'+html.filename, generateHtmlContect(html)))

	Promise.all(pro).then(function() {
    	res.render('index', { title: foldername+" is created in promise_parallel" });
	}).catch(function(error){
    	res.render('index', { title: error });
	});


});


router.get('/basic', function(req, res, next) {

	var dir ='./'+foldername
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}

	fs.writeFile('./'+foldername+'/'+plist.filename, generatePlistContect(plist), function (err) {
	    if (err) 
	        return console.log(err);
	    console.log('Hello World > helloworld.txt');


		fs.writeFile('./'+foldername+'/'+html.filename, generateHtmlContect(html), function (err) {
		    if (err) 
		        return console.log(err);
		    console.log('Hello World > helloworld2.txt');

			console.log('going to index');
			res.render('index', { title: foldername+" is created in basic" });
		});
	});

});

module.exports = router;
