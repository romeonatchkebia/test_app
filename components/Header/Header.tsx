import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Balance from "../ui/Balance/Balance";
import BurgerMenu from "../ui/BurgerMenu/BurgerMenu";

const USERNAME = "John";
const BALANCE = 11341250.75;

const X = 10;
const TIME = 500;
const DELAY = 200;

const Header = () => {
  const offset = useSharedValue(0);
  const opacity = useSharedValue(0);

  const fadeInFromLeft = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    offset.value = withDelay(DELAY, withTiming(X, { duration: TIME }));
    opacity.value = withDelay(DELAY, withTiming(1, { duration: TIME }));
  }, [offset, opacity]);

  const flexDirection = Platform.OS === "web" ? "row" : "column";
  const headerStyle =
    Platform.OS === "web" ? styles.headerContainerWeb : styles.headerContainer;

  return (
    <View style={headerStyle}>
      <View style={styles.avatarMenuContainer}>
        <View
          style={[
            {
              flexDirection: flexDirection,
            },
            styles.profileBalanceContainer,
          ]}
        >
          <View style={styles.profile}>
            <Image
              source={require("../../assets/images/profile-images/man_profile.jpeg")}
              style={styles.avatar}
            />

            <Animated.Text style={[styles.greeting, fadeInFromLeft]}>
              Good evening, {USERNAME}
            </Animated.Text>
          </View>

          <Balance
            duration={TIME}
            balanceValue={BALANCE}
            animation={fadeInFromLeft}
          />
        </View>

        <View style={styles.notificationMenuContainer}>
          <TouchableOpacity style={styles.notificationIconWrapper}>
            <Ionicons name="notifications-outline" size={20} color="gray" />

            <View style={styles.notificationBadge} />
          </TouchableOpacity>

          <BurgerMenu onPress={() => {}} />
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerContainerWeb: {
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  avatarMenuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileBalanceContainer: {
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
  },
  profile: {
    flexDirection: "row",
  },
  menuButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#ecececda",
    width: 36,
    height: 36,
    cursor: "pointer",
  },
  menuButton: {
    gap: 4,
  },
  menuButtonline: {
    height: 2,
    width: 10,
    backgroundColor: "#b2b2b2",
    borderRadius: 20,
  },
  menuButtonMiddleline: {
    height: 2,
    width: 14,
    backgroundColor: "#8d8d8d",
    borderRadius: 20,
  },
  greeting: {
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    height: 36,
  },
  userName: {
    fontWeight: "bold",
  },
  notificationMenuContainer: {
    flexDirection: "row",
  },
  notificationIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginRight: 12,
    backgroundColor: "#ecececda",
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
  },
});
