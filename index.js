const Command = require('command'),
		path = require('path'),
		fs = require('fs')
		
module.exports = function NameChanger(dispatch) {
	const command = Command(dispatch)
	
	let newName = null,
		enabled = true,
		originalName = null;
	
	try {
		newName = require('./name.json')
	}
	catch(e) {}

	command.add('name', str => {
		if(!str){
			command.message('Name: '+str+' is invalid.');
		}
		else if(str){
		command.message('Name: '+str);
		newName = str;
		saveName();
		}
	});
	
	command.add('togglename', () => {
		if(!enabled){
			command.message('NameChanger enabled');
			enabled = true;
		}
		else if(enabled){
			command.message('NameChanger disabled');
			enabled = false;
		}
	});
	
	dispatch.hook('S_LOGIN', 2, event => {
		if(enabled && newName) {
			originalName = event.name;
			event.name = newName;
			return true;
		}
		return
	});
	
	dispatch.hook('C_SHOW_ITEM_TOOLTIP_EX', 1, event => {
		if(enabled && newName) {
			event.name = originalName;
			return true;
		}
		return
	});
	
	function saveName() {
		fs.writeFileSync(path.join(__dirname, 'name.json'), JSON.stringify(newName))
	}
}
