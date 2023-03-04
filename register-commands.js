const {REST , Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
        name: 'gptrequest',
        description: 'Make a request to the GPT-3.5-Turbo API',
        options: [
            {
                name: 'question',
                description: 'The question you want to ask to the API',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },

    {
        name : 'info',
        description : 'utilise pas cette commande fdp',
    },

    {
        name : 'createconv',
        description : 'Create a new conversation',
        options : [
            {
                name : 'name',
                description : 'The name of the conversation',
                type : ApplicationCommandOptionType.String,
                required : true,
            },
        ],
    },

    {
        name : 'addconv',
        description : 'Add a conversation to the database',
        options : [
            {
                name : 'name',
                description : 'The name of the conversation',
                type : ApplicationCommandOptionType.String,
                required : true,    
            },
        ],
    },

    {
        name : 'delconv',
        description : 'Delete a conversation from the database',
        options : [
            {
                name : 'name',
                description : 'The name of the conversation',
                type : ApplicationCommandOptionType.String,
                required : true,
            },
        ],
    },

    {
        name : 'listconvs',
        description : 'List all the conversations in the database',
    },

    {
        name : 'addmsg',
        description : 'Add a message to a conversation',
        options : [
            {
                name : 'name',
                description : 'The name of the conversation',
                type : ApplicationCommandOptionType.String,
                required : true,
            },
            {
                name : 'message',
                description : 'The message to add to the conversation',
                type : ApplicationCommandOptionType.String,
                required : true,
            },
        ],
    },
    {
        name : 'displayconv',
        description : 'Display a conversation',
        options : [
            {
                name : 'name',
                description : 'The name of the conversation',
                type : ApplicationCommandOptionType.String,
                required : true,
            },
        ],
    },
    {
        name : 'getmyguota',
        description : 'Get your quota',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        /*await rest.put(
            Routes.applicationGuildCommands('1059559067846189067', '1062473997297668108'),
            { body: commands },
        );*/
        await rest.put(
            Routes.applicationGuildCommands('1059559067846189067', '1081560091951636481'),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();