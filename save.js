class SaveLoadMaster {
  cellsGetter;
  gridWidth;
  gridHeight;
  version;
  preventIncompatibility = true;

  constructor(cellsGetter, gridWidth, gridHeight, version) {
    this.cellsGetter = cellsGetter;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.version = version;
  }

  saveToDisk(fileName = `canvas-v${this.version}-0.json`) {
    let data = this.getData();
    this.downloadAsJsonFile(data, fileName);
  }

  loadFromDisk() {
    this.#loadInternal()
      .then((targetData) => {
        let currentData = this.getData();

        this.#actualLoad(currentData, targetData);
      })
      .catch((error) => {
        console.error(error.message);
      });
    // Should have added an event but fuck it
    toggleOptions();
    activeHistory.removeOldest(activeHistory.maxLength)
  }

  #actualLoad(currentData, targetData) {
    if (this.preventIncompatibility) {
      if (currentData.metaData.version != targetData.metaData.version) {
        console.log("Incompatible file by meta title");
        return;
      }
      else if (currentData.metaData.gridWidth != targetData.metaData.gridWidth) {
        console.log("Incompatible grid width.");
        return;
      }
      else if (currentData.metaData.gridHeight != targetData.metaData.gridHeight) {
        console.log("Incompatible grid height.");
        return;
      }
    }

    for (let x = 0; x < this.gridWidth; x++) {
      for (let y = 0; y < this.gridHeight; y++) {
        this.cellsGetter()[x][y].style.backgroundColor = targetData.colorData[x][y];
      }
    }
  }

  getData() {
    let data =
    {
      metaData: getMetaData(),
      colorData: {}
    }

    for (let x = 0; x < this.gridWidth; x++) {
      data.colorData[x] = {}; // Initialize the inner object for each row

      for (let y = 0; y < this.gridHeight; y++) {
        let bgc = activeGrid.cells[x][y].style.backgroundColor;
        // Do not include default colors
        if (bgc != CellBackgroundColorProp.value) {
          data.colorData[x][y] = bgc;
        }
      }
    }

    return data;
  }

  downloadAsJsonFile(obj, filename) {
    const jsonString = JSON.stringify(obj);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  async #loadInternal() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.addEventListener('change', async (event) => {
        const file = event.target.files[0];

        if (!file) {
          reject(new Error('No file selected.'));
          return;
        }

        try {
          const jsonData = await this.readFileAsJSON(file);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Error reading or parsing JSON file.'));
        }
      });

      input.click();
    });
  }

  readFileAsJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (fileEvent) => {
        try {
          const jsonData = JSON.parse(fileEvent.target.result);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Error parsing JSON file.'));
        }
      };

      reader.readAsText(file);
    });
  }
}