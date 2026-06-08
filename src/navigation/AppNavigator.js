import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../styles/globalStyles';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/Homescreen';
import BooksListScreen from '../screens/BooksListScreen';
import BookFormScreen from '../screens/BookFormScreen';
import CreateUserScreen from '../screens/Createuserscreen';
import UsersListScreen from '../screens/UsersListScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        {token ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="BooksList" component={BooksListScreen} />
            <Stack.Screen name="CreateBook" component={BookFormScreen} />
            <Stack.Screen name="EditBook" component={BookFormScreen} />
            <Stack.Screen name="CreateUser" component={CreateUserScreen} />
            <Stack.Screen name="UsersList" component={UsersListScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;