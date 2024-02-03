


class Move:
    def __init__(self, damage, extra):
        self.damage = damage


    def use(self, my, their):


class Pokemon:
    def __init__(self, moves : int[Move]):

class Game:

    def __init__(self, p1 : Pokemon, p2 : Pokemon):
        self.p1 = p1
        self.p2 = p2

    def run(self, player_no, move : Move):
        move.use(self.p1, self.p2)



g = Game()


g.run(g.p1, move)

