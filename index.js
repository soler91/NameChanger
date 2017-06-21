const Command = require('command'),
		path = require('path'),
		fs = require('fs')
		
module.exports = function NameChanger(dispatch) {
	const command = Command(dispatch)
	
	let newName = null,
		enabled = true,
		originalName = null;
		character = [];
		pId=null;
	
	try {
		character = require('./name.json')
	}
	catch(e) {}

	command.add('name', str => {
		if(!str){
			command.message('Name: '+str+' is invalid.');
		}
		else if(str){
		command.message('Name: '+str);
		AddAlias(str);
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
		AddCharacter(event.playerId.toString(), event.name);
		pId = event.playerId.toString();
		if(enabled && newName) {
			originalName = event.name;
			event.name = newName;
			return true;
		}
		return
	});
	
	dispatch.hook('S_CHAT', 1, event => {
		if(enabled && newName) {
			if(event.authorName == originalName) {
				event.authorName = newName;
				return true;
			}
		}
		return
	});
	
	dispatch.hook('S_WHISPER', 1, event => {
		if(enabled && newName) {
			if(event.author == originalName) {
				event.author = newName;
				return true;
			}
		}
	});
	
	dispatch.hook('C_SHOW_ITEM_TOOLTIP_EX', 1, event => {
		if(enabled && newName) {
			event.name = originalName;
			return true;
		}
		return
	});
	
	function AddCharacter(playerId, name){
	let match = false;
		for(let i in character){
			if(character[i].playerId == playerId){
				newName = character[i].alias;
				match = true;
			}
		}
		if(!match){
			character.push({
				playerId : playerId,
				name : name,
				alias : ''
				});
				newName = '';
			saveName();
		}
	}
	
	function AddAlias(alias){
		for(let l in character){
			if(character[l].playerId == pId){
				character[l].alias = alias;
				newName = character[l].alias;
			}
		}
		saveName();
	}
	
	function saveName() {
		fs.writeFileSync(path.join(__dirname, 'name.json'), JSON.stringify(character))
	}
}
