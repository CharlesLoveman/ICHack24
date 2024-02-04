""""Pokemon game logic."""

from flask_socketio import emit
import numpy as np
from bson.objectid import ObjectId
from PIL import Image
import io

element_options = ["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon", "Dark", "Fairy"]
stats_keys = ["hp", "attack", "defence", "special attack", "special defence", "speed"]
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

    def __init__(self, name : str, description : str, element : str, stats : dict, attacks : list, image : Image, id=""):
        self.name = name
        self.description = description
        self.element = element
        self.stats = stats
        self.attacks = attacks
        self.image = image
        self.id = id

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

    def __repr__(self):
        """Return a string representation of the Pokemon."""
        return f"Pokemon({repr(self.name)}, {repr(self.description)}, {repr(self.element)}, {repr(self.stats)}, {repr(self.attacks)}, {repr(self.image_id)})"

    def attack(self, attack, target):
        """Hit the target Pokemon with an attack."""
        if not isinstance(attack, Attack):
            raise TypeError(f"Attack must be an Attack, but {attack} is a {type(attack).__name__}")
        if not attack in self.attacks:
            raise ValueError(f"Chosen attack must be one of the Pokemon's attacks, but {attack} is not")
        if not isinstance(target, Pokemon):
            raise TypeError(f"Target must be a Pokemon, but {target} is a {type(target).__name__}")

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
                atk = self.stats["special attack"]
                dfs = target.stats["special defence"]
            damage = int(2/5 * attack.power * (atk / dfs) * attack_element_boost * target_element_boost * np.random.uniform(217, 256)/255)
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
                target.stats[key] = max(1, target.stats[key] + attack.target_status[key])

    def save(self, db):
        attack_ids = [attack.save(db) for attack in self.attacks]
        stats_id = db.stats.insert_one(self.stats).inserted_id
        img_raw = io.BytesIO(self.image.tobytes())
        return db.pokemon.insert_one(
            {
                "name": self.name,
                "description": self.description,
                "element": self.element,
                "stats": stats_id,
                "attacks": attack_ids,
                "image": img_raw,
            }).inserted_id

    @classmethod
    def load(cls, db, id):
        pokemon = db.pokemon.find_one({"_id": ObjectId(id)})
        stats = db.stats.find_one({"_id": ObjectId(pokemon["stats"])})
        stats.pop("_id")
        attacks = [Attack.load(db, attack_id) for attack_id in pokemon["attacks"]]
        img_raw = pokemon["image_id"]
        img = Image.open(io.BytesIO(img_raw))
        return Pokemon(pokemon["name"], pokemon["description"], pokemon["element"], stats, attacks, img_raw, id)


class Attack:
    """Create an attack, to be called when a Pokemon attacks."""

    def __init__(self, name : str, element : str, power : int = 0, special : bool = False, self_status : dict = {}, target_status : dict = {}, id : str = ""):
        """Create an attack with a name, element and optional power and status effects."""
        self.name = name
        self.element = element
        self.power = power
        self.special = special
        self.self_status = self_status
        self.target_status = target_status
        self.id = id

        if not isinstance(self.name, str):
            raise TypeError(f"Name must be a string, but {self.name} is a {type(self.name).__name__}")

        if not isinstance(self.element, str):
            raise TypeError(f"Element must be a string, but {self.element} is a {type(self.element).__name__}")
        if not self.element in element_options:
            raise ValueError(f"Element must be a valid element, but {self.element} is not")

        if not isinstance(self.power, int):
            raise TypeError(f"Power must be an integer, but {self.power} is a {type(self.power).__name__}")
        if (not 385 > self.power) or (not self.power >= 0):
            raise ValueError(f"Power must be a non-negative value less than 385, but {self.power} is not")

        if not isinstance(self.special, bool):
            raise TypeError(f"Special must be a boolean, but {self.special} is a {type(self.special).__name__}")

        if not isinstance(self.self_status, dict):
            raise TypeError(f"Status must be a dictionary, but {self.self_status} is a {type(self.self_status).__name__}")
        for key in self.self_status.keys():
            if not key in stats_keys:
                raise ValueError(f"Status must have valid keys, but {key} is not")
            if not isinstance(self.self_status[key], int):
                raise TypeError(f"Status effect value must be an integer, but the {key} status {self.self_status[key]} is a {type(self.self_status[key]).__name__}")
            if (not 128 > self.self_status[key]) or (not self.self_status[key] > -128):
                raise ValueError(f"Status effect values must be positive and less than 128, but the {key} status is {self.self_status[key]}")

        if not isinstance(self.target_status, dict):
            raise TypeError(f"Status must be a dictionary, but {self.target_status} is a {type(self.target_status).__name__}")
        for key in self.target_status.keys():
            if not key in stats_keys:
                raise ValueError(f"Status must have valid keys, but {key} is not")
            if not isinstance(self.target_status[key], int):
                raise TypeError(f"Status effect value must be an integer, but the {key} status {self.target_status[key]} is a {type(self.target_status[key]).__name__}")
            if (not -128 < self.target_status[key]) or (not self.target_status[key] < 128):
                raise ValueError(f"Status effect values must be positive and less than 128, but the {key} status is {self.target_status[key]}")

    def __repr__(self):
        """Return a string representation of the Attack."""
        return f"Attack({repr(self.name)}, {repr(self.element)}, {repr(self.power)}, {repr(self.special)}, {repr(self.self_status)}, {repr(self.target_status)})"

    def save(self, db):
        stat_ids = db.stats.insert_many([self.self_status, self.target_status]).inserted_ids
        return db.attacks.insert_one({
            "name": self.name,
            "element": self.element,
            "power": self.power,
            "special": self.special,
            "self_status": stat_ids[0],
            "target_status": stat_ids[1],
        }).inserted_id

    @classmethod
    def load(cls, db, id):
        attack = db.attacks.find_one({"_id": ObjectId(id)})
        self_status = db.stats.find_one({"_id": ObjectId(attack["self_status"])})
        self_status.pop("_id")
        target_status = db.stats.find_one({"_id": ObjectId(attack["target_status"])})
        target_status.pop("_id")
        return Attack(attack["name"], attack["element"], attack["power"], attack["special"], self_status, target_status, id)


