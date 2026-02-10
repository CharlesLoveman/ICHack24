from __future__ import (
    annotations,
)  # Required because Battle and BattleState depend on each other for types
from typing import Dict
from .pokemon import Pokemon
from .attack import Attack
from .socketEmit import (
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
    """Enum representing possible events during a battle."""

    attack = "attack"


class Battle:
    """Manages the state and logic of a Pokemon battle between two players."""

    attack1: Attack
    attack2: Attack
    p1: Pokemon
    p2: Pokemon
    u1: str
    u2: str
    state: BattleState

    def __init__(self, u1: str, p1_id: str):
        """Initialise a battle with the first player.

        Args:
            u1 (str): The username/client ID of player 1.
            p1_id (str): The ID of player 1's Pokemon.
        """
        self.u1 = u1
        self.p1_id = p1_id

        self.p1 = Pokemon.load(self.p1_id)
        self.p1.stats["max_hp"] = self.p1.stats["hp"]
        self.state = WaitingForAttacks()

    def s1(self):
        """Get the socket ID for player 1.

        Returns:
            str: The socket ID associated with player 1.
        """
        return self.get_socket(self.u1)

    def s2(self):
        """Get the socket ID for player 2.

        Returns:
            str: The socket ID associated with player 2.
        """
        return self.get_socket(self.u2)

    def get_socket(self, username: str):
        """Retrieve the socket ID for a given username.

        Args:
            username (str): The username to look up.

        Returns:
            str: The socket ID associated with the username.
        """
        return users_to_sockets[username]

    def add_player(self, u2: str, p2_id: str):
        """Add the second player to the battle.

        Args:
            u2 (str): The username/client ID of player 2.
            p2_id (str): The ID of player 2's Pokemon.
        """
        self.u2 = u2
        self.p2_id = p2_id
        self.p2 = Pokemon.load(self.p2_id)
        self.p2.stats["max_hp"] = self.p2.stats["hp"]

    def handle_event(self, event: BattleEvent, json: AttackData, socket_id: str):
        """Delegate event handling to the current state.

        Args:
            event (BattleEvent): The type of event occurring.
            json (AttackData): The data associated with the event (e.g., attack details).
            socket_id (str): The socket ID of the player triggering the event.
        """
        return self.state.handle_event(self, event, json, socket_id)

    def execute(self):
        """Execute a turn of the battle.

        Determines turn order based on speed, applies attacks, and checks for knockouts.
        """
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
        """Check if either Pokemon has fainted and declare a winner if so."""
        if self.p1.stats["hp"] <= 0:
            self.broadcast_wins(2)
        elif self.p2.stats["hp"] <= 0:
            self.broadcast_wins(1)

    def is_full(self):
        """Check if the battle has two players.

        Returns:
            bool: True if both players have joined, False otherwise.
        """
        return hasattr(self, "u2") and hasattr(self, "u1")

    def which_player_is_this(self, username: str) -> int | None:
        """Determine if the username corresponds to player 1 or player 2.

        Args:
            username (str): The username to check.

        Returns:
            int | None: 1 for player 1, 2 for player 2, or None if not found.
        """
        if self.u1 == username:
            return 1
        elif self.u2 == username:
            return 2
        else:
            return None

    def broadcast_wins(self, winner: int):
        """Notify players of the battle result.

        Args:
            winner (int): The player number (1 or 2) who won.
        """
        if winner == 1:
            emit_win(self.s1())
            emit_lose(self.s2())
        else:
            emit_win(self.s2())
            emit_lose(self.s1())


class BattleState(ABC):
    """Abstract base class representing the state of a battle."""

    @abstractmethod
    def handle_event(
        self, battle: Battle, event: BattleEvent, json: AttackData, socket_id: str
    ):
        """Handle an event based on the current state.

        Args:
            battle (Battle): The current battle instance.
            event (BattleEvent): The event type.
            json (AttackData): Data associated with the event.
            socket_id (str): The socket ID of the triggering player.
        """
        pass

    def player_has_chosen(self, battle: Battle, number: int):
        """Notify players that one has made a move and the other needs to wait.

        Args:
            battle (Battle): The current battle instance.
            number (int): The player number (1 or 2) who has chosen.

        Raises:
            ValueError: If number is not 1 or 2.
        """
        if number == 1:
            chosen_user = battle.s1()
            not_yet_chosen_user = battle.s2()
        elif number == 2:
            chosen_user = battle.s2()
            not_yet_chosen_user = battle.s1()
        else:
            raise ValueError("Number must be 1 or 2.")

        emit_makeOtherPlayerWait(not_yet_chosen_user)
        emit_onWaitOnOtherPlayer(chosen_user)

    def broadcast_health(self, battle: Battle):
        """Send updated health and move information to both players.

        Args:
            battle (Battle): The current battle instance.
        """
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
    """State where the battle is waiting for both players to select an attack."""

    def __init__(self):
        """Initialise the WaitingForAttacks state."""
        super()

    def handle_event(
        self, battle: Battle, event: BattleEvent, json: AttackData, socket_id: str
    ):
        """Handle attack selection from either player.

        Args:
            battle (Battle): The current battle instance.
            event (BattleEvent): The event type.
            json (AttackData): Data containing the selected attack ID.
            socket_id (str): The socket ID of the player selecting the attack.
        """
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
    """State where player 2 has chosen, waiting for player 1."""

    def __init__(self):
        """Initialise the WaitingForPlayer1Attack state."""
        super()

    def handle_event(
        self, battle: Battle, event: BattleEvent, json: AttackData, socket_id: str
    ):
        """Handle attack selection from player 1.

        Args:
            battle (Battle): The current battle instance.
            event (BattleEvent): The event type.
            json (AttackData): Data containing the selected attack ID.
            socket_id (str): The socket ID of the player selecting the attack.
        """
        if event == BattleEvent.attack:
            if socket_id == battle.s1():
                battle.attack1 = Attack.load(json["attack_id"])
                print(battle.attack1)
                battle.execute()
                self.broadcast_health(battle)
                battle.state = WaitingForAttacks()


class WaitingForPlayer2Attack(BattleState):
    """State where player 1 has chosen, waiting for player 2."""

    def __init__(self):
        """Initialise the WaitingForPlayer2Attack state."""
        super()

    def handle_event(
        self, battle: Battle, event: BattleEvent, json: AttackData, socket_id: str
    ):
        """Handle attack selection from player 2.

        Args:
            battle (Battle): The current battle instance.
            event (BattleEvent): The event type.
            json (AttackData): Data containing the selected attack ID.
            socket_id (str): The socket ID of the player selecting the attack.
        """
        if event == BattleEvent.attack:
            if socket_id == battle.s2():
                battle.attack2 = Attack.load(json["attack_id"])
                print(battle.attack2)
                battle.execute()
                self.broadcast_health(battle)
                battle.state = WaitingForAttacks()


battles: Dict[str, Battle] = {}
