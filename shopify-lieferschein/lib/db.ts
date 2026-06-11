import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export type Product = {
  id: number;
  shopify_gid: string;
  handle: string;
  title: string;
  description: string;
  category: string;
  vendor: string;
  status: "active" | "draft";
  price_cents: number;
  color_from: string;
  color_to: string;
  synced_at: string;
};

export type Variant = {
  id: number;
  product_id: number;
  size: string;
  sku: string;
  stock: number;
};

export type ProductWithInventory = Product & {
  total_stock: number;
  variant_count: number;
  low_stock_variants: number;
};

export type Stats = {
  product_count: number;
  total_stock: number;
  inventory_value_cents: number;
  low_stock_variants: number;
  out_of_stock_variants: number;
};

const LOW_STOCK_THRESHOLD = 10;

type Seed = {
  title: string;
  description: string;
  category: string;
  status: "active" | "draft";
  price: number; // Cent
  colors: [string, string];
  stock: [number, number, number]; // Größen 35–38, 39–42, 43–46
};

const SEED: Seed[] = [
  {
    title: "Merino Business Classic",
    description:
      "Feine Merinowolle für den Büroalltag. Atmungsaktiv, geruchsneutral und mit verstärkter Ferse — der Standard für lange Tage im Anzug.",
    category: "Business",
    status: "active",
    price: 1490,
    colors: ["#3a3f4b", "#23272f"],
    stock: [42, 118, 96],
  },
  {
    title: "Bio-Baumwolle Crew Marine",
    description:
      "Klassische Crew-Socke aus GOTS-zertifizierter Bio-Baumwolle. Mitteldicke Qualität für jeden Tag, in tiefem Marineblau.",
    category: "Casual",
    status: "active",
    price: 990,
    colors: ["#1f3a5f", "#11213a"],
    stock: [64, 203, 151],
  },
  {
    title: "Sneaker Low-Cut 3er-Pack",
    description:
      "Unsichtbar im Sneaker, sicher am Fuß: Silikon-Grip an der Ferse, flache Zehennaht. Drei Paar in Weiß.",
    category: "Sport",
    status: "active",
    price: 1290,
    colors: ["#d9dde3", "#aab2bd"],
    stock: [88, 176, 42],
  },
  {
    title: "Kaschmir Premium",
    description:
      "Reines Kaschmir in Strickqualität — unser hochwertigstes Paar. Handgekettelte Spitze, limitierte Auflage.",
    category: "Premium",
    status: "active",
    price: 3490,
    colors: ["#b9a08c", "#8a6f5c"],
    stock: [12, 9, 6],
  },
  {
    title: "Tennissocken Retro Stripes",
    description:
      "Frottee-Sohle, klassische Doppelstreifen am Bund. Der Retro-Klassiker für Court und Alltag.",
    category: "Sport",
    status: "active",
    price: 1190,
    colors: ["#f2f2f2", "#c0392b"],
    stock: [31, 87, 64],
  },
  {
    title: "Wandersocken Alpin",
    description:
      "Merino-Mix mit gepolsterten Zonen an Ferse und Ballen. Für lange Touren mit schwerem Schuhwerk.",
    category: "Outdoor",
    status: "active",
    price: 1890,
    colors: ["#4e6e58", "#2c4034"],
    stock: [18, 73, 81],
  },
  {
    title: "Kompressionsstrümpfe Office",
    description:
      "Leichte Stützkompression (Klasse 1) für lange Sitz- und Stehtage. Unauffälliges Design in Anthrazit.",
    category: "Business",
    status: "active",
    price: 2290,
    colors: ["#52565e", "#33363c"],
    stock: [27, 44, 8],
  },
  {
    title: "Bunte Ringel Bio",
    description:
      "Sieben Farben, ein Paar. Bio-Baumwolle mit Elasthan-Anteil — die gute Laune unter dem Hosensaum.",
    category: "Casual",
    status: "active",
    price: 1090,
    colors: ["#e8743b", "#9b59b6"],
    stock: [54, 121, 33],
  },
  {
    title: "Thermo Winter Extra",
    description:
      "Vollfrottee mit Wollanteil und angerauter Innenseite. Für Werkstatt, Winterspaziergang und kalte Füße generell.",
    category: "Outdoor",
    status: "active",
    price: 1490,
    colors: ["#6b7a8f", "#3d4856"],
    stock: [0, 14, 22],
  },
  {
    title: "Bambus Sensitive",
    description:
      "Bambusviskose ohne drückendes Gummibündchen — für empfindliche Haut und Diabetiker geeignet.",
    category: "Casual",
    status: "active",
    price: 1290,
    colors: ["#a3b18a", "#74866a"],
    stock: [39, 66, 47],
  },
  {
    title: "Laufsocken Pro Air",
    description:
      "Mesh-Zonen am Spann, links/rechts-spezifische Passform, blasenfreie Flachnaht. Entwickelt für den Wettkampf.",
    category: "Sport",
    status: "active",
    price: 1690,
    colors: ["#27c4f5", "#1565c0"],
    stock: [22, 58, 5],
  },
  {
    title: "Glitzer Party Edition",
    description:
      "Lurex-Glitzergarn in Gold. Noch im Entwurf — Launch zur nächsten Festtagssaison geplant.",
    category: "Casual",
    status: "draft",
    price: 1390,
    colors: ["#d4af37", "#a67c00"],
    stock: [0, 0, 0],
  },
];

