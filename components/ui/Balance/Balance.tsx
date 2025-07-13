import { useRef, useState } from "react";
import { Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { styled, XStack, Text, Spinner } from "tamagui";
import { RefreshCw } from "@tamagui/lucide-icons";

const balanceStyle = {
  ...(Platform.OS === "web" ? { marginLeft: "4%" } : { marginTop: 10 }),
};

const AnimatedText = Animated.createAnimatedComponent(Text);

const AvailableBalance = styled(Text, {
  fontFamily: "Inter",
  fontSize: 14,
  fontWeight: "normal",
  color: "#a3a3a3",
});

const BalanceErrorText = styled(Text, {
  fontWeight: "bold",
  fontFamily: "Inter",
  color: "red",
  fontSize: 14,
});

type BalanceProps = {
  duration: number;
  balanceValue: number;
  animation?: object;
};

const Balance = ({ duration, balanceValue, animation }: BalanceProps) => {
  const refreshClickCount = useRef(0);

  const [balance, setBalance] = useState(balanceValue);
  const [prevBalance, setPrevBalance] = useState(balance);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const oldBalanceY = useSharedValue(0);
  const newBalanceY = useSharedValue(20);
  const oldOpacity = useSharedValue(1);
  const newOpacity = useSharedValue(0);

  const oldBalanceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: oldBalanceY.value }],
    opacity: oldOpacity.value,
    position: "absolute",
  }));

  const newBalanceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: newBalanceY.value }],
    opacity: newOpacity.value,
  }));

  const refreshBalance = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      refreshClickCount.current += 1;

      if (refreshClickCount.current % 3 === 0) {
        setError(true);
      } else {
        setError(false);
      }

      setPrevBalance(balance);
      const newValue = balance + Math.random() * 1000;
      setBalance(newValue);

      oldBalanceY.value = 0;
      oldOpacity.value = 1;
      newBalanceY.value = 20;
      newOpacity.value = 0;

      oldBalanceY.value = withTiming(-16, { duration: duration });
      oldOpacity.value = withTiming(0, { duration: duration });
      newBalanceY.value = withTiming(0, { duration: duration });
      newOpacity.value = withTiming(1, { duration: duration });
    }, 1000);
  };

  return (
    <Animated.View style={[animation, balanceStyle]}>
      <AvailableBalance>Available Balance</AvailableBalance>

      <XStack alignItems="center" height={26}>
        {error ? (
          <BalanceErrorText>Unable to fetch balance</BalanceErrorText>
        ) : (
          <>
            <AnimatedText
              style={oldBalanceStyle}
              fontSize={18}
              fontFamily="InterBold"
              color="$color"
            >
              {`$${prevBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </AnimatedText>

            <AnimatedText
              style={newBalanceStyle}
              fontSize={18}
              fontFamily="InterBold"
              color="$color"
            >
              {`$${balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </AnimatedText>
          </>
        )}

        {!loading ? (
          <RefreshCw
            size={16}
            color="gray"
            marginLeft={8}
            onPress={refreshBalance}
            cursor="pointer"
          />
        ) : (
          <Spinner size="small" color="gray" marginLeft={8} />
        )}
      </XStack>
    </Animated.View>
  );
};

export default Balance;
