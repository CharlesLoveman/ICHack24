""" "Pokemon game logic."""

from dataclasses import dataclass
import os
import numpy as np
from bson.objectid import ObjectId
import random

from .env import PATH_TO_PUBLIC
from .attack import Attack, delete_attack, delete_attack_stat
from sharedTypes import PokemonStats
from typing import List, Self, Tuple
from .db import pokemon_collection, attack_stats_collection, players_collection
from .pokemon_constants import element_chart, element_options, stats_keys


@dataclass
class PokemonRelatedIds:
    stats_id: str


def delete_pokemon(id: str):
    pokemon, related_ids = Pokemon.load_preserving_ids(id)

    for attack in pokemon.attacks:
        delete_attack(attack.id)

    delete_attack_stat(related_ids.stats_id)

    # Delete image
    os.remove(PATH_TO_PUBLIC + pokemon.image_id)

    # Remove the pokemon from all players who have it
    players_collection.update_many({"pokemon_ids": id}, {"$pull": {"pokemon_ids": id}})

    pokemon_collection.delete_one({"_id": ObjectId(id)})

    return pokemon.name


class Pokemon:
    """Create a Pokemon, with description, battle statistics and an image id."""

    def __init__(
        self,
        name: str,
        description: str,
        element: str,
        stats: PokemonStats,
        attacks: List[Attack],
        image_id: str,
        original_image_id: str,
        id: str = "",
    ):
        self.name = name
        self.description = description
        self.element = element
        self.stats = stats
        self.attacks = attacks
        self.id = id
        self.image_id = image_id
        self.original_image_id = original_image_id

        if not isinstance(self.name, str):
            raise TypeError(
                f"Name must be a string, but {self.name} is a {type(self.name).__name__}"
            )

        if not isinstance(self.description, str):
            raise TypeError(
                f"Description must be a string, but {self.description} is a {type(self.description).__name__}"
            )

        if not isinstance(self.element, str):
            raise TypeError(
                f"Element must be a string, but {self.element} is a {type(self.element).__name__}"
            )
        if self.element not in element_options:
            self.element = random.choice(element_options)
            """raise ValueError(
                f"Element must be a valid element, but {self.element} is not"
            )"""

        if not isinstance(self.stats, dict):
            raise TypeError(
                f"Stats must be a dictionary, but {self.stats} is a {type(self.stats).__name__}"
            )
        if not len(self.stats) == 6:
            raise ValueError(
                f"Stats must have 6 values, but {len(self.stats)} were given: {self.stats}"
            )
        for key in self.stats.keys():
            if key not in stats_keys:
                raise ValueError(f"Stats must have valid keys, but {key} is not")
            if not isinstance(self.stats[key], int):
                raise TypeError(
                    f"Stats must have integer values, but the {key} stat is {self.stats[key]} is a {type(self.stats[key]).__name__}"
                )
            if (not 256 > self.stats[key]) or (not self.stats[key] > 0):
                raise ValueError(
                    f"Stats must have positive values less than 256, but the {key} stat is {self.stats[key]}"
                )

        if not isinstance(self.attacks, list):
            raise TypeError(
                f"Moves must be a list, but {self.attacks} is a {type(self.attacks).__name__}"
            )
        if not len(self.attacks) == 4:
            raise ValueError(
                f"Pokemon must have 4 attacks, but {len(self.attacks)} were given: {self.attacks}"
            )
        for attack in self.attacks:
            if not isinstance(attack, Attack):
                raise TypeError(
                    f"Moves must be a list of Move objects, but {attack} is a {type(attack).__name__}"
                )

        if not isinstance(self.image_id, str):
            raise TypeError(
                f"image should be of type string, not {type(self.image_id)}"
            )

    def __repr__(self):
        """Return a string representation of the Pokemon."""
        return f"Pokemon({repr(self.name)}, {repr(self.description)}, {repr(self.element)}, {repr(self.stats)}, {repr(self.attacks)}, {repr(self.image_id)})"

    def attack(self, attack: Attack, target: Self):
        """Hit the target Pokemon with an attack."""
        if not isinstance(attack, Attack):
            raise TypeError(
                f"Attack must be an Attack, but {attack} is a {type(attack).__name__}"
            )

        """
        if attack not in self.attacks:
            raise ValueError(
                f"Chosen attack must be one of the Pokemon's attacks, but {attack} is not"
            )
        """
        if not isinstance(target, Pokemon):
            raise TypeError(
                f"Target must be a Pokemon, but {target} is a {type(target).__name__}"
            )

        if attack.power:
            # calculate elemental multipliers
            attack_element_boost = 1
            ind_self = element_options.index(self.element)
            ind_target = element_options.index(target.element)
            target_element_boost = element_chart[ind_self, ind_target]
            if attack.element == self.element:
                attack_element_boost = 1.5

            # calculate hp damage
            atk = self.stats["attack"]
            dfs = target.stats["defence"]
            if attack.special:
                atk = self.stats["special_attack"]
                dfs = target.stats["special_defence"]
            damage = int(
                2
                / 5
                * attack.power
                * (atk / dfs)
                * attack_element_boost
                * target_element_boost
                * np.random.uniform(217, 256)
                / 255
            )
            crit = np.random.uniform(0, 1)
            if crit < 0.05:
                damage *= 1.5

            # apply damage
            target.stats["hp"] -= damage

        if not len(attack.self_status) == 0:
            for key in attack.self_status.keys():
                self.stats[key] += attack.self_status[key]

        if not len(attack.target_status) == 0:
            for key in attack.target_status.keys():
                target.stats[key] = max(
                    1, target.stats[key] + attack.target_status[key]
                )

        if target.stats["hp"] < 0:
            target.stats["hp"] = 0

        if self.stats["hp"] < 0:
            self.stats["hp"] = 0

    def save(self) -> str:
        """Save a Pokemon object to the database.

        Args:
            db (database): MongoDB database

        Returns:
            id (str): the id where the Pokemon is located in the database
        """
        attack_ids = [attack.save() for attack in self.attacks]
        stats_id = str(attack_stats_collection.insert_one(self.stats).inserted_id)

        return str(
            pokemon_collection.insert_one(
                {
                    "name": self.name,
                    "description": self.description,
                    "element": self.element,
                    "stats_id": stats_id,
                    "attack_ids": attack_ids,
                    "image_id": self.image_id,
                    "original_image_id": self.original_image_id,
                }
            ).inserted_id
        )

    @classmethod
    def load_preserving_ids(cls, id: str) -> Tuple[Self, PokemonRelatedIds]:
        """Load a Pokemon object from the database.

        Args:
            id (str): the Pokemon id to load

        Returns:
            pokemon (Pokemon): the resulting Pokemon object
        """
        pokemon = pokemon_collection.find_one({"_id": ObjectId(id)})
        if pokemon is None:
            raise KeyError(f"No Pokemon with the id {repr(id)} was found.")

        stats_id = pokemon["stats_id"]
        stats = attack_stats_collection.find_one({"_id": ObjectId(stats_id)})
        if stats is None:
            raise KeyError(f"No Stats object with the id {repr(stats_id)} was found.")

        stats.pop("_id")

        attacks = [Attack.load(attack_id) for attack_id in pokemon["attack_ids"]]

        image_id = pokemon["image_id"]
        original_image_id = pokemon["original_image_id"]

        return Pokemon(
            pokemon["name"],
            pokemon["description"],
            pokemon["element"],
            stats,
            attacks,
            image_id,
            original_image_id,
            id,
        ), PokemonRelatedIds(stats_id)

    @classmethod
    def load(cls, id: str):
        return cls.load_preserving_ids(id)[0]
