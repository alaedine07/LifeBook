import React, { useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import Header from './components/Header';
import QuestionAnswer from './components/QuestionAnswer';
import PageIndicator from './components/PageIndicator';
import { questions as mockQuestions } from './mocks/questions.mocks';

const windowWidth = Dimensions.get('window').width;

const App: React.FC = () => {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      {questions.length === 0 ? (
        <ActivityIndicator size='large' color='#0000ff' />
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
  flatList: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
});

export default App;
