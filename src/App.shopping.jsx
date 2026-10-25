import { useState } from "react";
import ShoppingItem from "./ShoppingItem";
import "./App.css";

export default function App() {
  // state: список товаров
  const [items, setItems] = useState([
    { id: 1, name: "Хлеб", price: 40 },
    { id: 2, name: "Молоко", price: 95 },
  ]);

  // state: поля формы
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // Добавление товара
  function handleAdd(e) {
    e.preventDefault();

    const trimmedName = name.trim();
    const numericPrice = parseFloat(price);

    if (trimmedName === "" || isNaN(numericPrice) || numericPrice < 0) {
      return;
    }

    const newItem = {
      id: Date.now(),
      name: trimmedName,
      price: numericPrice,
    };

    setItems([...items, newItem]);
    setName("");
    setPrice("");
  }

  // Удаление товара по id
  function handleDelete(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  // Общая стоимость
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
        <button type="submit">Добавить</button>
      </form>

      {items.length === 0 ? (
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
