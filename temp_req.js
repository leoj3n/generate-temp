var template = '<strong>THIS IS TEMP</strong>';

function render(node){
	var tempDiv = document.createElement("div");
	tempDiv.className = "temp";
	tempDiv.innerHTML = template;

	node.innerHTML = "";
	node.appendChild(tempDiv);

	return tempDiv;
}

module.exports = function(node){
	render(node);
};
