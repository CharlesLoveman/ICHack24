from .db import get_pokemon_by_name
from .sharedTypes import PokemonStats
from .env import POKEMON_FOLDER
from .attack import generate_attack
from .pokemon import Pokemon


class ErrormonException(Exception):
    pass


def get_errormon_id():
    try:
        errormon = get_pokemon_by_name("Errormon")
        print(f"Errormon found with id {errormon["id"]}")
        return errormon["id"]
    except:
        print("Errormon not found; attempting to create.")
        return create_errormon()


def create_errormon():
    stats: PokemonStats = {
        "id": "--",
        "hp": 1,
        "attack": 1,
        "defence": 1,
        "special_attack": 1,
        "special_defence": 1,
        "speed": 1,
    }

    glitch_attack = generate_attack(
        "Glitch Cannon", "Ghost", "physical", "T̵͚͖͚̈h̸͈͑̔͌͠i̵̟̬̾̈́͝s̷̹͍͚̃́ ̴̝̣͗̏͝ͅi̸̥̓͑̍s̸̺̠̹̑ ̵̨̨̠̄̆̇̈́a̵̦̓ ̶̡͂̏̀̂t̵̞̃̏́õ̵̲̬̺̹t̷͚̻̠́̅̈́̀ȧ̷̧̛̳͎̳̈͒l̶̹͓̦̜̓̃̌̐l̴̯̥͉̜̽̃y̷̤̮͊͜ ̵̲̫̃̇͠l̴̺̒̊͘e̸̜͓̪̓͂ͅg̴͙̾̉ḯ̴̦͉̗͔̓̚ť̴̙̼̖̣̓̄̚i̷̘̒̂͝m̴̨̧̜͕̀a̷̩̐t̴̥̓͝e̷̺̠͎͐̒̍̚ͅ ̴̺̗̈͊ą̴̺͚͊̅̕t̷̢̯͚̿͗̕ṯ̷̝͙̜̚ă̶̦̞̿c̷͎̘̮̻͒͑ǩ̴̞̰̀̉̀"
    )
    bsod_attack = generate_attack(
        "Blue Screen of Doom",
        "Electric",
        "special",
        "O̸͖̬̺͗h̴̞̫̣̑̀͘ ̶̡̖͍̩̏͘n̸̲̩̎̾̾͝o̴̗̩̿,̶̬̓̉̔̽ ̷̡̻͈͐̒̓̊I̴̧͎̣̺͆̐̌̑ ̷̗͌s̸͈̍ͅt̵̥̟͊͘͜͜i̵̪͎͒̒͛̈́l̷͎͝ͅl̷͖̠͈̆ ̵̝̮̾̽̆ü̴̫͙̽͂s̸̪̠͒̑e̶͍̻̻̻̓̿̚ ̶̩̈́W̷͔̳̭͆̾i̵̻̣͈̺͛́̐͝n̴͉͂ď̶̠̯̗o̶̜̣̟͗w̸̨̭͒͐ṣ̵̫̣̋̂̀̚ ̷̛̹̈̿f̶̹̟̈́̚͝o̵̭̰̦̲̾̈́r̸͎͌̄͑ ̶̲͍̲̾̐İ̴͕̮̒ ̶̻̲̳͒́͂a̵̩̱̟͝m̴̲̜̫̈̃ ̶̗̟̜̎u̸̬̜̹̒͗͗n̶̳͙͇̽̈c̷͇͓̳̩͐̀̀u̷̢̘̼̖͛̀͒̒ḷ̵̡̠̈́̀̃͐t̵̫̪͇̤̆̄̽ū̷̮͎̞̦͌̿r̵̨̞͘e̷̙̥͝d̶̞͍͍͕͒̑͐",
    )
    null_attack = generate_attack(
        "Null Pointer Exception", "Dark", "status", "N̵̰̜͆̀͂ǔ̶̯̊̚r̷̗͓͂u̷͎͂p̵̥̻̍̕o̸̲̞͉͐?̸̥̰̈́̇̚͠ͅ ̸̖̬̗̬͒̈̕͘G̵͚̓à̸̡͖̻́̉h̵͍͙͐̑̀͋!̸̧̠̇͑͛ͅ"
    )
    segfault_attack = generate_attack(
        "Segmentation Fault",
        "Psychic",
        "special",
        "Ş̸̡̛͖̥̘̟̟̻̑̌̈́̐̽̌̅̇͗͒͋̋̀̌͛̍͒̈́͊́̋͑̾̊̅̚ě̸̡̢̨̧̧̨̨̙̩̞̫̭̜̹̙͔̝̪̤̝͕͍̪̻͍̝̞̥̗͈̠̩̰͍̞͉̦̞͔̼̭̙̐̏̀̄͂́͜ͅr̴̨̛̖̠̯̻̜̠̜͚͉͗́̽̓̆͐̀̽͋͑̈̓̕͜͜͠͝v̷̡̧̛̤͙͍̲̬̥͓͓̣͖̦̪̹̼͈̍͐̀̉̓́̎̓̔̾̊̌̀̊̂͒͌̎̒̄̾͒͑͆̒̕͝͠ȩ̴̢̢̢̡̡̨̬̱̟̣̣̞̱̹̦̻̻͎͖̻̗̫̝̟̝͇̞̈́͒̇̀͘͝͝s̶̨̢̧̛̰͈̻͓̘̦̭̻̯͖͎͓̦͖̪̼̠͓͎̫̮̗͖̻͈͓̼͔͔̬̄̓̈́̅͒͒̀̄̅̈̐̔̒̀̍̔̌͂͆͋͋̆̀̀̑͗̊̂́̒͋̐̚̕ͅͅ ̶̨̡̢̨̡̨̛̜̦̱̟̞͍̠͉͓̝̺̘͉͕͇͙̤͕̹̰̖̩͔̰̘͉̩̬̻͎͔̹͗̀̂͊̌͝m̶̨̨̡͚̙̘̭̗̜̘̖͖͙̦̪̪͍̝̭̹̳̪̭̦͕͍̰͕̣̗͈͎̹͓̳̗̓͌̈́̓̊́͝ͅe̵̛͈̟̞͉͚̦̞͈̭͓̤̻͕͙̥̯̿͂̊̒̽̽̐̏͋̒̀͆̈́͑̃̃̏̽̀̍́̾̏̋̄͗̔̌̓̌͑̽͂̽͌̇̈́̈́͘̚̚̕͠͠ ̸̨͖͚̘̜̰̲͂̅̉̍͂̃̃̈́̅͗̽͊̆̃̐́̒̃̒͐̊̾̑̋̊͗̚͠r̷̢̢̢͎̙̪̦̭͔̤̗̣̘̣͓͕͙̙͍̭̓̄̅͋̋͛̀̑͑̾̈́̽́͂̓͒͛́̃̇̋̐̚̕͜͠ĭ̵̡̡̘̟͕̩̞̥̠͚̳̥͚͔̝̹̱͙͇̰͔̰͔̩̗̗̩͙̗̻͉̫̉̂̊͑̍̂̌̉̉̌̓̑̍͑͊̾̈́́̃͊̽͋̓̏̅͘͘̕̕͜͜͠ͅg̷̛̠̪̲̫͔̓̔͋̈́̽̉̂́̉͌͆͋̃̔͋̄̌̋̆̒̑́͊̑̿̇̂͌̋̔̀͂͌̔͘̚͝h̶̨̢̨̛̛̪͉̳̘͎̥͕̻̳͎̤̠̣̲̯̭̹̰͚̭̣̜͉͚̬̣̟̩̗̹̳̻̬̹̪͖͕̤͐̌͗̑̈́̈́͐͑͌̐̌́̾͗͋̊͒̈̔̐̋̎̂̓̈́̏͂͒̔͋̑̾̽̔͐̇̏͋̕͘͜͝͝ͅt̶̢͚͉͕͎̩̥̯̳̫̺̥̣̖̹͓͈̏͊̍͊̔̋̌̐̀́͑̊̈́̇͌̀̕͜͜͝ ̴̡́̈́̂̒̀̓͌̅̈́̇͗́̂͆̄̈́̓̉̿̒̆̚͠f̴̡̛̫̳̙̰̣̣̬̥̭̲̮̞̟̘̭͚̟͎̗̭̤̜̲̄͌̈́̅̆̏͆͂̋͐̓͂̌͂͒̎̑͒̕͘ͅo̸̡͉̣͉͙̫̲͕̪͚͓̥̜̲̭̯͈͓͍̗͕̖̠̹͂̏͌̃̄̀̓͘͝͝͠r̶̢̡̛͕̺̫̤̳̱̺̮͔̩͓͖̲̤̯̼̱̰̲̜̫̺͇̤͕̪̿͑̈́̎͑͂̽̔̿͊͋̂̂̾̈́́̃̈́͂̋͛͘͘͜͝ ̷̧̧̡̢̬̩̪̩̘̗͈̣͙͔̱͎͔̜̥̩̟̘̥̲̱̝̦͍̞̖̻͓̑ţ̴̳͙͙̗̦͇̣͈͙̼̳͕͙͓̹̬͎̿̓̀̊ͅr̷̨̧̟̬͓̼̟̩͍͚͔̻̻̱͖̥̭̤̙͍̠̥̣̫̤͖̳̫͉͔̱͇͓̻͇̚ͅy̴̡̧̧̢̙̫̳̥̫̣͇͚̹̹̲͍̬̭̱͓̓͛͌͘ị̵̱͔̮̖͖͓̹̞͙͉̭͕͐͑̋̎̓̑̊̆͊́̾̽̿͐͑͆̍̓̓͗̔̓̄̀͊́̽̒́̏̓̚͜͠͝͝͝͠͠ņ̶̧̠̯̞͈̼̺̹͙̤̰̦̦̤̗̹̰̯̩̫̞̖̙̠̦̦̙̯̬̮̼͖̮́̄̆̓̍̊̇̆͒͊̍̓ģ̶̡̨̛̛̟͉̙̘̟̤̗̗͍̯̘̫̹̦̱̗̣̱̪̖͓̳̝͈͎̲̤͈̰̥̲̥̜͇͉͌̀̅̈́͋̓̎͗̈́͌͋̾͗̓̏͜͜͝ͅͅ ̵̦͕̯̠͎̹͓̝̃́͌̇͂̅́̔̈͌̎͂̿̄̀̔͛̍͐̓̓̀̏̐̎́̈́̾̋̿̽̈̍͘͘̚̕͜͠t̶̢̬̻̰̦̠̻͇͓̞̲̙̠͍͕̲̺̜̟̩̲͗͛̿́͆͑̄̈̐̆̈́͊́̓̔̓͋͌̐͂́̃̚͘͝͝ͅͅͅơ̶̡̨̩͉̲̦̞͚̘̟̹͖̄͌̇̃̆́̔̓͌͌̎̊́̓̈̾͂̈͒̒͘ͅ ̴̨̝̣̼͠ļ̵̨̧̪̣̞̞͙̞̭̦̺̻̗̬̣̮̘͗͛̃̉̌̇̃́̎̒̒̽̊͋͜e̵͔̙͖͈͚͉̞̻͋̏́͋̆̎͗͆̂̓͛͗͊͊ͅa̴̡̧̢̨̝̜̖̻͔̠͖̲̬̰̤͍̙̣̰͍͚̻̺͚͐͒̀̎̇́̎̌̎̀͑̍́̋̇͋̀̾̀̾́̏̑̓̾̚̚̕͜͝͝͝͝ṙ̶̢̨̨̡̨̢͔̼͕̗̮̘̣͚̜̠̣̟̟͙̟̰̦̣͈̻̦̹̟̱͚̹̺͕͎̺͈̻̄͆̅͛̽̊͌̎́͐̚̚͜͠ņ̶̧̧̢̨̛͖̞̘͖̪̼̤̗̯̿͐̾̅̂̿͒̾͌̉̃̿̊͐̃̌̈́͂̏̌̐͗̀͊̓̏̈́̌͌̄͒͜͠͠͝͝ ̴̢̢̡̠̹͇̰̯̜͕̣͚͙͔͙͕͇͖̬̮̗̦̼̜͎͇̹̯̥͕̮͇͈̟͓͔̈́͂̿͑̊͌̾̑͆̌̈̂̄͊̽̎́́̎̎̌̓̍̍̀̅̈́͂̔̕͝͝ͅĆ̶̡͈͔̙͖͙̗̱̖̻̯̲͓̦̰̽̈́͆̏͆̊̄́̈̿̒̄͌̉̏̇̀̔̔̏̀̌̓́͊̈̇̈́̊̋̄̚͜͝͝͝͠+̸̧̢̡̨̧̛̮̰͙̝͔̦̤̤͕̝̣͙̼̥̖̮̫̠̤̗̙̩̣̖̱̘̙̥̘̠̹̘̠͙̺̈́̅͛̌̇̈́͑̏̈́́̒͆̋̓̀̕͝͠+̶̦̪̜͎̘͓͓̘̺̳͈͎͕̟̱̞̘̫̞̺̬̽͜͝",
    )

    attacks = [glitch_attack, bsod_attack, null_attack, segfault_attack]
    image_id = f"{POKEMON_FOLDER}/../protected/errormon.jpg"

    pokemon = Pokemon(
        name="Errormon",
        description="""
        The Error Pokemon! Something must have gone wrong. Errormon is said to 
        be the result of a corrupted Pokemon transfer gone wrong. Its glitching 
        abilities make it a formidable opponent, but also prone to unpredictable 
        behavior. Trainers who capture Errormon often find themselves dealing 
        with a mischievous and unreliable companion.
                      """,
        element="Bug",
        stats=stats,
        attacks=attacks,
        image_id=image_id,
        original_image_id=image_id,
    )

    return pokemon.save()
