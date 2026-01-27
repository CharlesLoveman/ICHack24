import numpy as np
from bson.objectid import ObjectId
from typing import Dict
from .db import (
    attacks_collection,
    attack_stats_collection,
)
from .pokemon_constants import element_chart, element_options, stats_keys


class Attack:
    """Create an attack, to be called when a Pokemon attacks."""

    def __init__(
        self,
        name: str,
        element: str,
        power: int = 0,
        special: bool = False,
        self_status: Dict[str, int] = {},
        target_status: Dict[str, int] = {},
        id: str = "",
    ):
        """Create an attack with a name, element and optional power and status effects."""
        self.name = name
        self.element = element
        self.power = power
        self.special = special
        self.self_status = self_status
        self.target_status = target_status
        self.id = id

        if not isinstance(self.name, str):
            raise TypeError(
                f"Name must be a string, but {self.name} is a {type(self.name).__name__}"
            )

        if not isinstance(self.element, str):
            raise TypeError(
                f"Element must be a string, but {self.element} is a {type(self.element).__name__}"
            )
        if self.element not in element_options:
            raise ValueError(
                f"Element must be a valid element, but {self.element} is not"
            )

        if not isinstance(self.power, int):
            raise TypeError(
                f"Power must be an integer, but {self.power} is a {type(self.power).__name__}"
            )
        if (not 385 > self.power) or (not self.power >= 0):
            raise ValueError(
                f"Power must be a non-negative value less than 385, but {self.power} is not"
            )

        if not isinstance(self.special, bool):
            raise TypeError(
                f"Special must be a boolean, but {self.special} is a {type(self.special).__name__}"
            )

        if not isinstance(self.self_status, dict):
            raise TypeError(
                f"Status must be a dictionary, but {self.self_status} is a {type(self.self_status).__name__}"
            )
        for key in self.self_status.keys():
            if key not in stats_keys:
                raise ValueError(f"Status must have valid keys, but {key} is not")
            if not isinstance(self.self_status[key], int):
                raise TypeError(
                    f"Status effect value must be an integer, but the {key} status {self.self_status[key]} is a {type(self.self_status[key]).__name__}"
                )
            if (not 128 > self.self_status[key]) or (not self.self_status[key] > -128):
                raise ValueError(
                    f"Status effect values must be positive and less than 128, but the {key} status is {self.self_status[key]}"
                )

        if not isinstance(self.target_status, dict):
            raise TypeError(
                f"Status must be a dictionary, but {self.target_status} is a {type(self.target_status).__name__}"
            )
        for key in self.target_status.keys():
            if key not in stats_keys:
                raise ValueError(f"Status must have valid keys, but {key} is not")
            if not isinstance(self.target_status[key], int):
                raise TypeError(
                    f"Status effect value must be an integer, but the {key} status {self.target_status[key]} is a {type(self.target_status[key]).__name__}"
                )
            if (not -128 < self.target_status[key]) or (
                not self.target_status[key] < 128
            ):
                raise ValueError(
                    f"Status effect values must be positive and less than 128, but the {key} status is {self.target_status[key]}"
                )

    def __repr__(self):
        """Return a string representation of the Attack."""
        return f"Attack({repr(self.name)}, {repr(self.element)}, {repr(self.power)}, {repr(self.special)}, {repr(self.self_status)}, {repr(self.target_status)})"

    def save(self) -> str:
        """Save an Attack object to the database.

        Args:
            db (database): MongoDB database

        Returns:
            id (str): the id where the Attack is located in the database
        """

        stats_object_ids = attack_stats_collection.insert_many(
            [self.self_status, self.target_status]
        ).inserted_ids
        stats_ids = [str(object_id) for object_id in stats_object_ids]

        return str(
            attacks_collection.insert_one(
                {
                    "name": self.name,
                    "element": self.element,
                    "power": self.power,
                    "special": self.special,
                    "self_status_id": stats_ids[0],
                    "target_status_id": stats_ids[1],
                }
            ).inserted_id
        )

    @classmethod
    def load(cls, id: str) -> "Attack":
        """Load an Attack object from the database.

        Args:
            db (database): MongoDB database
            id (str): the Attack id to load

        Returns:
            attack (Attack): the resulting Attack object
        """
        attack = attacks_collection.find_one({"_id": ObjectId(id)})
        if attack is None:
            raise KeyError(f"No Attack object with the id {repr(id)} was found.")

        self_status = attack_stats_collection.find_one(
            {"_id": ObjectId(attack["self_status_id"])}
        )
        if self_status is None:
            raise KeyError(
                f"No Stats object with the id {repr(attack["self_status_id"])} was found."
            )
        self_status.pop("_id")

        target_status = attack_stats_collection.find_one(
            {"_id": ObjectId(attack["target_status_id"])}
        )
        if target_status is None:
            raise KeyError(
                f"No Stats object with the id {repr(attack["target_status_id"])} was found."
            )
        target_status.pop("_id")

        return Attack(
            attack["name"],
            attack["element"],
            attack["power"],
            attack["special"],
            self_status,
            target_status,
            id,
        )


