import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  TextInput,
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
      <ThemedText type="title">Product Catalog</ThemedText>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search products..."
        style={styles.searchInput}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <>
          <ThemedText>Failed to load products.</ThemedText>

          <Button
            title="Retry"
            onPress={() => {
              setRetry((currentRetry) => currentRetry + 1);
            }}
          />
        </>
      ) : products.length === 0 ? (
        <ThemedText>No products found.</ThemedText>
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
            loadingMore ? <ActivityIndicator size="small" /> : null
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 12,
    backgroundColor: "#ffffff",
  },

  listContent: {
    paddingBottom: 20,
  },
});
