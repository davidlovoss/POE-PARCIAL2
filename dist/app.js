import { LibroController } from "./controllers/LibroController.js";
import { LibroModel } from "./models/LibroModel.js";
import { LibroView } from "./views/LibroView.js";
import { StorageService } from "./services/StorageService.js";
const storage = new StorageService();
const modelo = new LibroModel(storage);
const vista = new LibroView();
new LibroController(modelo, vista);
