import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, PlusCircle } from 'lucide-react-native';
import AddQuestion from './screens/AddQuestion';
import DayEntriesList from './screens/DayEntries';
import FillYourDay from './screens/DayEntryForm';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#87CEFA',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    }}
  >
    <Tab.Screen
      name='DayEntriesList'
      component={DayEntriesList}
      options={{
        tabBarLabel: 'Fill your day',
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
);

const App: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name='Previous'
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name='FillYourDay' component={FillYourDay} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
