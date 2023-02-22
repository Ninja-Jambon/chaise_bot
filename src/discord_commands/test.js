const { SlashCommandBuilder } = require("discord.js");

const test = new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command");

module.exports = { test };