import React from "react";
import { Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");

interface DotProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
}

const DotIndicator = ({ index, scrollX }: DotProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(scrollX.value / screenWidth) === index;

    return {
      width: withTiming(isActive ? 20 : 8),
      backgroundColor: withTiming(isActive ? "#333" : "#aaa"),
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
          marginHorizontal: 4,
        },
        animatedStyle,
      ]}
    />
  );
};

export default DotIndicator;
