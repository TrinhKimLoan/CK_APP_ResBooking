// app/(user)/home.tsx
import { View, Text, Image, TouchableOpacity, FlatList, ScrollView } from "react-native";

export default function HomeScreen() {
  const featuredTables = [
    {
      id: "1",
      name: "Bàn B3 - Tầng 2",
      desc: "Bàn 4 người",
      image: require("@/assets/app/seat.png"),
    },
    {
      id: "2",
      name: "Bàn B7 - Tầng 3",
      desc: "Bàn 6 người",
      image: require("@/assets/app/seat.png"),
    },
    {
      id: "3",
      name: "Bàn B5",
      desc: "Bàn 2 người",
      image: require("@/assets/app/seat.png"),
    },
  ];

  const featuredFoods = [
    {
      id: "1",
      name: "Gà rán",
      price: "150.000 VND",
      image: require("@/assets/app/food.png"),
    },
    {
      id: "2",
      name: "Gà rán",
      price: "150.000 VND",
      image: require("@/assets/app/food.png"),
    },
    {
      id: "3",
      name: "Gà rán",
      price: "150.000 VND",
      image: require("@/assets/app/food.png"),
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      
      {/* --- BANNER --- */}
      <View className="w-full h-56">
        <Image
          source={require("@/assets/app/banner.png")}
          className="w-full h-full"
          resizeMode="cover"
        />

        <View className="absolute top-16 left-4">
          <Text className="text-2xl text-white font-bold">
            Nhà hàng phong cách Á - Âu
          </Text>
          <Text className="text-white mt-1">
            Không gian ấm cúng cho mọi bữa tiệc
          </Text>

          <TouchableOpacity className="mt-4 bg-orange-500 rounded-xl px-6 py-3">
            <Text className="text-white font-semibold text-lg">Đặt bàn ngay</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CHỖ NGỒI NỔI BẬT --- */}
      <View className="px-4 mt-6">
        <Text className="font-bold text-lg mb-3">Chỗ ngồi nổi bật</Text>

        <FlatList
          data={featuredTables}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="mr-4 bg-white rounded-xl shadow-sm w-40">
              <Image
                source={item.image}
                className="w-full h-28 rounded-xl"
              />
              <View className="p-2">
                <Text className="font-semibold">{item.name}</Text>
                <Text className="text-gray-500 text-sm">{item.desc}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* --- MÓN ĂN --- */}
      <View className="px-4 mt-8">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="font-bold text-lg">Các món ăn</Text>
          <Text className="text-gray-500">Xem tất cả</Text>
        </View>

        <FlatList
          data={featuredFoods}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="mr-4 bg-white rounded-xl shadow-sm w-40">
              <Image
                source={item.image}
                className="w-full h-28 rounded-xl"
              />
              <View className="p-2">
                <Text className="font-semibold">{item.name}</Text>
                <Text className="text-orange-600">{item.price}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* --- VỀ CHÚNG TÔI --- */}
      <View className="mx-4 mt-8 mb-10 bg-gray-100 p-4 rounded-xl">
        <Text className="font-bold text-lg mb-2">Về chúng tôi</Text>
        <Text className="text-gray-600 mb-3">
          Mô tả ngắn về nhà hàng....
        </Text>

        <View className="mt-1 space-y-2">
          <Text>🕒 Giờ mở cửa</Text>
          <Text>📞 Hotline</Text>
          <Text>📍 Địa điểm</Text>
        </View>
      </View>
    </ScrollView>
  );
}
