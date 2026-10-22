import bug from "../asserts/images/types-icon/bug.png";
import dark from "../asserts/images/types-icon/dark.png";
import water from "../asserts/images/types-icon/water.png";
import fire from "../asserts/images/types-icon/fire.png";
import electric from "../asserts/images/types-icon/electric.png";
import grass from "../asserts/images/types-icon/grass.png";
import rock from "../asserts/images/types-icon/rock.png";
import ground from "../asserts/images/types-icon/ground.png";
import fairy from "../asserts/images/types-icon/fairy.png";
import psychic from "../asserts/images/types-icon/psychic.png";
import flying from "../asserts/images/types-icon/flying.png";
import steel from "../asserts/images/types-icon/steel.png";
import fighting from "../asserts/images/types-icon/fighting.png";
import normal from "../asserts/images/types-icon/normal.png";
import ice from "../asserts/images/types-icon/ice.png";
import poison from "../asserts/images/types-icon/poison.png";
import dragon from "../asserts/images/types-icon/dragon.png";
import ghost from "../asserts/images/types-icon/ghost.png";
import type { FilterState } from "../redux/reducers/filters";

interface PokeApiListResponse {
  results: Array<{ name: string }>;
}

interface PokeApiPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
  };
  stats: Array<{ base_stat: number }>;
  types: Array<{ type: { name: string } }>;
}

interface PokeApiTypeResponse {
  pokemon: Array<{ pokemon: { name: string } }>;
}

export interface PokemonData {
  name: string;
  sprites: PokeApiPokemon["sprites"];
  stats: PokeApiPokemon["stats"];
  types: PokeApiPokemon["types"];
  legendary: boolean;
  price_default: string;
  price_shiny: string;
}

const requestOptions: RequestInit = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};

const legendaryIds = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251];
for (let id = 377; id <= 386; id += 1) legendaryIds.push(id);
for (let id = 480; id <= 493; id += 1) legendaryIds.push(id);
for (let id = 638; id <= 649; id += 1) legendaryIds.push(id);
for (let id = 716; id <= 721; id += 1) legendaryIds.push(id);
for (let id = 785; id <= 809; id += 1) legendaryIds.push(id);

const regions = {
  Kanto: { offset: 0, limit: 151 },
  Johto: { offset: 151, limit: 100 },
  Hoenn: { offset: 251, limit: 135 },
  Sinnoh: { offset: 386, limit: 107 },
  Unova: { offset: 493, limit: 156 },
  Kalos: { offset: 649, limit: 72 },
  Alola: { offset: 721, limit: 86 },
} satisfies Record<string, { offset: number; limit: number }>;

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    throw new Error(`PokéAPI request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function getPokeData(pokeName: string): Promise<PokemonData> {
  const pokeData = await getJson<PokeApiPokemon>(
    `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokeName)}`,
  );
  const legendary = legendaryIds.includes(pokeData.id);
  const averageStat =
    pokeData.stats.reduce((total, stat) => total + stat.base_stat, 0) / 6;
  const legendaryMultiplier = legendary ? 5 : 1;
  const priceDefault = ((averageStat ** 3 * legendaryMultiplier) / 10000).toFixed(2);

  return {
    name: titleCase(pokeData.name),
    sprites: pokeData.sprites,
    stats: pokeData.stats,
    types: pokeData.types,
    legendary,
    price_default: priceDefault,
    price_shiny: (Number(priceDefault) * 20).toFixed(2),
  };
}

export async function getFilteredPokeList(
  filters: FilterState | null,
): Promise<string[]> {
  if (filters === null) {
    const data = await getJson<PokeApiListResponse>(
      "https://pokeapi.co/api/v2/pokemon?limit=151",
    );
    return data.results.map((pokemon) => pokemon.name);
  }

  if (filters.searchName !== null && filters.searchName.trim() !== "") {
    try {
      const data = await getJson<PokeApiPokemon>(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(filters.searchName.trim())}`,
      );
      return [data.name];
    } catch {
      return [];
    }
  }

  const lists = await getPreFilteredData(filters);
  return intersection(...lists);
}

async function getPreFilteredData(filters: FilterState): Promise<string[][]> {
  const requests = Object.entries(filters).map(async ([filter, value]) => {
    if (value === null) return [];

    if (filter === "type_1" || filter === "type_2") {
      const data = await getJson<PokeApiTypeResponse>(
        `https://pokeapi.co/api/v2/type/${encodeURIComponent(value)}`,
      );
      return data.pokemon.map(({ pokemon }) => pokemon.name);
    }

    if (filter === "region" && value in regions) {
      const { offset, limit } = regions[value as keyof typeof regions];
      const data = await getJson<PokeApiListResponse>(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
      );
      return data.results.map((pokemon) => pokemon.name);
    }

    return [];
  });

  return Promise.all(requests);
}

function intersection(...lists: string[][]): string[] {
  const nonEmptyLists = lists.filter((list) => list.length > 0);
  if (nonEmptyLists.length === 0) return [];
  return nonEmptyLists.slice(1).reduce(
    (matches, list) => matches.filter((name) => list.includes(name)),
    [...nonEmptyLists[0]],
  );
}

export function getTypesList(): string[] {
  return [
    "bug",
    "dark",
    "water",
    "fire",
    "electric",
    "grass",
    "rock",
    "ground",
    "fairy",
    "psychic",
    "flying",
    "steel",
    "fighting",
    "normal",
    "ice",
    "poison",
    "dragon",
    "ghost",
  ].sort();
}

export function getTypesIcon(): Record<string, string> {
  return {
    bug,
    dark,
    water,
    fire,
    electric,
    grass,
    rock,
    ground,
    fairy,
    psychic,
    flying,
    steel,
    fighting,
    normal,
    ice,
    poison,
    dragon,
    ghost,
  };
}
