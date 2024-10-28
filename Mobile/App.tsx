import React, { useState, useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import PagerView from '@react-native-community/viewpager';

import Header from './components/Header';
import QuestionPage from './components/FillYourDay';
import PageIndicator from './components/PageIndicator';
import { questions as mockQuestions } from './mocks/questions.mocks';

const App: React.FC = () => {
  const [questions] = useState(() =>
    mockQuestions.map((item) => item.question)
  );
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      {questions.length === 0 ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <>
          <PagerView
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
          >
            {questions.map((question, index) => (
              <QuestionPage
                key={index}
                question={question}
                answer={answer}
                onAnswerChange={setAnswer}
              />
            ))}
          </PagerView>
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
  pagerView: {
    flex: 1,
  },
});

export default App;
