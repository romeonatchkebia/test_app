import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header/Header";
import HeroSlider from "../components/HeroSlider/HeroSlider";

const slides = [
  {
    id: "1",
    title: "Welcome to Waive",
    subtitle: "Start managing smarter.",
    image:
      "https://static.toiimg.com/photo/msid-110593191,width-96,height-65.cms",
    ctaLabel: "Get Started",
    onPress: () => console.log("Start"),
  },
  {
    id: "2",
    title: "Insightful Analytics",
    subtitle: "Visualize your data clearly.",
    image:
      "https://www.grandsierraresort.com/hubfs/casino/GSR-casino-floor-view-of-table-games-and-slots_q085_1920x1080.jpg",
  },
  {
    id: "3",
    title: "Reliable Automation",
    subtitle: "Free your time with powerful automation.",
    image:
      "https://www.wien.info/resource/image/295426/Video-Header/1920/1080/8905c10fa129125d2bfb09a82876fdd2/8AB4404C7630BAD000F7913A7B65BE98/casino-wien-1-.web",
  },
];

export default function Home() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Header />
      <HeroSlider slides={slides} />
    </SafeAreaView>
  );
}
