"""Manage the database for the backend."""

from dataclasses import dataclass
import pickle


class Database:
    """Class to store Pokemon database."""

    def __init__(self, path, db=None):
        self.path = path
        self._load_db(db)

    def _load_db(self, db=None):
        if db is None:
            with open(self.path, "rb") as f:
                self.db = pickle.load(f)
        else:
            self.db = db

    def _save_db(self):
        with open(self.path, "wb") as f:
            pickle.dump(self.db, f)

    def __getitem__(self, index):
        return self.db[index]

    def __setitem__(self, index, value):
        self.db[index] = value
        self._save_db()


@dataclass
class DatabaseWrapper:
    pokemon: Database
    attacks: Database
