from .sharedTypes import OptionalPokemonStats, PokemonStats


class ExtendedPokemonStats(PokemonStats):
    type: str


class OptionalExtendedPokemonStats(OptionalPokemonStats, total=False):
    type: str
