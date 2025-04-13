import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email không hợp lệ';
    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (password.length < 6) newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    if (isLogin) {
      // Login logic
      try {
        const userData = await AsyncStorage.getItem(email);
        if (userData) {
          const user = JSON.parse(userData);
          if (user.password === password) {
            await AsyncStorage.setItem('currentUser', JSON.stringify({ email, rememberMe }));
            navigation.replace('Main');
          } else {
            setErrors({ password: 'Mật khẩu không đúng' });
          }
        } else {
          setErrors({ email: 'Email chưa được đăng ký' });
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Register logic
      try {
        const userExists = await AsyncStorage.getItem(email);
        if (userExists) {
          setErrors({ email: 'Email đã được sử dụng' });
        } else {
          await AsyncStorage.setItem(email, JSON.stringify({ email, password }));
          Alert.alert('Thành công', 'Đăng ký thành công!');
          setIsLogin(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo hoặc tiêu đề */}
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>Vui lòng nhập email và mật khẩu để tiếp tục</Text>

        {/* Form */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Ví dụ: levana@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {/* Remember me & Forgot password */}
        <View style={styles.rememberContainer}>
          <TouchableOpacity
            style={styles.rememberCheckbox}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <Ionicons
              name={rememberMe ? "checkbox-outline" : "square-outline"}
              size={20}
              color="#6C63FF"
            />
            <Text style={styles.rememberText}>Nhớ mật khẩu</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleAuth}
        >
          <Text style={styles.loginButtonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        {/* Switch between Login/Register */}
        <View style={styles.switchAuthContainer}>
          <Text style={styles.switchAuthText}>
            {isLogin ? "Bạn chưa có tài khoản?" : "Đã có tài khoản?"}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchAuthButton}>
              {isLogin ? "Tạo tài khoản" : "Đăng nhập"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff5252',
  },
  errorText: {
    color: '#ff5252',
    fontSize: 12,
    marginTop: 5,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  rememberCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    color: '#333',
  },
  forgotPassword: {
    color: '#6C63FF',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#6C63FF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchAuthText: {
    color: '#666',
  },
  switchAuthButton: {
    color: '#6C63FF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default AuthScreen;