def generate_attack(name: str, element: str, category: str) -> Attack:
    """Generate a random attack with the given name, element and category."""

    if not isinstance(name, str):
        raise TypeError(f"Name must be a string, but {name} is a {type(name).__name__}")
    if element not in element_options:
        raise ValueError(f"Element must be a valid element, but {element} is not")
    if category not in ["physical", "special", "status"]:
        raise ValueError(
            f"Category must be either 'physical', 'special' or 'status', but {category} is not"
        )

    power = 0
    special = False
    self_status = {}
    target_status = {}

    if category == "physical":
        power = np.random.randint(1, 256)
    elif category == "special":
        power = np.random.randint(1, 256)
        special = True
        stat_ind = np.random.rand()
        if stat_ind <= 0.2:
            good_bad_ind = np.random.rand()
            if good_bad_ind <= 0.5:
                # + status to me, - status to them, less powerful
                stat_changes = min(int(np.random.gamma(1, 1, 1)[0]) + 1, 6)
                budget = 192
                while stat_changes > 0 and budget > 0:
                    me_or_them_ind = np.random.rand()
                    if me_or_them_ind <= 0.5:
                        stat_modify_by = int(np.random.gamma(10, 3.5, 100)[0])
                        budget -= stat_modify_by
                        if budget < 0:
                            stat_modify_by += budget
                        stat_to_modify = np.random.choice(stats_keys)
                        self_status[stat_to_modify] = stat_modify_by
                    else:
                        stat_modify_by = int(np.random.gamma(10, 3.5, 100)[0])
                        budget -= stat_modify_by
                        if budget < 0:
                            stat_modify_by += budget
                        stat_to_modify = np.random.choice(stats_keys)
                        target_status[stat_to_modify] = -stat_modify_by
                    stat_changes -= 1
                power_change = np.random.randint(50, 100)
                power = int(power * power_change / 100)
            else:
                # - status to me, + status to them, more powerful
                stat_changes = min(int(np.random.gamma(1, 1, 1)[0]) + 1, 6)
                budget = 192
                while stat_changes > 0 and budget > 0:
                    me_or_them_ind = np.random.rand()
                    if me_or_them_ind <= 0.5:
                        stat_modify_by = int(np.random.gamma(10, 3.5, 100)[0])
                        budget -= stat_modify_by
                        if budget < 0:
                            stat_modify_by += budget
                        stat_to_modify = np.random.choice(stats_keys)
                        self_status[stat_to_modify] = -stat_modify_by
                    else:
                        stat_modify_by = int(np.random.gamma(10, 3.5, 100)[0])
                        budget -= stat_modify_by
                        if budget < 0:
                            stat_modify_by += budget
                        stat_to_modify = np.random.choice(stats_keys)
                        target_status[stat_to_modify] = stat_modify_by
                    stat_changes -= 1
                power_change = np.random.randint(100, 150)
                power = int(power * power_change / 100)
    else:
        stat_changes = min(int(np.random.gamma(2, 1, 1)[0]) + 1, 6)
        budget = 256
        while stat_changes > 0 and budget > 0:
            me_or_them_ind = np.random.rand()
            if me_or_them_ind <= 0.5:
                stat_modify_by = int(np.random.gamma(10, 5, 100)[0])
                budget -= stat_modify_by
                if budget < 0:
                    stat_modify_by += budget
                stat_to_modify = np.random.choice(stats_keys)
                self_status[stat_to_modify] = stat_modify_by
            else:
                stat_modify_by = int(np.random.gamma(10, 5, 100)[0])
                budget -= stat_modify_by
                if budget < 0:
                    stat_modify_by += budget
                stat_to_modify = np.random.choice(stats_keys)
                target_status[stat_to_modify] = stat_modify_by
            stat_changes -= 1
    return Attack(name, element, power, special, self_status, target_status)
