import random
import numpy as np
from bson.objectid import ObjectId

from .sharedTypes import IAttack, OptionalPokemonStats, PokemonStats, AttackCategory
from .db import (
    attacks_collection,
    attack_stats_collection,
    get_attack_from_id,
)
from .pokemon_constants import element_options, stats_keys


def get_stats_keys(stats: OptionalPokemonStats | PokemonStats):
    """Get the valid stat keys present in a stats dictionary.

    Args:
        stats (OptionalPokemonStats | PokemonStats): A dictionary of stats.

    Returns:
        set: A set of stat keys that are valid and present in the input dict.
    """
    return set(stats_keys) & set(stats.keys())


def delete_attack_stats(id: str):
    """Delete an attack stats document from the database.

    Args:
        id (str): The ObjectId of the attack stats document to delete.
    """
    attack_stats_collection.delete_one({"_id": ObjectId(id)})


def delete_attack(id: str):
    """Delete an attack and its associated status effect stats from the database.

    Args:
        id (str): The ObjectId of the attack to delete.

    Raises:
        KeyError: If the attack's status objects do not have an 'id' key.
    """
    attack = Attack.load(id)
    if "id" not in attack.self_status:
        raise (KeyError(f"Attack with id {id} has no self status id"))
    if "id" not in attack.target_status:
        raise (KeyError(f"Attack with id {id} has no self status id"))

    delete_attack_stats(attack.self_status["id"])
    delete_attack_stats(attack.target_status["id"])

    attacks_collection.delete_one({"_id": ObjectId(id)})


class Attack:
    """Represents a Pokemon's attack, including its properties and effects."""

    def __init__(
        self,
        name: str,
        description: str,
        element: str,
        category: AttackCategory,
        power: int = 0,
        self_status: OptionalPokemonStats = {},
        target_status: OptionalPokemonStats = {},
        id: str = "",
    ):
        """Initialise an Attack.

        Args:
            name (str): The name of the attack.
            description (str): A description of the attack.
            element (str): The elemental type of the attack.
            category (AttackCategory): The category (physical, special, or status).
            power (int, optional): The base power of the attack. Defaults to 0.
            self_status (OptionalPokemonStats, optional): Status changes applied to the
                user. Defaults to {}.
            target_status (OptionalPokemonStats, optional): Status changes applied to
                the target. Defaults to {}.
            id (str, optional): The database ID of the attack. Defaults to "".

        Raises:
            TypeError: If any argument has an incorrect type.
            ValueError: If any argument has an invalid value.
        """
        self.name = name
        self.description = description
        self.element = element
        self.power = power
        self.category = category
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
            self.element = random.choice(element_options)
            # raise ValueError(
            #     f"Element must be a valid element, but {self.element} is not"
            # )

        if not isinstance(self.power, int):
            raise TypeError(
                f"Power must be an integer, but {self.power} is a {type(self.power).__name__}"
            )
        if (not 385 > self.power) or (not self.power >= 0):
            raise ValueError(
                f"Power must be a non-negative value less than 385, but {self.power} is not"
            )

        if not isinstance(self.category, AttackCategory):
            raise TypeError(
                f"Special must be an AttackCategory, but {self.category} is a {type(self.category).__name__}"
            )

        if not isinstance(self.self_status, dict):
            raise TypeError(
                f"Status must be a dictionary, but {self.self_status} is a {type(self.self_status).__name__}"
            )
        for key in get_stats_keys(self.self_status):
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
        for key in get_stats_keys(self.target_status):
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
        return f"Attack({repr(self.name)}, {repr(self.element)}, {repr(self.power)}, {repr(self.category)}, {repr(self.self_status)}, {repr(self.target_status)})"

    def save(self) -> str:
        """Save an Attack object to the database.

        Returns:
            str: The ObjectId of the newly saved attack document.
        """

        stats_object_ids = attack_stats_collection.insert_many(
            [self.self_status, self.target_status]
        ).inserted_ids
        stats_ids = [str(object_id) for object_id in stats_object_ids]

        return str(
            attacks_collection.insert_one(
                {
                    "name": self.name,
                    "description": self.description,
                    "element": self.element,
                    "power": self.power,
                    "category": self.category.value,
                    "self_status_id": stats_ids[0],
                    "target_status_id": stats_ids[1],
                }
            ).inserted_id
        )

    @classmethod
    def load(cls, id: str):
        """Load an Attack object from the database.

        Args:
            id (str): The ObjectId of the attack to load.

        Returns:
            Attack: The loaded Attack object.
        """
        iattack = get_attack_from_id(id)
        return cls.from_interface(iattack)

    @classmethod
    def from_interface(cls, iattack: IAttack):
        """Create an Attack instance from an IAttack interface object.

        Args:
            iattack (IAttack): The interface object representing an attack.

        Returns:
            Attack: A new Attack instance created from the interface data.
        """
        return cls(
            name=iattack["name"],
            description=iattack["description"],
            element=iattack["element"],
            power=iattack["power"],
            category=AttackCategory[iattack["category"]],
            self_status=iattack["self_status"],
            target_status=iattack["target_status"],
            id=iattack["id"],
        )

    def to_interface(self):
        """Convert the Attack instance to an IAttack interface object.

        Returns:
            IAttack: The interface object representation of the attack.
        """
        iattack: IAttack = {
            "id": self.id,
            "name": self.name,
            "category": self.category.value,
            "description": self.description,
            "element": self.element,
            "power": self.power,
            "self_status": self.self_status,
            "target_status": self.target_status,
        }

        return iattack


def generate_attack(
    name: str, element: str, _category: str, description: str
) -> Attack:
    """Generate an attack with randomized power and status effects.

    The randomization logic depends on the attack's category.

    Args:
        name (str): The name for the new attack.
        element (str): The elemental type for the new attack.
        _category (str): The category of the attack ('physical', 'special', 'status').
        description (str): The description for the new attack.

    Raises:
        TypeError: If the name is not a string.
        ValueError: If the category is not a valid AttackCategory.

    Returns:
        Attack: A newly generated Attack object with randomized properties.
    """

    if not isinstance(name, str):
        raise TypeError(f"Name must be a string, but {name} is a {type(name).__name__}")
    if element not in element_options:
        element = random.choice(element_options)
        # raise ValueError(f"Element must be a valid element, but {element} is not")
    if _category not in AttackCategory:
        raise ValueError(
            f"Category must be either 'physical', 'special' or 'status', but {_category} is not"
        )
    else:
        category = AttackCategory[_category]

    power = 0
    self_status: OptionalPokemonStats = {}
    target_status: OptionalPokemonStats = {}

    if category == AttackCategory.physical:
        power = np.random.randint(1, 256)
    elif category == AttackCategory.special:
        power = np.random.randint(1, 256)
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
    return Attack(
        name=name,
        description=description,
        element=element,
        power=power,
        category=category,
        self_status=self_status,
        target_status=target_status,
    )
