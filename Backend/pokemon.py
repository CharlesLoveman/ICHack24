""""Pokemon game logic."""

import numpy as np

element_options = ["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon", "Dark", "Fairy"]
stats_keys = ["hp", "attack", "defense", "special_attack", "special_defense", "speed"]
element_chart = np.array([[1, 1, 1, 1, 1, 0.5, 1, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                          [2, 1, 0.5, 0.5, 1, 2, 0.5, 0, 2, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5],
                          [1, 2, 1, 1, 1, 0.5, 2, 1, 0.5, 1, 1, 2, 0.5, 1, 1, 1, 1, 1],
                          [1, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 1, 2, 1, 1, 1, 1, 1, 2],
                          [1, 1, 0, 2, 1, 2, 0.5, 1, 2, 2, 1, 0.5, 2, 1, 1, 1, 1, 1],
                          [1, 0.5, 2, 1, 0.5, 1, 2, 1, 0.5, 2, 1, 1, 1, 1, 2, 1, 1, 1],
                          [1, 0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 0.5, 1, 2, 1, 2, 1, 1, 2, 0.5],
                          [0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 1],
                          [1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 1, 2, 1, 1, 2],
                          [1, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5, 0.5, 2, 1, 1, 2, 0.5, 1, 1],
                          [1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 1, 0.5, 1, 1],
                          [1, 1, 0.5, 0.5, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 1, 0.5, 1, 1],
                          [1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 0.5, 1, 1],
                          [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 0, 1],
                          [1, 1, 2, 1, 2, 1, 1, 1, 0.5, 0.5, 0.5, 2, 1, 1, 0.5, 2, 1, 1],
                          [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 0],
                          [1, 0.5, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5],
                          [1, 2, 1, 0.5, 1, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 2, 2, 1]])

class Pokemon:
    """Create a Pokemon, with description, battle statistics and an image id."""

    def __init__(self, name : str, description : str, element : str, stats : dict, attacks : list, image_id : str):
        self.name = name
        self.description = description
        self.element = element
        self.stats = stats
        self.attacks = attacks
        self.image_id = image_id

        if not isinstance(self.name, str):
            raise TypeError(f"Name must be a string, but {self.name} is a {type(self.name).__name__}")

        if not isinstance(self.description, str):
            raise TypeError(f"Description must be a string, but {self.description} is a {type(self.description).__name__}")

        if not isinstance(self.element, str):
            raise TypeError(f"Element must be a string, but {self.element} is a {type(self.element).__name__}")
        if not self.element in element_options:
            raise ValueError(f"Element must be a valid element, but {self.element} is not")

        if not isinstance(self.stats, dict):
            raise TypeError(f"Stats must be a dictionary, but {self.stats} is a {type(self.stats).__name__}")
        if not len(self.stats) == 6:
            raise ValueError(f"Stats must have 6 values, but {len(self.stats)} were given: {self.stats}")
        for key in self.stats.keys():
            if not key in stats_keys:
                raise ValueError(f"Stats must have valid keys, but {key} is not")
            if not isinstance(self.stats[key], int):
                raise TypeError(f"Stats must have integer values, but the {key} stat is {self.stats[key]} is a {type(self.stats[key]).__name__}")
            if (not 256 > self.stats[key]) or (not self.stats[key] > 0):
                raise ValueError(f"Stats must have positive values less than 256, but the {key} stat is {self.stats[key]}")

        if not isinstance(self.attacks, list):
            raise TypeError(f"Moves must be a list, but {self.attacks} is a {type(self.attacks).__name__}")
        if not len(self.attacks) == 4:
            raise ValueError(f"Pokemon must have 4 attacks, but {len(self.attacks)} were given: {self.attacks}")
        for attack in self.attacks:
            if not isinstance(attack, Attack):
                raise TypeError(f"Moves must be a list of Move objects, but {attack} is a {type(attack).__name__}")

        if not isinstance(self.image_id, str):
            raise TypeError(f"Image ID must be a string, but {self.image_id} is a {type(self.image_id).__name__}")      

    def __repr__(self):
        """Return a string representation of the Pokemon."""
        return f"Pokemon({repr(self.name)}, {repr(self.description)}, {repr(self.element)}, {repr(self.stats)}, {repr(self.attacks)}, {repr(self.image_id)})"

    def attack(self, attack, target, critical_hit : bool = False):
        """Hit the target Pokemon with an attack."""
        if not isinstance(attack, Attack):
            raise TypeError(f"Attack must be an Attack, but {attack} is a {type(attack).__name__}")
        if not attack in self.attacks:
            raise ValueError(f"Chosen attack must be one of the Pokemon's attacks, but {attack} is not")
        if not isinstance(target, Pokemon):
            raise TypeError(f"Target must be a Pokemon, but {target} is a {type(target).__name__}")
        if not isinstance(critical_hit, bool):
            raise TypeError(f"Critical hit must be a boolean, but {critical_hit} is a {type(critical_hit).__name__}")

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
            dfs = target.stats["defense"]
            if attack.special:
                atk = self.stats["special_attack"]
                dfs = target.stats["special_defense"]
            damage = int(2/5 * attack.power * (atk / dfs) * attack_element_boost * target_element_boost * np.random.uniform(217, 256)/255)

            # apply damage
            target.stats["hp"] -= damage

        if not len(attack.self_status) == 0:
            for key in attack.self_status.keys():
                self.stats[key] += attack.self_status[key]

        if not len(attack.target_status) == 0:
            for key in attack.target_status.keys():
                target.stats[key] = max(1, target.stats[key] + attack.target_status[key])


class Attack:
    """Create an attack, to be called when a Pokemon attacks."""

    def __init__(self, name : str, element : str, power : int = 0, special : bool = False, self_status : dict = {}, target_status : dict = {}):
        """Create an attack with a name, element and optional power and status effects."""
        self.name = name
        self.element = element
        self.power = power
        self.special = special
        self.self_status = self_status
        self.target_status = target_status

        if not isinstance(self.name, str):
            raise TypeError(f"Name must be a string, but {self.name} is a {type(self.name).__name__}")

        if not isinstance(self.element, str):
            raise TypeError(f"Element must be a string, but {self.element} is a {type(self.element).__name__}")
        if not self.element in element_options:
            raise ValueError(f"Element must be a valid element, but {self.element} is not")

        if not isinstance(self.power, int):
            raise TypeError(f"Power must be an integer, but {self.power} is a {type(self.power).__name__}")
        if (not 256 > self.power) or (not self.power > 0):
            raise ValueError(f"Power must be a positive value less than 256, but {self.power} is not")

        if not isinstance(self.special, bool):
            raise TypeError(f"Special must be a boolean, but {self.special} is a {type(self.special).__name__}")

        if not isinstance(self.self_status, dict):
            raise TypeError(f"Status must be a dictionary, but {self.self_status} is a {type(self.self_status).__name__}")
        for key in self.self_status.keys():
            if not key in stats_keys:
                raise ValueError(f"Status must have valid keys, but {key} is not")
            if not isinstance(self.self_status[key], int):
                raise TypeError(f"Status effect value must be an integer, but the {key} status {self.self_status[key]} is a {type(self.self_status[key]).__name__}")
            if (not 128 > self.self_status[key]) or (not self.self_status[key] > 0):
                raise ValueError(f"Status effect values must be positive and less than 128, but the {key} status is {self.self_status[key]}")

        if not isinstance(self.target_status, dict):
            raise TypeError(f"Status must be a dictionary, but {self.target_status} is a {type(self.target_status).__name__}")
        for key in self.target_status.keys():
            if not key in stats_keys:
                raise ValueError(f"Status must have valid keys, but {key} is not")
            if not isinstance(self.target_status[key], int):
                raise TypeError(f"Status effect value must be an integer, but the {key} status {self.target_status[key]} is a {type(self.target_status[key]).__name__}")
            if (not -128 < self.target_status[key]) or (not self.target_status[key] < 0):
                raise ValueError(f"Status effect values must be positive and less than 128, but the {key} status is {self.target_status[key]}")

    def __repr__(self):
        """Return a string representation of the Attack."""
        return f"Attack({repr(self.name)}, {repr(self.element)}, {repr(self.power)}, {repr(self.special)}, {repr(self.self_status)}, {repr(self.target_status)})"


class Battle:
    """Create a battle between 2 Pokemon."""

    def __init__(self, p1 : Pokemon, p2 : Pokemon):
        self.p1 = p1
        self.p2 = p2

        if not isinstance(self.p1, Pokemon):
            raise TypeError(f"Pokemon 1 must be a Pokemon, but {self.p1} is a {type(self.p1).__name__}")
        if not isinstance(self.p2, Pokemon):
            raise TypeError(f"Pokemon 2 must be a Pokemon, but {self.p2} is a {type(self.p2).__name__}")
