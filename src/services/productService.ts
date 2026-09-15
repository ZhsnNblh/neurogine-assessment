import { Product } from '@/types/product';

const BASE_URL = 'https://dummyjson.com';

export async function getProducts(
  search: string,
  skip: number,
  limit: number
): Promise<{
  products: Product[];
  total: number;
}> {
  const url = search
    ? `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
    : `${BASE_URL}/products?limit=${limit}&skip=${skip}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();

  return {
    products: data.products,
    total: data.total,
  };
}

export async function getProductById(
  id: string
): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();

  return data;
}