import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PageIndicatorProps {
  count: number;
  currentIndex: number;
}

const PageIndicator: React.FC<PageIndicatorProps> = ({
  count,
  currentIndex,
}) => {
  return (
    <View style={styles.indicatorContainer}>
      {Array.from({ length: count }).map((_, idx) => (
        <View
          key={idx}
          style={[
            styles.indicator,
            { opacity: idx === currentIndex ? 1 : 0.3 },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  indicator: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#87CEFA',
    margin: 3,
  },
});

export default PageIndicator;
