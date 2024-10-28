import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header: React.FC = () => {
  const getFormattedDate = (): string => {
    const now = new Date();
    return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Fill Your Day</Text>
      <Text style={styles.date}>{getFormattedDate()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#87CEFA',
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    color: '#211616',
    fontSize: 18,
  },
});

export default Header;
