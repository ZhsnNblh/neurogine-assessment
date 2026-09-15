import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Product } from '@/types/product';

type ProductCardProps = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({
  product,
  onPress,
}: ProductCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.info}>
        <ThemedText
          type="subtitle"
          numberOfLines={2}
        >
          {product.title}
        </ThemedText>

        <ThemedText
  type="default"
  numberOfLines={1}
>
  {product.category}
</ThemedText>

        <ThemedText type="smallBold">
            ${product.price.toFixed(2)}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eeeeee',
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: '#f5f5f5',
  },

  info: {
    flex: 1,
    gap: 6,
  },
});