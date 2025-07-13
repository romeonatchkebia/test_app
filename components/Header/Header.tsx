import { useEffect } from "react";
import { Platform, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { styled, Text, XStack, YStack, Image, View, Stack } from "tamagui";
import Balance from "../ui/Balance/Balance";
import BurgerMenu from "../ui/BurgerMenu/BurgerMenu";
import Ionicons from "@expo/vector-icons/Ionicons";

const USERNAME = "John";
const BALANCE = 11341250.75;

const X = 10;
const TIME = 500;
const DELAY = 200;

const GreetingText = Animated.createAnimatedComponent(Text);

const NotificationBadge = styled(View, {
  position: "absolute",
  top: 8,
  right: 10,
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "red",
});
const NotificationButton = styled(TouchableOpacity, {
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  marginRight: 12,
  backgroundColor: "#ecececda",
  width: 36,
  height: 36,
  borderRadius: 18,
});

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

  const isWeb = Platform.OS === "web";

  return (
    <YStack
      justifyContent="space-between"
      px={16}
      py={16}
      backgroundColor="white"
      elevation={4}
      shadowColor="#000"
      shadowOpacity={0.1}
      shadowOffset={{ width: 0, height: 2 }}
      shadowRadius={4}
    >
      <XStack justifyContent="space-between">
        <XStack flex={1} flexDirection={isWeb ? "row" : "column"}>
          <XStack ai="center">
            <Image
              source={require("../../assets/images/profile-images/man_profile.jpeg")}
              width={36}
              height={36}
              borderRadius={50}
            />
            <GreetingText
              style={fadeInFromLeft}
              fontFamily={"Inter"}
              fontSize={14}
              color={"#333"}
              px={10}
              py={8}
              borderWidth={1}
              borderColor={"black"}
              borderRadius={20}
              height={36}
            >
              Good evening, {USERNAME}
            </GreetingText>
          </XStack>

          <Balance
            duration={TIME}
            balanceValue={BALANCE}
            animation={fadeInFromLeft}
          />
        </XStack>

        <XStack>
          <NotificationButton>
            <Ionicons name="notifications-outline" size={20} color="gray" />

            <NotificationBadge />
          </NotificationButton>

          <Stack
            width={36}
            height={36}
            ai="center"
            jc="center"
            br={18}
            bg="#ecececda"
          >
            <BurgerMenu onPress={() => {}} />
          </Stack>
        </XStack>
      </XStack>
    </YStack>
  );
};

export default Header;
