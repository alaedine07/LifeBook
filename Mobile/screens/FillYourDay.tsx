import React, { useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import QuestionAnswer from '../components/QuestionAnswer';
import PageIndicator from '../components/PageIndicator';
import { questions as mockQuestions } from '../mocks/questions.mocks';
import { useNavigation } from '@react-navigation/native';
import { PlusCircle } from 'lucide-react-native';

const windowWidth = Dimensions.get('window').width;

const FillYourDay: React.FC = () => {
  const navigation = useNavigation();
  const [questions] = useState(() =>
    mockQuestions.map((item) => item.question)
  );
  const [currentPage, setCurrentPage] = useState<number>(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / windowWidth);
    setCurrentPage(page);
  };

  const renderItem = ({ item: question }: { item: string; index: number }) => (
    <View style={[styles.pageContainer, { width: windowWidth }]}>
      <QuestionAnswer question={question} />
    </View>
  );

  const getFormattedDate = (): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Fill Your Day</Text>
          <Text style={styles.dateText}>{getFormattedDate()}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.goBack()}
        >
          <PlusCircle color="#87CEFA" size={24} />
        </TouchableOpacity>
      </View>

      {questions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#87CEFA" />
          <Text style={styles.emptyText}>Loading questions...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={questions}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            style={styles.flatList}
          />
          <PageIndicator count={questions.length} currentIndex={currentPage} />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    padding: 8,
  },
  flatList: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default FillYourDay;
