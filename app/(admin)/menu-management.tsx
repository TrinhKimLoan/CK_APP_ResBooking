// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   Alert, 
//   StyleSheet,
//   ScrollView 
// } from 'react-native';
// import { supabase } from '@/lib/supabase';
// import { useAuth } from '@/context/auth';

// export default function AdminMenuScreen() {
//   const { role } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     description: '',
//     img: ''
//   });

//   const handleAddMenu = async () => {
//     if (!formData.name || !formData.price) {
//       Alert.alert('Lỗi', 'Vui lòng điền tên và giá món ăn');
//       return;
//     }

//     setLoading(true);

//     try {
//       const { data, error } = await supabase
//         .from('menu')
//         .insert([
//           {
//             name: formData.name,
//             price: parseFloat(formData.price),
//             description: formData.description,
//             img: formData.img
//           }
//         ])
//         .select();

//       if (error) {
//         throw error;
//       }

//       Alert.alert('Thành công', 'Đã thêm món ăn vào menu!');
      
//       // Reset form
//       setFormData({
//         name: '',
//         price: '',
//         description: '',
//         img: ''
//       });

//     } catch (error: any) {
//       Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Chỉ admin mới được thêm món
//   if (role !== 'admin') {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>Chỉ admin mới có quyền truy cập</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Thêm Món Ăn Mới</Text>
      
//       <View style={styles.form}>
//         <Text style={styles.label}>Tên món ăn *</Text>
//         <TextInput
//           style={styles.input}
//           value={formData.name}
//           onChangeText={(text) => setFormData({...formData, name: text})}
//           placeholder="Nhập tên món ăn"
//         />

//         <Text style={styles.label}>Giá *</Text>
//         <TextInput
//           style={styles.input}
//           value={formData.price}
//           onChangeText={(text) => setFormData({...formData, price: text})}
//           placeholder="Nhập giá"
//           keyboardType="numeric"
//         />

//         <Text style={styles.label}>Mô tả</Text>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           value={formData.description}
//           onChangeText={(text) => setFormData({...formData, description: text})}
//           placeholder="Mô tả món ăn"
//           multiline
//           numberOfLines={3}
//         />

//         <Text style={styles.label}>Hình ảnh (URL)</Text>
//         <TextInput
//           style={styles.input}
//           value={formData.img}
//           onChangeText={(text) => setFormData({...formData, img: text})}
//           placeholder="https://example.com/image.jpg"
//         />

//         <TouchableOpacity 
//           style={[styles.button, loading && styles.buttonDisabled]}
//           onPress={handleAddMenu}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? 'Đang thêm...' : 'Thêm Món Ăn'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   form: {
//     marginBottom: 30,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: '#333',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 12,
//     marginBottom: 16,
//     borderRadius: 8,
//     fontSize: 16,
//     backgroundColor: '#f9f9f9',
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: '#ccc',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   errorText: {
//     fontSize: 18,
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 50,
//   },
// });