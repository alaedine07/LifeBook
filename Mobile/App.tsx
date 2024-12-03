import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, PlusCircle } from 'lucide-react-native';
import FillYourDay from './screens/FillYourDay';
import AddQuestion from './screens/AddQuestion';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#87CEFA',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name='FillYourDay'
          component={FillYourDay}
          options={{
            tabBarLabel: 'Fill Your Day',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name='AddQuestion'
          component={AddQuestion}
          options={{
            tabBarLabel: 'Reflections',
            tabBarIcon: ({ color, size }) => (
              <PlusCircle color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
