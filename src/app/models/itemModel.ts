export class Item {
  itemId: number;
  name: string;
  brand: string;
  description: string;

  constructor(itemId, name, brand, description) {
    this.itemId = itemId;
    this.name = name;
    this.brand = brand;
    this.description = description;
  }
}
