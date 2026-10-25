import { useEffect, useState } from "react";
import ShoppingItem from "./ShoppingItem";
import "./App.css";

const API_URL = "https://inai-col1.fishrungames.com";

// Метка, по которой отличаем товары списка покупок от обычных объявлений
const TAG = "shopping-list";

// Бэкенд ждёт поле image, поэтому отправляем крошечную картинку-заглушку
function makePlaceholderImage() {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

// Преобразуем объект с сервера в формат, который ждёт ShoppingItem
function toItem(ad) {
  return { id: ad.id, name: ad.title, price: Number(ad.price) };
}

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // GET: загрузка списка при открытии страницы
  useEffect(() => {
    async function loadItems() {
      try {
        const response = await fetch(`${API_URL}/ads`);
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        const data = await response.json();
        setItems(data.items.map(toItem));
      } catch (err) {
        setError(`Не удалось загрузить список: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  // POST: добавление товара
  async function handleAdd(e) {
    e.preventDefault();

    const trimmedName = name.trim();
    const numericPrice = parseFloat(price);
    if (trimmedName === "" || isNaN(numericPrice) || numericPrice < 0) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const image = await makePlaceholderImage();

      const formData = new FormData();
      formData.append("title", trimmedName);
      formData.append("description", TAG);
      formData.append("price", numericPrice);
      formData.append("image", image, "item.png");

      const response = await fetch(`${API_URL}/ads`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      const created = await response.json();

      setItems([...items, toItem(created)]);
      setName("");
      setPrice("");
    } catch (err) {
      setError(`Не удалось добавить товар: ${err.message}`);
    } finally {
      setSending(false);
    }
  }

  // Удаление только из state (в API нет запроса на удаление)
  function handleDelete(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="app">
      <h1>Список покупок</h1>

      <form className="form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Название товара"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Цена"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit" disabled={sending}>
          {sending ? "..." : "Добавить"}
        </button>
      </form>

      {error && <p style={{ color: "#c62828" }}>{error}</p>}
      {loading && <p className="empty">Загрузка...</p>}

      {!loading && items.length === 0 ? (
        <p className="empty">Список пуст</p>
      ) : (
        <ul className="list">
          {items.map((item) => (
            <ShoppingItem key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </ul>
      )}

      <p className="total">
        Общая стоимость: <strong>{total.toLocaleString("ru-RU")} сом</strong>
      </p>
    </div>
  );
}