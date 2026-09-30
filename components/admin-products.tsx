"use client";

import { useEffect, useState } from "react";
import { Archive, ChevronLeft, ChevronRight, LoaderCircle, Pencil, Plus, Save, X } from "lucide-react";

type Variant = { sku: string; size: number; price: number; stock: number; color: string; images?: string[]; reservedStock?: number };
type AdminProduct = {
  _id: string; slug: string; name: string; subtitle?: string;
  category: "Road" | "Court" | "Everyday"; price?: number; colorway?: string;
  tone?: "chalk" | "volt" | "ember" | "slate"; sizes?: number[]; images?: string[];
  placeholder?: boolean; status: "draft" | "published" | "archived";
  description?: string; seoTitle?: string; seoDescription?: string; variants: Variant[];
};
type ProductForm = {
  name: string; slug: string; subtitle: string; category: "Road" | "Court" | "Everyday";
  price: string; colorway: string; tone: "chalk" | "volt" | "ember" | "slate";
  size: string; sku: string; stock: string; image: string; description: string;
  status: "draft" | "published" | "archived"; seoTitle: string; seoDescription: string;
};
const emptyForm: ProductForm = {
  name: "", slug: "", subtitle: "", category: "Everyday", price: "",
  colorway: "Chalk / Black", tone: "chalk", size: "8", sku: "", stock: "0",
  image: "", description: "", status: "draft", seoTitle: "", seoDescription: ""
};

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export function AdminProducts() {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("active");
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let current = true;
    async function loadProducts() {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ page: String(page), limit: "20", status });
      if (appliedQuery) params.set("q", appliedQuery);
      try {
        const response = await fetch("/api/admin/products?" + params.toString(), { cache: "no-store" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Products could not be loaded.");
        if (current) {
          setItems(result.data);
          setTotal(result.total);
          setPages(result.pages);
        }
      } catch (cause) {
        if (current) setError(cause instanceof Error ? cause.message : "Products could not be loaded.");
      } finally {
        if (current) setLoading(false);
      }
    }
    void loadProducts();
    return () => { current = false; };
  }, [page, status, appliedQuery, refresh]);

  function startNew() {
    setEditing(null);
    setFormOpen(true);
    setNotice("");
  }

  function startEdit(product: AdminProduct) {
    setEditing(product);
    setFormOpen(true);
    setNotice("");
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") || "").trim(),
      slug: String(data.get("slug") || "").trim(),
      subtitle: String(data.get("subtitle") || "").trim(),
      category: String(data.get("category")),
      price: Number(data.get("price")),
      colorway: String(data.get("colorway") || "").trim(),
      tone: String(data.get("tone")),
      size: Number(data.get("size")),
      sku: String(data.get("sku") || "").trim(),
      stock: Number(data.get("stock")),
      image: String(data.get("image") || "").trim(),
      description: String(data.get("description") || "").trim(),
      status: String(data.get("status")),
      seoTitle: String(data.get("seoTitle") || "").trim(),
      seoDescription: String(data.get("seoDescription") || "").trim()
    };

    try {
      const endpoint = editing ? "/api/admin/products/" + editing._id : "/api/admin/products";
      const response = await fetch(endpoint, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Product could not be saved.");
      setFormOpen(false);
      setEditing(null);
      setNotice(editing ? "Product updated." : "Product added.");
      setRefresh((value) => value + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Product could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function archiveProduct(product: AdminProduct) {
    const confirmed = window.confirm("Remove " + product.name + " from the active shop? It will be archived so past order references stay intact.");
    if (!confirmed) return;
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/products/" + product._id, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Product could not be archived.");
      setNotice(result.message || "Product archived.");
      setRefresh((value) => value + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Product could not be archived.");
    }
  }

  function searchProducts(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setAppliedQuery(query.trim());
  }

  return (
    <div className="admin-content">
      <div className="admin-content__top">
        <div><span className="section-kicker">STORE / CATALOGUE</span><h2>Products</h2><p>Keep product names, prices, stock, and search details up to date.</p></div>
        <button className="button-primary admin-add-button" type="button" onClick={startNew}><Plus size={16} /> Add product</button>
      </div>
      <div className="admin-toolbar">
        <form className="admin-search" onSubmit={searchProducts}>
          <label className="sr-only" htmlFor="admin-product-search">Search products</label>
          <input id="admin-product-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, link, or SKU" />
          <button type="submit">Search</button>
        </form>
        <label className="admin-filter"><span className="sr-only">Filter products</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="active">Active + draft</option><option value="published">Published</option><option value="draft">Drafts</option><option value="archived">Archived</option></select></label>
        <span className="admin-count">{total} product{total === 1 ? "" : "s"}</span>
      </div>

      {notice && <p className="admin-feedback admin-feedback--success" role="status">{notice}</p>}
      {error && <p className="admin-feedback admin-feedback--error" role="alert">{error}</p>}

      {formOpen && (
        <form className="admin-product-form" onSubmit={saveProduct} key={editing?._id || "new-product"}>
          <div className="admin-product-form__top">
            <div><span className="section-kicker">{editing ? "UPDATE CATALOGUE" : "NEW CATALOGUE ITEM"}</span><h3>{editing ? "Edit product" : "Add a product"}</h3></div>
            <button type="button" className="icon-button" aria-label="Close product form" onClick={() => { setFormOpen(false); setEditing(null); }}><X size={19} /></button>
          </div>
          <div className="admin-form-grid">
            <label>Product name<input name="name" required maxLength={160} defaultValue={editing?.name || emptyForm.name} placeholder="Everyday Runner" /></label>
            <label>URL name<input name="slug" maxLength={180} defaultValue={editing?.slug || emptyForm.slug} placeholder="Leave blank to create automatically" /></label>
            <label>Category<select name="category" defaultValue={editing?.category || emptyForm.category}><option>Road</option><option>Court</option><option>Everyday</option></select></label>
            <label>Price (INR)<input name="price" type="number" min="0" max="10000000" step="1" required defaultValue={editing ? String(editing.price ?? editing.variants?.[0]?.price ?? 0) : emptyForm.price} /></label>
            <label>SKU<input name="sku" required maxLength={64} defaultValue={editing ? (editing.variants?.[0]?.sku || "") : emptyForm.sku} placeholder="RNT-001-UK8" /></label>
            <label>UK size<input name="size" type="number" min="1" max="16" required defaultValue={editing ? String(editing.variants?.[0]?.size || 8) : emptyForm.size} /></label>
            <label>Stock for this size<input name="stock" type="number" min="0" max="100000" required defaultValue={editing ? String(editing.variants?.[0]?.stock ?? 0) : emptyForm.stock} /></label>
            <label>Colour description<input name="colorway" required maxLength={80} defaultValue={editing ? (editing.colorway || editing.variants?.[0]?.color || emptyForm.colorway) : emptyForm.colorway} /></label>
            <label>Image URL<input name="image" type="text" maxLength={500} defaultValue={editing ? (editing.images?.[0] || editing.variants?.[0]?.images?.[0] || "") : emptyForm.image} placeholder="https://images.unsplash.com/…" /></label>
            <label>Image tone<select name="tone" defaultValue={editing?.tone || emptyForm.tone}><option value="chalk">Chalk</option><option value="slate">Slate</option><option value="ember">Ember</option><option value="volt">Volt</option></select></label>
            <label>Status<select name="status" defaultValue={editing?.status || emptyForm.status}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
            <label className="admin-form-grid__wide">Short description<textarea name="description" rows={3} maxLength={6000} defaultValue={editing?.description || emptyForm.description} /></label>
            <label>SEO title<input name="seoTitle" maxLength={70} defaultValue={editing?.seoTitle || emptyForm.seoTitle} /></label>
            <label>SEO description<input name="seoDescription" maxLength={170} defaultValue={editing?.seoDescription || emptyForm.seoDescription} /></label>
          </div>
          <p className="admin-form-hint">Published products appear in the shop and sitemap. Drafts stay private. Images are sample stock references until replaced with approved RNT product photos.</p>
          <div className="admin-product-form__actions">
            <button type="button" className="button-secondary" onClick={() => { setFormOpen(false); setEditing(null); }}>Cancel</button>
            <button type="submit" className="button-primary" disabled={saving}>{saving ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}{saving ? "Saving…" : "Save product"}</button>
          </div>
        </form>
      )}

      <div className="admin-content__table-wrap">
        {loading ? <div className="admin-loading"><LoaderCircle className="spin" size={18} /> Loading products…</div> : items.length ? (
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Sizes / stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((product) => {
                const stock = product.variants?.reduce((sum, variant) => sum + Math.max(0, variant.stock - (variant.reservedStock ?? 0)), 0) || 0;
                const sizes = product.variants?.map((variant) => variant.size).filter((size, index, list) => list.indexOf(size) === index).join(", ") || "—";
                return (
                  <tr key={product._id}>
                    <td><strong>{product.name}</strong><small>/{product.slug}</small></td>
                    <td>{product.category}</td>
                    <td>{money(product.price ?? product.variants?.[0]?.price ?? 0)}</td>
                    <td><span>UK {sizes}</span><small>{stock} in stock</small></td>
                    <td><span className={"admin-product-status admin-product-status--" + product.status}>{product.status}</span></td>
                    <td><div className="admin-row-actions"><button type="button" onClick={() => startEdit(product)} aria-label={"Edit " + product.name}><Pencil size={15} /> Edit</button>{product.status !== "archived" && <button type="button" onClick={() => void archiveProduct(product)} aria-label={"Archive " + product.name}><Archive size={15} /> Remove</button>}</div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : error ? <p className="admin-empty">Connect the MongoDB database to manage live catalogue records.</p> : <p className="admin-empty">No products here yet. Add your first product to get started.</p>}
      </div>
      <div className="admin-pagination">
        <span>Page {page} of {pages}</span>
        <div>
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1 || loading} aria-label="Previous page"><ChevronLeft size={17} /> Previous</button>
          <button type="button" onClick={() => setPage((value) => Math.min(pages, value + 1))} disabled={page >= pages || loading} aria-label="Next page">Next <ChevronRight size={17} /></button>
        </div>
      </div>
    </div>
  );
}

