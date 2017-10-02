"use strict";

const log = require('loglevel').getLogger('DoneCommand'),
	Commando = require('discord.js-commando'),
	Gym = require('../../app/gym'),
	Raid = require('../../app/raid'),
	settings = require('../../data/settings'),
	Utility = require('../../app/utility');

class DirectionsCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'where',
			group: 'basic-raid',
			memberName: 'where',
			aliases: ['directions'],
			description: 'Requests an image of the gym\'s location and a link for directions to get there.',
			details: 'Use this command get directions to the raid\'s location.',
			examples: ['\t!where', '\t!directions'],
			guildOnly: true
		});

		client.dispatcher.addInhibitor(message => {
			if (!!message.command && message.command.name === 'where' &&
				!Raid.validRaid(message.channel.id)) {
				return ['invalid-channel', message.reply('Ask for directions to a raid from its raid channel!')];
			}
			return false;
		});
	}

	async run(message, args) {
		const raid = Raid.getRaid(message.channel.id),
			gym_id = raid.gym_id,
			gym = Gym.getGym(gym_id);

		message.channel.send(`https://www.google.com/maps/dir/Current+Location/${gym.gymInfo.latitude},${gym.gymInfo.longitude}`, {
			files: [
				`${settings.gym_map_directory}${gym_id}.png`
			]
		})
			.catch(err => log.error(err));

		Utility.cleanConversation(message);
	}
}

module.exports = DirectionsCommand;