/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

export const AWW_COMMAND = {
  name: 'awwww',
  description: 'Drop some cuteness on this channel.',
};

export const INVITE_COMMAND = {
  name: 'invite',
  description: 'Get an invite link to add the bot to your server',
};

export const RANDOMAGENT_COMMAND = {
  name: 'randomagent',
  description: 'Get a random game agent/character depending on game passed in.',
  options: [
    {
      name: 'game',
      description: 'A list of games to choose from.',
      type: 3,
      required: true,
      choices: [
        {
          name: 'Valorant',
          description:
            'Gets a random Valorant agent for your next roulette ranked game.',
          value: 'valorant',
        },
        {
          name: 'Marvel Rivals',
          description:
            'Gets a random Marval Rivals hero for your next roulette ranked game.',
          value: 'marvalrivals',
        },
      ],
    },
  ],
};

export const RANDOMNUM_COMMAND = {
  name: 'randomnumber',
  description: 'Gets a random integer. Default bound: [1, 6] (Dice Roll).',
  options: [
    {
      name: 'upper',
      description:
        'The upper bound for a random number to be chosen. Default value: 6',
      type: 4,
    },
    {
      name: 'lower',
      description:
        'The lower bound for the range a random number is to be chosen. Default value: 1',
      type: 4,
    },
  ],
};

export const WHOAMI_COMMAND = {
  name: 'whoami',
  description: 'Gets information about the user invoking this command.',
};

export const SAY_COMMAND = {
  name: 'say',
  description: 'Echos user input into the command.',
  options: [
    {
      name: 'message',
      description: 'User message to be echoed.',
      type: 3,
      required: true,
    },
  ],
};
