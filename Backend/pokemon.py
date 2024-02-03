""""Pokemon game logic."""


class Pokemon:
    """A Pokemon in the game, with description and battle statistics."""
    def __init__(self, name : str, description : str, element : str, stats : dict, moves : list, image_id : str):
        self.name = name
        self.description = description
        self.element = element
        self.stats = stats
        self.moves = moves
        self.image_id = image_id

        if not isinstance(self.name, str):
            raise TypeError(f"Name must be a string, but {self.name} is a {type(self.name).__name__}")
        if not isinstance(self.description, str):
            raise TypeError(f"Description must be a string, but {self.description} is a {type(self.description).__name__}")
        if not isinstance(self.element, str):
            raise TypeError(f"Element must be a string, but {self.element} is a {type(self.element).__name__}")
        if not self.element in ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy", "Stellar"]:
            raise ValueError(f"Element must be a valid element (Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy or Stellar), but {self.element} is not")
        if not isinstance(self.stats, dict):
            raise TypeError(f"Stats must be a dictionary, but {self.stats} is a {type(self.stats).__name__}")
        if not len(self.stats) == 6:
            raise ValueError(f"Stats must have 6 values, but {len(self.stats)} were given: {self.stats}")
        for key in self.stats.keys():
            if not key in ["hp", "attack", "defense", "special_attack", "special_defense", "speed"]:
                raise ValueError(f"Stats must have valid keys (hp, attack, defense, sepcial_attack, special_defense, speed), but {key} is not")
            if not isinstance(self.stats[key], int):
                raise TypeError(f"Stats must have integer values, but the {key} stat is {self.stats[key]} is a {type(self.stats[key]).__name__}")
            if (not 256 > self.stats[key]) or (not self.stats[key] > 0):
                raise ValueError(f"Stats must have positive values less than 256, but the {key} stat is {self.stats[key]}")
        if not isinstance(self.moves, list):
            raise TypeError(f"Moves must be a list, but {self.moves} is a {type(self.moves).__name__}")
        if not len(moves) == 3:
            raise ValueError(f"Pokemon must have 3 moves, but {len(moves)} were given: {moves}")
        for move in self.moves:
            if not isinstance(move, Move):
                raise TypeError(f"Moves must be a list of Move objects, but {move} is a {type(move).__name__}")
        if not isinstance(self.image_id, str):
            raise TypeError(f"Image ID must be a string, but {self.image_id} is a {type(self.image_id).__name__}")        

    def __repr__(self):
        """Return a string representation of the Pokemon."""
        return f"Pokemon({self.name}, {self.description}, {self.element}, {self.stats}, {self.moves}, {self.image_id})"

class Move:
    def __init__(self, damage, extra):
        self.damage = damage
        self.extra = extra

    def __repr__(self):
        return f"Move({self.damage}, {self.extra})"

    def use(self, my, their):
        pass

class Game:

    def __init__(self, p1 : Pokemon, p2 : Pokemon):
        self.p1 = p1
        self.p2 = p2

    def run(self, player_no, move : Move):
        move.use(self.p1, self.p2)



# g = Game()


# g.run(g.p1, move)

