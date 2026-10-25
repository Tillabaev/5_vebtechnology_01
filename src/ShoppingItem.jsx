// Отдельный компонент одного товара.
// Получает данные и функцию удаления через props.
export default function ShoppingItem({ item, onDelete }) {
  return (
    <li className="item">
      <span className="item-name">{item.name}</span>
      <span className="item-price">
        {item.price.toLocaleString("ru-RU")} сом
      </span>
      <button className="delete-btn" onClick={() => onDelete(item.id)}>
        Удалить
      </button>
    </li>
  );
}
