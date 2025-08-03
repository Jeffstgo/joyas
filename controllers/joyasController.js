const pool = require("../db/connection");

// GET /joyas — estructura HATEOAS con límite, página y ordenamiento
const getJoyas = async (req, res) => {
  try {
    const { limits = 10, page = 1, order_by = "id_ASC" } = req.query;

    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;

    const camposValidos = [
      "id",
      "nombre",
      "categoria",
      "metal",
      "precio",
      "stock",
    ];
    const direccionesValidas = ["ASC", "DESC"];

    if (
      !camposValidos.includes(campo) ||
      !direccionesValidas.includes(direccion)
    ) {
      return res.status(400).json({ error: "Parámetro 'order_by' inválido" });
    }

    const query = `
      SELECT * FROM inventario
      ORDER BY ${campo} ${direccion}
      LIMIT $1 OFFSET $2
    `;
    const values = [limits, offset];

    const { rows } = await pool.query(query, values);

    const data = rows.map((joya) => ({
      nombre: joya.nombre,
      href: `/joyas/${joya.id}`,
    }));

    res.json({ joyas: data });
  } catch (error) {
    console.error("Error en GET /joyas:", error);
    res.status(500).json({ error: "Error al obtener las joyas" });
  }
};

// GET /joyas/filtros — con consultas parametrizadas
const filtrarJoyas = async (req, res) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;
    const condiciones = [];
    const valores = [];

    if (precio_min) {
      valores.push(precio_min);
      condiciones.push(`precio >= $${valores.length}`);
    }
    if (precio_max) {
      valores.push(precio_max);
      condiciones.push(`precio <= $${valores.length}`);
    }
    if (categoria) {
      valores.push(categoria);
      condiciones.push(`categoria = $${valores.length}`);
    }
    if (metal) {
      valores.push(metal);
      condiciones.push(`metal = $${valores.length}`);
    }

    const where = condiciones.length
      ? `WHERE ${condiciones.join(" AND ")}`
      : "";
    const query = `SELECT * FROM inventario ${where}`;

    const { rows } = await pool.query(query, valores);

    res.json({ joyas: rows });
  } catch (error) {
    console.error("Error en GET /joyas/filtros:", error);
    res.status(500).json({ error: "Error al filtrar joyas" });
  }
};

module.exports = {
  getJoyas,
  filtrarJoyas,
};
