export async function getValorantAgent() {
  const response = await fetch(valorantAgentsAPI);

  if (!response.ok) {
    let errorText = `Error fetching ${valorantAgentsAPI}: ${response.status} ${response.error}`;
    throw new Error(errorText);
  }

  const data = await response.json();
  const agents = data.data.map((agent) => {
    return agent.displayName;
  });
  const randomIndex = Math.floor(Math.random() * agents.length);
  const randomAgent = agents[randomIndex];
  return randomAgent;
}

export async function getRivalsHero() {
  const response = await fetch(mrHeroesAPI);

  if (!response.ok) {
    let errorText = `Error fetching ${mrHeroesAPI}: ${response.status} ${response.error}`;
    throw new Error(errorText);
  }

  const data = await response.json();
  const heroes = data.map((hero) => {
    return hero.title;
  });
  const randomIndex = Math.floor(Math.random() * heroes.length);
  const randomHero = heroes[randomIndex];
  return randomHero;
}

export const valorantAgentsAPI =
  'https://valorant-api.com/v1/agents?isPlayableCharacter=True';
export const mrHeroesAPI = 'https://mrapi.org/api/heroes';
