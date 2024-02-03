""""Pokemon game logic."""


element_options = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy", "Stellar"]
stats_keys = ["hp", "attack", "defense", "special_attack", "special_defense", "speed"]

class Pokemon:
    """Create a Pokemon, with description and battle statistics."""
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
        if not len(self.attacks) == 3:
            raise ValueError(f"Pokemon must have 3 moves, but {len(self.attacks)} were given: {self.attacks}")
        for attack in self.attacks:
            if not isinstance(attack, Attack):
                raise TypeError(f"Moves must be a list of Move objects, but {attack} is a {type(attack).__name__}")

        if not isinstance(self.image_id, str):
            raise TypeError(f"Image ID must be a string, but {self.image_id} is a {type(self.image_id).__name__}")      

    def __repr__(self):
        """Return a string representation of the Pokemon."""
        return f"Pokemon({repr(self.name)}, {repr(self.description)}, {repr(self.element)}, {repr(self.stats)}, {repr(self.moves)}, {repr(self.image_id)})"

class Attack:
    def __init__(self, name : str, element : str, power : int):
        """Create an attack with a name, element and power."""
        self.name = name
        self.element = element
        self.power = power

        if not isinstance(self.name, str):
            raise TypeError(f"Name must be a string, but {self.name} is a {type(self.name).__name__}")

        if not isinstance(self.power, int):
            raise TypeError(f"Power must be an integer, but {self.power} is a {type(self.power).__name__}")
        if (not 256 > self.power) or (not self.power > 0):
            raise ValueError(f"Power must be a positive value less than 256, but {self.power} is not")
        
        if not isinstance(self.element, str):
            raise TypeError(f"Element must be a string, but {self.element} is a {type(self.element).__name__}")
        if not self.element in element_options:
            raise ValueError(f"Element must be a valid element, but {self.element} is not")
        
    def __repr__(self):
        return f"Attack({repr(self.name)}, {repr(self.element)}, {self.power})"


class Game:

    def __init__(self, p1 : Pokemon, p2 : Pokemon):
        self.p1 = p1
        self.p2 = p2

    def run(self, player_no, move : Attack):
        move.use(self.p1, self.p2)



# g = Game()


# g.run(g.p1, move)

