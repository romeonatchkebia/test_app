import { TouchableOpacity } from "react-native";
import { styled, View, YStack } from "tamagui";

// Styled components
const MenuWrapper = styled(TouchableOpacity, {
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 18,
  backgroundColor: "#ecececda",
  width: 36,
  height: 36,
  cursor: "pointer",
});

const MenuLine = styled(View, {
  height: 2,
  width: 10,
  backgroundColor: "#b2b2b2",
  borderRadius: 20,
});

const MenuMiddleLine = styled(MenuLine, {
  width: 14,
  backgroundColor: "#8d8d8d",
});

type BurgerMenuProps = {
  onPress: () => void;
};

const BurgerMenu = ({ onPress }: BurgerMenuProps) => {
  return (
    <MenuWrapper onPress={onPress}>
      <View>
        <YStack gap="$1.5">
          <MenuLine alignSelf="flex-end" />
          <MenuMiddleLine />
          <MenuLine />
        </YStack>
      </View>
    </MenuWrapper>
  );
};

export default BurgerMenu;
