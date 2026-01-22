class ResponseRecorder:
    FILE_PATH = "responses.txt"
    HEADER = "=====RESPONSE START=====\n\n"
    FOOTER = "\n\n=====RESPONSE END=====\n\n"

    def __init__(self):
        pass

    def record(self, response: str):
        with open(self.FILE_PATH, "a") as file:
            file.write(self.HEADER)
            file.write(response)
            file.write(self.FOOTER)