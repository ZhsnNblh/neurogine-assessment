import { Product } from '@/types/product';
import { getProductById } from '@/services/productService';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
  setLoading(true);
  setError(false);

  getProductById(id)
    .then((data) => {
      setProduct(data);
      setLoading(false);
    })
    .catch((error) => {
      console.log('Product detail error:', error);
      setError(true);
      setLoading(false);
    });
}, [id, retry]);

  return (
  <ThemedView style={styles.container}>
    {loading ? (
  <ActivityIndicator size="large" />
) : error ? (
  <>
    <ThemedText>
      Failed to load product.
    </ThemedText>

    <Button
      title="Retry"
      onPress={() => {
        setRetry((currentRetry) => currentRetry + 1);
      }}
    />
  </>
) : product ? (
      <ScrollView>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="contain"
        />

        <ThemedText type="title">
          {product.title}
        </ThemedText>

        <ThemedText>
          {product.category}
        </ThemedText>

        <ThemedText>
          ${product.price}
        </ThemedText>

        <ThemedText>
          Rating: {product.rating} ⭐
        </ThemedText>

        <ThemedText>
          {product.description}
        </ThemedText>
      </ScrollView>
    ) : null}
  </ThemedView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  image: {
  width: '100%',
  height: 300,
  marginBottom: 20,
  },
});