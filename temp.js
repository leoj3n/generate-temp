var tempReq = require("./temp_req");

module.exports = function(){
	var wrappers = [].slice.call(document.getElementsByClassName("wrapper"));
	wrappers.forEach(tempReq);
};
