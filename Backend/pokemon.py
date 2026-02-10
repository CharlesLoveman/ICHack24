""" "Pokemon game logic."""

from dataclasses import dataclass
import os
import numpy as np
from bson.objectid import ObjectId
import random

from .env import PATH_TO_PUBLIC
from .attack import Attack, delete_attack, delete_attack_stats, get_stats_keys
from sharedTypes import IPokemon, PokemonStats
from typing import List, Self, cast
from .db import (
    OptionalDBStats,
    get_pokemon_from_id,
    pokemon_collection,
    attack_stats_collection,
    players_collection,
)
from .pokemon_constants import element_chart, element_options, stats_keys


@dataclass
class PokemonRelatedIds:
    """Data class for holding IDs related to a Pokemon."""

    stats_id: str


def delete_pokemon(id: str):
    """Delete a Pokemon and its associated data (attacks, stats, image) from the database.

    Args:
        id (str): The ObjectId of the Pokemon to delete.

    Raises:
        Exception: If any part of the deletion process fails, returning a list of failures.
    """
    pokemon = Pokemon.load(id)

    failures = []

    for attack in pokemon.attacks:
        try:
            delete_attack(attack.id)
        except:
            failures.append(f"Failed to delete attack {attack.id}")
    try:
        delete_attack_stats(pokemon.stats["id"])
    except:
        failures.append(f"Failed to delete stats {pokemon.stats['id']}")

    try:
        # Delete image, but we don't delete anything in the protected folder
        if pokemon.image_id.find("protected") == -1:
            os.remove(PATH_TO_PUBLIC + pokemon.image_id)
    except:
        failures.append(f"Failed to delete image {pokemon.image_id}")

    # Remove the pokemon from all players who have it
    players_collection.update_many({"pokemon_ids": id}, {"$pull": {"pokemon_ids": id}})

    try:
        pokemon_collection.delete_one({"_id": ObjectId(id)})
    except:
        failures.append(f"Failed to finally delete pokemon {id}")

    if len(failures) > 0:
        raise Exception(failures)


class Pokemon:
    """Represents a Pokemon entity with stats, attacks, and metadata."""

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
        """Initialise a Pokemon.

        Args:
            name (str): The name of the Pokemon.
            description (str): The Pokedex description.
            element (str): The elemental type.
            stats (PokemonStats): The base stats.
            attacks (List[Attack]): A list of 4 Attack objects.
            image_id (str): The path/ID of the generated image.
            original_image_id (str): The path/ID of the original uploaded image.
            id (str, optional): The database ID. Defaults to "".

        Raises:
            TypeError: If arguments are of incorrect types.
            ValueError: If arguments have invalid values (e.g. stats out of range).
        """
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
        for key in stats_keys:
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
        """Execute an attack against a target Pokemon.

        Calculates damage based on stats, element multipliers, and randomness.
        Applies status effects if applicable.

        Args:
            attack (Attack): The attack being used.
            target (Pokemon): The target Pokemon.

        Raises:
            TypeError: If arguments are not of the expected types.
        """
        if not isinstance(attack, Attack):
            raise TypeError(
                f"Attack must be an Attack, but {attack} is a {type(attack).__name__}"
            )

        if not isinstance(target, Pokemon):
            raise TypeError(
                f"Target must be a Pokemon, but {target} is a {type(target).__name__}"
            )

        if self.stats["hp"] == 0:
            print(f"Dead Pokemon ${self.name} cannot attack.")
            return

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
            if attack.category:
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
            target.stats["hp"] -= int(damage)

        if not len(attack.self_status) == 0:
            for key in get_stats_keys(attack.self_status):
                self.stats[key] += attack.self_status[key]

        if not len(attack.target_status) == 0:
            for key in get_stats_keys(attack.target_status):
                target.stats[key] = max(
                    1, target.stats[key] + attack.target_status[key]
                )

        if target.stats["hp"] < 0:
            target.stats["hp"] = 0

        if self.stats["hp"] < 0:
            self.stats["hp"] = 0

    def to_interface(self):
        """Convert the Pokemon instance to an IPokemon interface dictionary.

        Returns:
            IPokemon: The dictionary representation of the Pokemon.
        """
        ipokemon: IPokemon = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "element": self.element,
            "stats": self.stats,
            "attacks": [attack.to_interface() for attack in self.attacks],
            "image_id": self.image_id,
            "original_image_id": self.original_image_id,
        }

        return ipokemon

    def save(self) -> str:
        """Save the Pokemon and its components to the database.

        Returns:
            str: The ObjectId of the saved Pokemon document.
        """
        self.stats
        attack_ids = [attack.save() for attack in self.attacks]
        stats_id = str(
            attack_stats_collection.insert_one(
                cast(OptionalDBStats, self.stats)
            ).inserted_id
        )

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
    def load(cls, id: str):
        """Load a Pokemon from the database by ID.

        Args:
            id (str): The ObjectId of the Pokemon to load.

        Returns:
            Pokemon: The loaded Pokemon instance.
        """
        pokemon = get_pokemon_from_id(id)

        attacks = [Attack.from_interface(attack) for attack in pokemon["attacks"]]

        return cls(
            pokemon["name"],
            pokemon["description"],
            pokemon["element"],
            pokemon["stats"],
            attacks,
            pokemon["image_id"],
            pokemon["original_image_id"],
            id,
        )
