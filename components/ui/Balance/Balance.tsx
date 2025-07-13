import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

  const balanceStyle =
    Platform.OS === "web" ? styles.balanceWeb : styles.balance;

  return (
    <Animated.View style={[balanceStyle, animation]}>
      <Text style={styles.availableBalance}>Available Balance</Text>

      <View style={styles.balanceRow}>
        {error ? (
          <Text style={[styles.balanceText, { color: "red", fontSize: 14 }]}>
            Unable to fetch balance
          </Text>
        ) : (
          <>
            <Animated.Text style={[styles.balanceText, oldBalanceStyle]}>
              {`$${prevBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </Animated.Text>

            <Animated.Text style={[styles.balanceText, newBalanceStyle]}>
              {`$${balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </Animated.Text>
          </>
        )}

        {!loading ? (
          <TouchableOpacity onPress={refreshBalance}>
            <Ionicons
              name="refresh"
              size={18}
              color="gray"
              style={styles.refreshIcon}
            />
          </TouchableOpacity>
        ) : (
          <ActivityIndicator size={18} style={styles.refreshIcon} />
        )}
      </View>
    </Animated.View>
  );
};

export default Balance;

const styles = StyleSheet.create({
  balance: {
    marginTop: 10,
  },
  balanceWeb: {
    marginLeft: "4%",
  },
  availableBalance: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#a3a3a3",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  refreshIcon: {
    marginLeft: 8,
    cursor: "pointer",
  },
});
