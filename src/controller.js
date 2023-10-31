import { pool } from "./database.js";

class LibroController {
    async getAll(req, res) {
        try {
            const [result] = await pool.query('SELECT * FROM libros');
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener todos los libros' });
        }
    }

    async getOne(req, res) {
        try {
            const libroId = req.params.id;
            const [result] = await pool.query('SELECT * FROM libros WHERE id = ?', [libroId]);
            if (result.length === 0) {
                return res.status(404).json({ error: 'Libro no encontrado' });
            }
            res.json(result[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener un libro' });
        }
    }

    async add(req, res) {
        try {
            const libro = req.body;
            const { nombre, autor, categoria, año_publicacion, ISBN, precio, stock } = libro;  
            const query = "INSERT INTO libros(nombre, autor, categoria, año_publicacion, ISBN, precio, stock) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const values = [nombre, autor, categoria, año_publicacion, ISBN, precio, stock]; 
            const [result] = await pool.query(query, values);
            res.json({ "Id insertado": result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al agregar un libro' });
        }
    }

    async deleteId(req, res) {
        try {
            const libro = req.body;
            const { id } = libro;
            const query = "DELETE FROM libros WHERE id=?";
            const values = [id];
            const [result] = await pool.query(query, values);
            res.json({ "Registros eliminados": result.affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar un libro por ID' });
        }
    }

    async deleteISBN(req, res) {
        const libroISBN = req.params.ISBN;
        if (!/^\d{13}$/.test(libroISBN)) {
            return res.status(400).json({ error: 'Número de ISBN incorrecto. Debe contener 13 dígitos.' });
        }
        try {
            const query = "DELETE FROM libros WHERE ISBN = ?";
            const values = [libroISBN];
            const [result] = await pool.query(query, values);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Libro con este ISBN no encontrado en la base de datos.' });
            }

            res.json({ "Registros eliminados": result.affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar un libro por ISBN' });
        }
    }   

    async update(req, res) {
        try {
            const libro = req.body;
            const { nombre, autor, categoria, año_publicacion, ISBN, precio, stock, id } = libro;

            if (!/^\d{13}$/.test(ISBN)) {
                return res.status(400).json({ error: 'Número de ISBN incorrecto. Debe contener 13 dígitos.' });
            }
            const query = "UPDATE libros SET nombre=?, autor=?, categoria=?, año_publicacion=?, ISBN=?, precio=?, stock=? WHERE id=?";
            const values = [nombre, autor, categoria, año_publicacion, ISBN, precio, stock, id];
            const [result] = await pool.query(query, values);
            if (result.changedRows === 0) {
                return res.status(404).json({ error: 'Libro con este ID no encontrado en la base de datos' });
            }
            res.json({ "Registros actualizados": result.changedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar un libro' });
        }
    } 
}
export const libro = new LibroController();