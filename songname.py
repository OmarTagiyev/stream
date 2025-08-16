import os
import json
from tkinter import filedialog as fd

songList = []
songDir = os.listdir(os.getcwd() + "\\music")

for song in songDir:
    songList.append(song.replace(".mp3", ""))

print(songList)

songList = json.dumps(songList)

open("songs.json", "w").write(songList)
