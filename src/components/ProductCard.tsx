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
    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    onPress={onPress}
    accessibilityRole="button"
  >
    <View style={styles.imageFrame}>
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>

    <View style={styles.info}>
      <ThemedText
        type="subtitle"
        numberOfLines={2}
        style={styles.productTitle}
      >
        {product.title}
      </ThemedText>

      <ThemedText
        type="small"
        numberOfLines={1}
        style={styles.category}
      >
        {product.category}
      </ThemedText>

      <ThemedText
        type="smallBold"
        style={styles.price}
      >
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
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E3E8E4',
    minHeight: 116,
    shadowColor: '#1E2522',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  cardPressed: {
    opacity: 0.82,
  },

  imageFrame: {
    width: 90,
    height: 90,
    borderRadius: 11,
    marginRight: 14,
    overflow: 'hidden',
    backgroundColor: '#F1F5F1',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  info: {
    flex: 1,
    gap: 4,
  },

  productTitle: {
    fontSize: 17,
    lineHeight: 22,
    color: '#1E2522',
    fontWeight: '700',
  },

  category: {
    color: '#748078',
    textTransform: 'capitalize',
  },

  price: {
    color: '#1D6B5B',
    fontSize: 17,
    marginTop: 2,
  },

});