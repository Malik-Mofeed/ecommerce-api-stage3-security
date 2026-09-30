const pool = require("../config/database");
const validator = require("validator"); 
// GET all products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        category_id,
        name,
        description,
        price,
        quantity_stock,
        sku,
        is_active,
        created_at
      FROM products
      ORDER BY id DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
// GET product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({
      message: "Product ID must be a positive integer",
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        category_id,
        name,
        description,
        price,
        quantity_stock,
        sku,
        is_active,
        created_at
      FROM products
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
// CREATE product
const createProduct = async (req, res) => {
  const {
    category_id,
    name,
    description,
    price,
    quantity_stock,
    sku,
  } = req.body;
  







if (/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(name || "")) {
  return res.status(400).json({
    message: "Invalid product name",
  });
}

if (/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(description || "")) {
  return res.status(400).json({
    message: "Invalid product description",
  });
}








  // Validate required fields
  if (!category_id || !name || price === undefined || !sku) {
    return res.status(400).json({
      message: "category_id, name, price and sku are required",
    });
  }

  // Validate price
  if (Number(price) <= 0) {
    return res.status(400).json({
      message: "Price must be greater than 0",
    });
  }

  // Validate stock
  if (quantity_stock !== undefined && Number(quantity_stock) < 0) {
    return res.status(400).json({
      message: "Stock cannot be negative",
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO products
      (category_id, name, description, price, quantity_stock, sku, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING
        id,
        category_id,
        name,
        description,
        price,
        quantity_stock,
        sku,
        is_active,
        created_at
      `,
      [
        category_id,
        name,
        description || null,
        price,
        quantity_stock ?? 0,
        sku,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "SKU already exists",
      });
    }

    console.error("Error creating product:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
// UPDATE product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({
      message: "Product ID must be a positive integer",
    });
  }

  const {
    category_id,
    name,
    description,
    price,
    quantity_stock,
    sku,
    is_active,
  } = req.body;
  




  
if (/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(name || "")) {
  return res.status(400).json({
    message: "Invalid product name",
  });
}

if (/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(description || "")) {
  return res.status(400).json({
    message: "Invalid product description",
  });
}






  if (!category_id || !name || price === undefined || !sku) {
    return res.status(400).json({
      message: "category_id, name, price and sku are required",
    });
  }

  if (Number(price) <= 0) {
    return res.status(400).json({
      message: "Price must be greater than 0",
    });
  }

  if (quantity_stock !== undefined && Number(quantity_stock) < 0) {
    return res.status(400).json({
      message: "Stock cannot be negative",
    });
  }

  try {
    const result = await pool.query(
      `
      UPDATE products
      SET
        category_id = $1,
        name = $2,
        description = $3,
        price = $4,
        quantity_stock = $5,
        sku = $6,
        is_active = $7,
        updated_at = NOW()
      WHERE id = $8
      RETURNING
        id,
        category_id,
        name,
        description,
        price,
        quantity_stock,
        sku,
        is_active,
        created_at,
        updated_at
      `,
      [
        category_id,
        name,
        description || null,
        price,
        quantity_stock ?? 0,
        sku,
        is_active ?? true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "SKU already exists",
      });
    }

    console.error("Error updating product:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
// DEACTIVATE product
const deactivateProduct = async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({
      message: "Product ID must be a positive integer",
    });
  }

  try {
    const result = await pool.query(
      `
      UPDATE products
      SET is_active = false,
          updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        name,
        is_active,
        updated_at
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error deactivating product:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
   deactivateProduct,
};