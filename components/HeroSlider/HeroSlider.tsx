import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import DotIndicator from "../ui/DotIndicator/DotIndicator";
import { Image, View, Text, styled } from "tamagui";

const { width } = Dimensions.get("window");

const CardButton = styled(TouchableOpacity, {
  marginTop: 12,
  backgroundColor: "#fff",
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 6,
  alignSelf: "flex-start",
});

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonLabel?: string;
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
  const [paused, setPaused] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const renderSlideItem = ({ item, index }: { item: Slide; index: number }) => (
    <View width={width} height={250} jc="center" position="relative">
      <Image
        source={{ uri: item.image }}
        width="100%"
        height="100%"
        position="absolute"
      />

      <View flex={1} jc="flex-end" px={16} py={24} bg="rgba(0,0,0,0.3)">
        <Text color="#fff" fontSize={20} fontFamily="InterBold">
          {item.title}
        </Text>

        <Text color="#fff" fontSize={16} fontFamily="Inter" marginTop={4}>
          {item.subtitle}
        </Text>

        {item.buttonLabel && item.onPress && (
          <CardButton onPress={item.onPress}>
            <Text color="black" fontWeight={600}>
              {item.buttonLabel}
            </Text>
          </CardButton>
        )}
      </View>
    </View>
  );

  return (
    <View width="100%">
      <FlatList
        ref={scrollRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderSlideItem}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScroll={scrollHandler}
        onTouchStart={onUserInteraction}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />

      <View fd="row" jc="center" marginTop={12}>
        {slides.map((_, i) => (
          <DotIndicator key={`dot-${i}`} index={i} scrollX={scrollX} />
        ))}
      </View>
    </View>
  );
};

export default HeroSlider;
