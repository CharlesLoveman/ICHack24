from .pokemon import Pokemon
from .attack import Attack
from socketEmit import (
    emit_lose,
    emit_makeOtherPlayerWait,
    emit_onTurnEnd,
    emit_onWaitOnOtherPlayer,
    emit_win,
)
from sharedTypes import AttackData
from enum import Enum
from .store import users_to_sockets
from abc import ABC, abstractmethod


class BattleEvent(Enum):
    attack = "attack"


class Battle:
    """Create a battle between two Pokemon."""

    attack1: Attack
    attack2: Attack
    p1: Pokemon
    p2: Pokemon
    u1: str
    u2: str

    def __init__(self, u1: str, p1_id: str):
        """Create a battle between two Pokemon.

        Args:
            u1 (str): user/ player 1 client id
            p1 (str): pokemon id for player 1

        Returns:
            self (Battle)
        """
        self.u1 = u1
        self.p1_id = p1_id

        self.p1 = Pokemon.load(self.p1_id)
        self.p1.stats["max_hp"] = self.p1.stats["hp"]
        self.state = WaitingForAttacks()

    def s1(self):
        return self.get_socket(self.u1)

    def s2(self):
        return self.get_socket(self.u2)

    def get_socket(self, username: str):
        return users_to_sockets[username]

    def add_player(self, u2: str, p2_id: str):
        """Add a second player to the battle.

        Args:
            u2 (str): user/ player 2 client id
            p2 (str): pokemon id for player 2
        """
        self.u2 = u2
        self.p2_id = p2_id
        self.p2 = Pokemon.load(self.p2_id)
        self.p2.stats["max_hp"] = self.p2.stats["hp"]

    def handle_event(self, event: BattleEvent, json: AttackData, socket_id: str):
        return self.state.handle_event(self, event, json, socket_id)

    def execute(self):
        if self.p1.stats["speed"] <= self.p2.stats["speed"]:
            self.p1.attack(self.attack1, self.p2)
            self.check_hps()
            self.p2.attack(self.attack2, self.p1)
            self.check_hps()
        else:
            self.p2.attack(self.attack2, self.p1)
            self.check_hps()
            self.p1.attack(self.attack1, self.p2)
            self.check_hps()
        print("Battle finished executing.")

    def check_hps(self):
        if self.p1.stats["hp"] <= 0:
            self.broadcast_wins(2)
        elif self.p2.stats["hp"] <= 0:
            self.broadcast_wins(1)

    def broadcast_wins(self, winner: int):
        if winner == 1:
            emit_win(self.s1())
            emit_lose(self.s2())
        else:
            emit_win(self.s2())
            emit_lose(self.s1())


class BattleState(ABC):
    @abstractmethod
    def handle_event(
        self, battle: Battle, event: str, json: AttackData, socket_id: str
    ):
        pass

    def player_has_chosen(self, battle: Battle, number: int):
        if number == 1:
            chosen_user = battle.s1()
            not_yet_chosen_user = battle.s2()
        elif number == 2:
            chosen_user = battle.s2()
            not_yet_chosen_user = battle.s1()

        emit_makeOtherPlayerWait(not_yet_chosen_user)
        emit_onWaitOnOtherPlayer(chosen_user)

    def broadcast_health(self, battle: Battle):
        emit_onTurnEnd(
            self_hp=battle.p1.stats["hp"],
            target_hp=battle.p2.stats["hp"],
            self_attack_name=battle.attack1.name,
            target_attack_name=battle.attack2.name,
            sid=battle.s1(),
        )
        emit_onTurnEnd(
            self_hp=battle.p2.stats["hp"],
            target_hp=battle.p1.stats["hp"],
            self_attack_name=battle.attack2.name,
            target_attack_name=battle.attack1.name,
            sid=battle.s2(),
        )


class WaitingForAttacks(BattleState):
    def __init__(self):
        super()

    def handle_event(
        self, battle: Battle, event: str, json: AttackData, socket_id: str
    ):
        if event == BattleEvent.attack:
            if socket_id == battle.s1():
                battle.attack1 = Attack.load(json["attack_id"])
                battle.state = WaitingForPlayer2Attack()
                print("Waiting for player 2.")
                print(battle.attack1)
                self.player_has_chosen(battle, 1)
            elif socket_id == battle.s2():
                battle.attack2 = Attack.load(json["attack_id"])
                print(battle.attack2)
                battle.state = WaitingForPlayer1Attack()
                print("Waiting for player 1.")
                self.player_has_chosen(battle, 2)


class WaitingForPlayer1Attack(BattleState):
    def __init__(self):
        super()

    def handle_event(
        self, battle: Battle, event: str, json: AttackData, socket_id: str
    ):
        if event == BattleEvent.attack:
            if socket_id == battle.s1():
                battle.attack1 = Attack.load(json["attack_id"])
                print(battle.attack1)
                battle.execute()
                self.broadcast_health(battle)
                battle.state = WaitingForAttacks()


class WaitingForPlayer2Attack(BattleState):
    def __init__(self):
        super()

    def handle_event(
        self, battle: Battle, event: str, json: AttackData, socket_id: str
    ):
        if event == BattleEvent.attack:
            if socket_id == battle.s2():
                battle.attack2 = Attack.load(json["attack_id"])
                print(battle.attack2)
                battle.execute()
                self.broadcast_health(battle)
                battle.state = WaitingForAttacks()
