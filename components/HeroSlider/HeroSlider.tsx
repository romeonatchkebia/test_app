import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import DotIndicator from "../ui/DotIndicator/DotIndicator";

const { width } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel?: string;
  onPress?: () => void;
}

interface HeroSliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  delay?: number;
}

const HeroSlider = ({
  slides,
  autoPlay = true,
  delay = 4000,
}: HeroSliderProps) => {
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<FlatList<Slide> | null>(null);

  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [imageLoaded, setImageLoaded] = useState<boolean[]>(
    Array(slides.length).fill(false)
  );
  const [paused, setPaused] = useState(false);

  const startAutoPlay = () => {
    stopAutoPlay();

    if (!paused) {
      timerRef.current = setTimeout(() => {
        const nextIndex = (index + 1) % slides.length;

        scrollRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        setIndex(nextIndex);
      }, delay);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      startAutoPlay();
    }
    return stopAutoPlay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, autoPlay]);

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const onUserInteraction = () => {
    stopAutoPlay();
    setPaused(true);
    setTimeout(() => setPaused(false), 2000);
  };

  const scrollHandler = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={scrollRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index: i }) => (
          <View style={styles.slide}>
            <Image
              source={{ uri: item.image }}
              style={styles.backgroundImage}
              onLoad={() =>
                setImageLoaded((prev) => {
                  const updated = [...prev];
                  updated[i] = true;
                  return updated;
                })
              }
              onError={() =>
                setImageLoaded((prev) => {
                  const updated = [...prev];
                  updated[i] = false;
                  return updated;
                })
              }
            />
            {!imageLoaded[i] && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color="#999" />
              </View>
            )}
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>

              {item.ctaLabel && item.onPress && (
                <TouchableOpacity style={styles.button} onPress={item.onPress}>
                  <Text style={styles.buttonText}>{item.ctaLabel}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        getItemLayout={(_, index) => ({
          length: width, // Each item's width is the screen width
          offset: width * index, // Offset for item at 'index'
          index,
        })}
        onScroll={scrollHandler}
        onTouchStart={onUserInteraction}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />

      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <DotIndicator key={`dot-${i}`} index={i} scrollX={scrollX} />
        ))}
      </View>
    </View>
  );
};

export default HeroSlider;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  slide: {
    width,
    height: 250,
    justifyContent: "center",
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
