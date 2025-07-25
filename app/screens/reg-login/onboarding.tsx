import React, { useRef, useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, BackHandler, Alert } from "react-native";
import { router } from "expo-router";
import SignupScreen1Icons from '../../../assets/images/signup_screen_1_icons.svg';
import SignupScreen2Icons from '../../../assets/images/signup_screen_2_icons.svg';
import Google_icon from '../../../assets/images/icons-signup/google-icon.svg';
import GoogleSignInButton from "../../../components/auth/GoogleSignInButton";


// Usage: <UserPill user={user} angle="-10deg" />
export function UserPill({ user, angle = "0deg" }: { user: any, angle?: string }) {
  return (
    <View
      className="bg-white rounded-3xl px-2.5 py-1.5 m-1 flex-row items-center shadow-sm min-w-[120px] max-w-[180px]"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
        transform: [{ rotate: angle }],
      }}
    >
      <Image
        source={user.img}
        className="w-6 h-6 rounded-xl mr-2"
      />
      <View>
        <Text className="text-xs font-bold text-[#23272F]">{user.name}</Text>
        <Text className="text-[10px] text-gray-500">{user.amount}</Text>
      </View>
    </View>
  );
}





const { width } = Dimensions.get("window");


const users = [
  { name: "Ayaan Malik", amount: "PKR 2,350", img: require('../../../assets/images/person_signup/person_1.png') },
  { name: "Zara Ahmed", amount: "PKR 1,980", img: require('../../../assets/images/person_signup/person_2.png') },
  { name: "Fatima Khan", amount: "PKR 3,120", img: require('../../../assets/images/person_signup/person_3.png') },
  { name: "Hassan Raza", amount: "PKR 2,450", img: require('../../../assets/images/person_signup/person_4.png') },
  { name: "Noor Ali", amount: "PKR 1,670", img: require('../../../assets/images/person_signup/person_5.png') },
  { name: "Usman Tariq", amount: "PKR 2,800", img: require('../../../assets/images/person_signup/person_1.png') },
  { name: "Lucas", amount: "PKR 875", img: require('../../../assets/images/person_signup/person_2.png') },
  { name: "Mehak Iqbal", amount: "PKR 2,110", img: require('../../../assets/images/person_signup/person_3.png') },
  { name: "Hamza Farooq", amount: "PKR 3,490", img: require('../../../assets/images/person_signup/person_4.png') },
  { name: "Anaya Shah", amount: "PKR 2,290", img: require('../../../assets/images/person_signup/person_5.png') },
  { name: "Laiba Siddiqi", amount: "PKR 2,750", img: require('../../../assets/images/person_signup/person_1.png') },
  { name: "Danish Qureshi", amount: "PKR 1,940", img: require('../../../assets/images/person_signup/person_2.png') },
];

const slides = [
  {
    key: 1,
    content: (
      <View key={1} className="items-center justify-center" style={{ width }}>
        <SignupScreen1Icons width={width} height={280}  />
      </View>
    ),
    title: "Take Control, Secure Your Future",
    desc: "Track income, expenses, manage goals, and gain valuable money insights",
  },
  {
    key: 2,
    content: (
      <View key={2} className="items-center justify-center" style={{ width }}>
        <SignupScreen2Icons width={width} height={350} className="mt-[120px]" />
      </View>
    ),
    title: "All-in-One Finance Management",
    desc: "Powerful tools to simplify budgeting, track expenses, and meet goals",
  },
  {
    key: 3,
    content: (
      <View key={3} className="items-start justify-center mt-[18%]" style={{ width }}>

        <View className="w-full mt-[10%]">
          {/* Top row: two pills, scattered */}
          <View className="flex-row justify-start items-start px-10">
            <View className="md:[2%]">
            <UserPill user={users[0]} angle="25deg" />
            </View>
            <View className="flex-1" />
            <UserPill user={users[1]} angle="-12deg" />
          </View>
          
          {/* Second row: one pill, centered */}
          <View className="flex-row justify-center ml-[13.8%]">
            <UserPill user={users[2]} angle="0deg" />
          </View>
          
          {/* Third row: three pills, horizontal */}
          <View className="flex-row justify-startap-[1%]">
            <UserPill user={users[3]} angle="0deg" />
            <UserPill user={users[4]} angle="0deg" />
            <UserPill user={users[5]} angle="0deg" />
          </View>
          
          {/* Fourth row: three pills, horizontal */}
          <View className="flex-row justify-start ml-[8%]">
            <UserPill user={users[6]} angle="0deg" />
            <UserPill user={users[7]} angle="0deg" />
            <UserPill user={users[8]} angle="0deg" />
          </View>
          
          {/* Fifth row: three pills, horizontal */}
          <View className="flex-row justify-start">
            <UserPill user={users[9]} angle="0deg" />
            <UserPill user={users[10]} angle="0deg" />
            <UserPill user={users[11]} angle="0deg" />
          </View>
        </View>

      </View>
    ),
    title: "Split Bills, Stress-Free Sharing",
    desc: "Easily create groups to track shared expenses with friends or family",
  },
];