def generate_attack(name : str, element : str, category : str):
    """Generate a random attack with the given name, element and category."""

    if not isinstance(name, str):
        raise TypeError(f"Name must be a string, but {name} is a {type(name).__name__}")
    if not element in element_options:
        raise ValueError(f"Element must be a valid element, but {element} is not")
    if not category in ["physical", "special", "status"]:
        raise ValueError(f"Category must be either 'physical', 'special' or 'status', but {category} is not")

    power = 0
    special = False
    self_status = {}
    target_status = {}

    if category == 'physical':
        power = np.random.randint(1, 256)
    elif category == 'special':
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


class Battle:
    """Create a battle between 2 Pokemon."""
    def __init__(self, player1, pokemon1, db):
        self.player1 = player1
        self.p1 = db.pokemon.find_one({"_id": pokemon1})
        self.state = None 

        if not isinstance(self.p1, Pokemon):
            raise TypeError(f"Pokemon 1 must be a Pokemon, but {self.p1} is a {type(self.p1).__name__}")

    def add_player(self, player2, pokemon2, db):
        self.player2 = player2
        self.p2 = db.pokemon.find_one({"_id": pokemon2})

    def handle_event(self, event: str, json: dict, socket_id: str, db, users):
        return self.state.handle_event(self, event, json, socket_id, db)
    
    def execute(self, users):
        if self.p1.stats["speed"] <= self.p2.stats["speed"]:
            self.p1.attack(self.attack1, self.p2)
            if self.p2.stats["hp"] <= 0:
                emit("win", {}, to=users[self.player1])
                emit("lose", {}, to=users[self.player2])
            elif self.p1.stats["hp"] <= 0:
                emit("lose", {}, to=users[self.player1])
                emit("win", {}, to=users[self.player2])
            self.p2.attack(self.attack2, self.p1)
            if self.p1.stats["hp"] <= 0:
                emit("lose", {}, to=users[self.player1])
                emit("win", {}, to=users[self.player2])
            elif self.p2.stats["hp"] <= 0:
                emit("win", {}, to=users[self.player1])
                emit("lose", {}, to=users[self.player2])
        else:
            self.p2.attack(self.attack2, self.p1)
            if self.p1.stats["hp"] <= 0:
                emit("lose", {}, to=users[self.player1])
                emit("win", {}, to=users[self.player2])
            elif self.p2.stats["hp"] <= 0:
                emit("win", {}, to=users[self.player1])
                emit("lose", {}, to=users[self.player2])
            self.p1.attack(self.attack1, self.p2)
            if self.p2.stats["hp"] <= 0:
                emit("win", {}, to=users[self.player1])
                emit("lose", {}, to=users[self.player2])
            elif self.p1.stats["hp"] <= 0:
                emit("lose", {}, to=users[self.player1])
                emit("win", {}, to=users[self.player2])

class BattleState:
    def handle_event(self, battle: Battle, event: str, json: dict, socket_id: str, db, users):
        pass

class WaitingForAttacks(BattleState):
    def __init__(self):
        super()

    def handle_event(self, battle: Battle, event: str, json: dict, socket_id: str, db, users):
        if event == "attack": 
            if socket_id == battle.player1:
                battle.attack1 = db.attacks.find_one({"_id": json["attack_id"]})
                battle.state = WaitingForPlayer2Attack()
            elif socket_id == battle.player2:
                battle.attack2 = db.attacks.find_one({"_id": json["attack_id"]})
                battle.state = WaitingForPlayer1Attack()
    
class WaitingForPlayer1Attack(BattleState):
    def __init__(self):
        super()

    def handle_event(self, battle: Battle, event: str, json: dict, socket_id: str, db, users):
        if event == "attack":
            if socket_id == battle.player2:
                battle.attack2 = db.attacks.find_one({"_id": json["attack_id"]})
                battle.execute(users)

class WaitingForPlayer2Attack(BattleState):
    def __init__(self):
        super()

    def handle_event(self, battle: Battle, event: str, json: dict, socket_id: str, db, users):
        if event == "attack":
            if socket_id == battle.player1:
                battle.attack1 = db.attacks.find_one({"_id": json["attack_id"]})
                battle.execute(users)