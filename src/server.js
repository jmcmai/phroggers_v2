/**
 * The core server that runs on a Cloudflare worker.
 */

import { AutoRouter } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import {
  AWW_COMMAND,
  INVITE_COMMAND,
  WHOAMI_COMMAND,
  SAY_COMMAND,
  RANDOMAGENT_COMMAND,
  RANDOMNUM_COMMAND,
} from './commands.js';
import { getRedditURL } from './reddit.js';
import { getValorantAgent, getRivalsHero } from './gameAgents.js';
import { InteractionResponseFlags } from 'discord-interactions';

class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

const router = AutoRouter();

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * Main route for all requests sent from Discord.  All incoming messages will
 * include a JSON payload described here:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
router.post('/', async (request, env) => {
  const { isValid, interaction } = await server.verifyDiscordRequest(
    request,
    env,
  );
  if (!isValid || !interaction) {
    return new Response('Bad request signature.', { status: 401 });
  }

  if (interaction.type === InteractionType.PING) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // Most user commands will come as `APPLICATION_COMMAND`.
    switch (interaction.data.name.toLowerCase()) {
      case AWW_COMMAND.name.toLowerCase(): {
        const cuteUrl = await getRedditURL('cute');
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: cuteUrl,
          },
        });
      }
      case RANDOMAGENT_COMMAND.name.toLowerCase(): {
        switch (interaction.data.options[0].value) {
          case 'valorant': {
            const valAgent = await getValorantAgent();
            return new JsonResponse({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `Your random Valorant agent is: ${valAgent}.`,
              },
            });
          }

          case 'marvalrivals': {
            const mrHero = await getRivalsHero();
            return new JsonResponse({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `Your random Marval Rivals hero is: ${mrHero}.`,
              },
            });
          }

          default: {
            return new JsonResponse({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `uh oh stinky...`,
              },
            });
          }
        }
      }
      case RANDOMNUM_COMMAND.name.toLowerCase(): {
        let upperObj;
        let lowerObj;

        if ('options' in interaction.data) {
          upperObj = interaction.data.options.find(
            (option) => option.name === 'upper',
          );
          lowerObj = interaction.data.options.find(
            (option) => option.name === 'lower',
          );
        }

        const max = upperObj ? upperObj.value : 6;
        const min = lowerObj ? lowerObj.value : 1;

        const randNum = Math.floor(Math.random() * (max - min + 1)) + min;

        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Your random number is ${randNum}.`,
          },
        });
      }
      case INVITE_COMMAND.name.toLowerCase(): {
        const applicationId = env.DISCORD_APPLICATION_ID;
        const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands+bot`;
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: INVITE_URL,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
      case WHOAMI_COMMAND.name.toLowerCase(): {
        const dateJoined = new Date(interaction.member.joined_at);
        const dateString = dateJoined.toLocaleString();
        const content = interaction.member.user.global_name
          ? `You are ${interaction.member.user.username} (${interaction.member.user.global_name}), who joined this server on ${dateString}`
          : `You are ${interaction.member.user.username}, who joined this server on ${dateString}`;
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: content,
          },
        });
      }
      case SAY_COMMAND.name.toLowerCase(): {
        const message = interaction.data.options[0].value;
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: message,
          },
        });
      }
      default:
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }
  }

  console.error('Unknown Type');
  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});
router.all('*', () => new Response('Not Found.', { status: 404 }));

async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
  if (!isValidRequest) {
    return { isValid: false };
  }

  return { interaction: JSON.parse(body), isValid: true };
}

const server = {
  verifyDiscordRequest,
  fetch: router.fetch,
};

export default server;