export default function SignupScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [displayPage, setDisplayPage] = useState(0); // For stable text display

  // Prevent going back from onboarding
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Prevent default back action
    });

    return () => backHandler.remove();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (isUserScrolling) return; // Don't auto-slide if user is manually scrolling
    
    const autoSlide = setInterval(() => {
      if (slideDirection === 'forward') {
        if (page === slides.length - 1) {
          // If on last slide, start going backward
          setSlideDirection('backward');
          const nextPage = page - 1;
          setPage(nextPage);
          scrollRef.current?.scrollTo({ x: nextPage * width, animated: true });
        } else {
          // Go to next slide
          const nextPage = page + 1;
          setPage(nextPage);
          scrollRef.current?.scrollTo({ x: nextPage * width, animated: true });
        }
      } else {
        // Going backward
        if (page === 0) {
          // If on first slide, start going forward
          setSlideDirection('forward');
          const nextPage = page + 1;
          setPage(nextPage);
          scrollRef.current?.scrollTo({ x: nextPage * width, animated: true });
        } else {
          // Go to previous slide
          const nextPage = page - 1;
          setPage(nextPage);
          scrollRef.current?.scrollTo({ x: nextPage * width, animated: true });
        }
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(autoSlide);
  }, [page, isUserScrolling, slideDirection]);

  // Update display page with delay to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPage(page);
    }, 300); // Wait for scroll animation to complete

    return () => clearTimeout(timer);
  }, [page]);

  const navigateToLogin = () => {
    router.push("/screens/reg-login/login");
  };
  
  const navigateToEmailAuth = () => {
    router.push("/screens/reg-login/login");
  };

  const handleGoogleSignInSuccess = (data: any) => {

    
    // Handle the response based on whether it's a new user or existing user
    if (data.error) {
      Alert.alert('Error', `User check failed: ${data.errorDetails}`);
      return;
    }
    
    // Show welcome message and navigate to home screen with user data
    if (data.isNewUser) {

            router.push({
              pathname: "../home",
              params: { 
                userData: JSON.stringify(data.user),
                isNewUser: 'true'
              }
            });
    } else {
  
            router.push({
              pathname: "../home",
              params: { 
                userData: JSON.stringify(data.user),
                isNewUser: 'false'
              }
            });
    }
  }; 

  // Ensure page is always within valid bounds
  React.useEffect(() => {
    if (page < 0 || page >= slides.length) {
      setPage(0);
    }
  }, [page]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    // Ensure page stays within bounds
    const validSlide = Math.max(0, Math.min(slide, slides.length - 1));
    
    // Only update page if it actually changed to prevent flickering
    if (validSlide !== page) {
      setPage(validSlide);
    }
    
    // Detect if user is manually scrolling
    setIsUserScrolling(true);
    
    // Reset the flag after a short delay to resume auto-slide
    setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-[#00c795]">
      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        className="flex-grow-0"
      >
        {slides.map((slide) => (
          <React.Fragment key={slide.key}>{slide.content}</React.Fragment>
        ))}
      </ScrollView>

      {/* Static Bottom Section */}
      <View className="bg-white rounded-t-3xl p-8 absolute bottom-0 w-full min-h-[370px]">
        <Text className="font-bold text-lg text-center mb-2">{slides[displayPage]?.title || slides[0].title}</Text>
        <Text className="text-gray-500 text-sm text-center mb-4">{slides[displayPage]?.desc || slides[0].desc}</Text>
        {/* Progress Dots */}
        <View className="flex-row justify-center mb-6">
          {slides.map((_, idx) => (
            <View key={idx} className={`w-6 h-1 rounded-sm mx-0.5 ${(displayPage >= 0 && displayPage < slides.length && displayPage === idx) ? 'bg-[#19E28A]' : 'bg-gray-300'}`} />
          ))}
        </View>
        {/* Google Button */}
        <GoogleSignInButton
          onSuccess={handleGoogleSignInSuccess}
        />
        {/* Email Button */}
        <TouchableOpacity 
          className="bg-[#23272F] rounded-xl py-3.5 flex-row items-center justify-center mb-3"
          onPress={navigateToEmailAuth}
        >
          <Text className="text-white font-bold text-base">
            Continue with Email
          </Text>
        </TouchableOpacity>
        {/* Sign In Link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-700">Already have an account? </Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text className="text-[#00c795] font-medium">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 