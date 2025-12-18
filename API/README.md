# 🚀 FastAPI Setup Handleiding (Windows)

Deze handleiding helpt je stap voor stap met het installeren van FastAPI en het draaien van een eenvoudige API op een Windows-machine.

---

## Stap 1: Installeer Python

1. Download de nieuwste versie van Python 3.x:  
   https://www.python.org/downloads/windows/

2. Voer de installer uit:
   - Vink **"Add Python to PATH"** aan
   - Klik op **"Install Now"**

3. Open de **Command Prompt** (cmd) of **PowerShell** en controleer de installatie:

   ```
   python --version
   pip --version
## Stap 2: Installeer FastAPI en Uvicorn
1. Installeer FastAPI en Uvicorn met pip:
   ```
   pip install fastapi uvicorn

  Werkt pip niet? Probeer dan:
  ```
      -m pip install fastapi uvicorn 
  ```
## Stap 4: Start de server
1. Open de TrashPredictionAPI folder in Visual Studio Code

2. Open één terminal in Visual Studio Code

3. Voer dit commando uit
   ```
   uvicorn main:app --reload
   ```
   Werkt dit niet? Probeer dan:
   ```
   py -m uvicorn main:app --reload
   ```