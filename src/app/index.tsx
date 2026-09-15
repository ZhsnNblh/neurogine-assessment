import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (skip === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    setError(false);

    getProducts(debouncedSearch, skip, 10)
      .then((data) => {
        if (skip === 0) {
          setProducts(data.products);
        } else {
          setProducts((currentProducts) => [
            ...currentProducts,
            ...data.products,
          ]);
        }

        setHasMore(skip + data.products.length < data.total);

        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log("Product list error:", error);
        setError(true);
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      });
  }, [skip, debouncedSearch, retry]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    setSkip(0);
    setProducts([]);
    setHasMore(true);
  }, [debouncedSearch]);

  const handleRefresh = () => {
    setRefreshing(true);
    setSkip(0);
    setRetry((currentRetry) => currentRetry + 1);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Product Catalog
        </ThemedText>
        <ThemedText type="small" style={styles.headerSubtitle}>
          Thoughtful finds for everyday living
        </ThemedText>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon} accessibilityLabel="Search">
          {'\u2315'}
        </Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products"
          placeholderTextColor="#8A8F98"
          style={styles.searchInput}
          accessibilityLabel="Search products"
        />
      </View>

      <View style={styles.resultsRow}>
        <ThemedText type="small" style={styles.productCount}>
          {products.length} {products.length === 1 ? "product" : "products"}
        </ThemedText>
      </View>

      {loading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#1D6B5B" />
          <ThemedText style={styles.stateTitle}>Finding your next favorite</ThemedText>
          <ThemedText type="small" style={styles.stateMessage}>
            Loading the latest collection...
          </ThemedText>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <View style={styles.stateIcon}>
            <Text style={styles.stateIconText}>!</Text>
          </View>
          <ThemedText style={styles.stateTitle}>We could not load the catalog</ThemedText>
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
      ) : products.length === 0 ? (
        <View style={styles.stateContainer}>
          <View style={styles.stateIcon}>
            <Text style={styles.stateIconText}>{'\u2315'}</Text>
          </View>
          <ThemedText style={styles.stateTitle}>No products found</ThemedText>
          <ThemedText type="small" style={styles.stateMessage}>
            Try a different search term or browse the full collection.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => {
                router.push(`/product/${item.id}`);
              }}
            />
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}

          onEndReached={() => {
            if (!loadingMore && hasMore) {
              setSkip((currentSkip) => currentSkip + 10);
            }
          }}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color="#1D6B5B" />
                <ThemedText type="small" style={styles.loadingMoreText}>
                  Loading more products
                </ThemedText>
              </View>
            ) : null
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 52,
    backgroundColor: '#F6F7F5',
  },
  header: {
    marginBottom: 22,
  },
  searchInput: {
    flex: 1,
    height: 52,
    paddingHorizontal: 10,
    color: '#1E2522',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DCE2DD',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#1E2522',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  searchIcon: {
    color: '#1D6B5B',
    fontSize: 26,
    lineHeight: 28,
  },

  listContent: {
    paddingBottom: 24,
  },

  headerTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: '#1E2522',
  },
  headerSubtitle: {
    color: '#68736D',
    marginTop: 5,
    fontSize: 15,
  },
  resultsRow: {
    marginTop: 18,
    marginBottom: 12,
  },
  productCount: {
    color: '#1D6B5B',
    fontWeight: '700',
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 72,
  },
  stateIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    marginBottom: 16,
    borderRadius: 26,
    backgroundColor: '#DDEBE5',
  },
  stateIconText: {
    color: '#1D6B5B',
    fontSize: 24,
    fontWeight: '700',
  },
  stateTitle: {
    color: '#1E2522',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateMessage: {
    maxWidth: 280,
    marginTop: 6,
    color: '#68736D',
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 116,
    alignItems: 'center',
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
  loadingMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  loadingMoreText: {
    color: '#68736D',
  },
});