const SIZES = ["35–38", "39–42", "43–46"];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      shopify_gid TEXT NOT NULL,
      handle TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      vendor TEXT NOT NULL,
      status TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      color_from TEXT NOT NULL,
      color_to TEXT NOT NULL,
      synced_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS variants (
      id INTEGER PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id),
      size TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      stock INTEGER NOT NULL
    );
  `);
}

function seedIfEmpty(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) AS n FROM products").get() as {
    n: number;
  };
  if (count.n > 0) return;

  const insertProduct = db.prepare(`
    INSERT INTO products
      (shopify_gid, handle, title, description, category, vendor, status,
       price_cents, color_from, color_to, synced_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertVariant = db.prepare(
    "INSERT INTO variants (product_id, size, sku, stock) VALUES (?, ?, ?, ?)"
  );

  const syncedAt = new Date(Date.now() - 23 * 60 * 1000).toISOString();

  db.transaction(() => {
    SEED.forEach((p, i) => {
      const handle = slugify(p.title);
      const gid = `gid://shopify/Product/84${(7102 + i * 37).toString()}${i}`;
      const result = insertProduct.run(
        gid,
        handle,
        p.title,
        p.description,
        p.category,
        "Sockenwerk GmbH",
        p.status,
        p.price,
        p.colors[0],
        p.colors[1],
        syncedAt
      );
      const productId = Number(result.lastInsertRowid);
      const skuBase = handle
        .split("-")
        .map((w) => w.slice(0, 3).toUpperCase())
        .slice(0, 2)
        .join("");
      p.stock.forEach((stock, j) => {
        insertVariant.run(
          productId,
          SIZES[j],
          `SW-${skuBase}-${SIZES[j].replace("–", "")}`,
          stock
        );
      });
    });
  })();
}

declare global {
  var __demoDb: Database.Database | undefined;
}

export function getDb(): Database.Database {
  if (!globalThis.__demoDb) {
    const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
    fs.mkdirSync(dataDir, { recursive: true });
    const db = new Database(path.join(dataDir, "demo.db"));
    db.pragma("journal_mode = WAL");
    migrate(db);
    seedIfEmpty(db);
    globalThis.__demoDb = db;
  }
  return globalThis.__demoDb;
}

export function listProducts(): ProductWithInventory[] {
  return getDb()
    .prepare(
      `SELECT p.*,
              COALESCE(SUM(v.stock), 0) AS total_stock,
              COUNT(v.id) AS variant_count,
              SUM(CASE WHEN v.stock < ? THEN 1 ELSE 0 END) AS low_stock_variants
       FROM products p
       LEFT JOIN variants v ON v.product_id = p.id
       GROUP BY p.id
       ORDER BY p.title`
    )
    .all(LOW_STOCK_THRESHOLD) as ProductWithInventory[];
}

export function getProduct(
  id: number
): { product: Product; variants: Variant[] } | null {
  const product = getDb()
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(id) as Product | undefined;
  if (!product) return null;
  const variants = getDb()
    .prepare("SELECT * FROM variants WHERE product_id = ? ORDER BY size")
    .all(id) as Variant[];
  return { product, variants };
}

export function getStats(): Stats {
  return getDb()
    .prepare(
      `SELECT COUNT(DISTINCT p.id) AS product_count,
              COALESCE(SUM(v.stock), 0) AS total_stock,
              COALESCE(SUM(v.stock * p.price_cents), 0) AS inventory_value_cents,
              SUM(CASE WHEN v.stock > 0 AND v.stock < ? THEN 1 ELSE 0 END) AS low_stock_variants,
              SUM(CASE WHEN v.stock = 0 THEN 1 ELSE 0 END) AS out_of_stock_variants
       FROM products p
       LEFT JOIN variants v ON v.product_id = p.id`
    )
    .get(LOW_STOCK_THRESHOLD) as Stats;
}

export { LOW_STOCK_THRESHOLD };
