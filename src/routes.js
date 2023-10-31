import { Router } from "express";
import { libro } from "./controller.js";

export const router = Router();

router.get('/libros', libro.getAll);

router.post('/libros', libro.add);

router.delete('/libros/:id', libro.deleteId);

router.delete('/libros/ISBN/:ISBN', libro.deleteISBN);

router.put('/libros/actualizar/:id', libro.update);

router.get('/libros/:id', libro.getOne);