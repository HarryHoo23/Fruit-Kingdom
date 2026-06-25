import { characters } from "../features/characters/characterData";
import type { Character } from "../types/domain";

export const characterService = {
  async listCharacters(): Promise<Character[]> {
    return characters;
  },

  async getCharacter(characterId: string): Promise<Character | undefined> {
    return characters.find((character) => character.id === characterId);
  },
};
