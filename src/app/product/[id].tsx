import { Product } from '@/types/product';
import { getProductById } from '@/services/productService';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
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
  <View style={styles.stateContainer}>
    <ActivityIndicator size="large" color="#1D6B5B" />
    <ThemedText style={styles.stateTitle}>Loading product details</ThemedText>
  </View>
) : error ? (
  <View style={styles.stateContainer}>
    <ThemedText style={styles.stateTitle}>We could not load this product</ThemedText>
    <ThemedText type="small" style={styles.stateMessage}>
      Check your connection and try again.
    </ThemedText>
    <Pressable
      style={styles.retryButton}
      onPress={() => {
        setRetry((currentRetry) => currentRetry + 1);
      }}
      accessibilityRole="button"
    >
      <Text style={styles.retryButtonText}>Try again</Text>
    </Pressable>
  </View>
) : product ? (
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="contain"
        />

        <ThemedText type="small" style={styles.category}>
          {product.category}
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          {product.title}
        </ThemedText>

        <View style={styles.priceRow}>
          <ThemedText type="title" style={styles.price}>
            ${product.price.toFixed(2)}
          </ThemedText>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingStar}>★</Text>
            <ThemedText type="smallBold" style={styles.rating}>
              {product.rating}
            </ThemedText>
          </View>
        </View>

        <View style={styles.brandRow}>
          <ThemedText type="small" style={styles.label}>
            Brand
          </ThemedText>
          <ThemedText type="smallBold" style={styles.brand}>
            {product.brand}
          </ThemedText>
        </View>

        <View style={styles.divider} />
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Description
        </ThemedText>
        <ThemedText type="default" style={styles.description}>
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
    backgroundColor: '#F6F7F5',
  },
  content: {
    padding: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },

  image: {
    width: '100%',
    height: 290,
    marginBottom: 24,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  category: {
    color: '#1D6B5B',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 6,
    color: '#1E2522',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  price: {
    color: '#1D6B5B',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#E8F0E9',
  },
  ratingStar: {
    marginRight: 5,
    color: '#B27718',
    fontSize: 15,
  },
  rating: {
    color: '#425249',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  label: {
    marginRight: 8,
    color: '#748078',
  },
  brand: {
    color: '#1E2522',
  },
  divider: {
    height: 1,
    marginTop: 24,
    marginBottom: 22,
    backgroundColor: '#DCE2DD',
  },
  sectionTitle: {
    color: '#1E2522',
    fontSize: 21,
    lineHeight: 28,
  },
  description: {
    marginTop: 10,
    color: '#53605A',
    lineHeight: 25,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stateTitle: {
    marginTop: 16,
    color: '#1E2522',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateMessage: {
    marginTop: 6,
    color: '#68736D',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#1D6B5B',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});