import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config({ path: '.dev.vars' });
const token = process.env.DISCORD_TOKEN;

if (!token) {
    throw new Error('The DISCORD_TOKEN environment variable is required.');
  }

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    console.log('bot is ready');
})

client.login(token)