import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import QuestionAnswer from '../components/QuestionAnswer';
import PageIndicator from '../components/PageIndicator';
import { QuestionService } from '../services/QuestionAPI';
import { useNavigation } from '@react-navigation/native';
import { PlusCircle } from 'lucide-react-native';
import { AppNavigationParams } from '../types';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { Question } from '../interfaces/question';
import { DayEntryService } from '../services/DayEntryAPI';

const windowWidth = Dimensions.get('window').width;

const FillYourDay: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppNavigationParams>>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Array<[string, string]>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setQuestions(await QuestionService.fetchQuestions());
    } catch (error) {
      Alert.alert('Error', 'Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / windowWidth);
    setCurrentPage(page);
  };

  const renderItem = ({
    item: question,
  }: {
    item: Question;
    index: number;
  }) => (
    <View style={[styles.pageContainer, { width: windowWidth }]}>
      <QuestionAnswer
        question={question}
        onAddNewAnswer={handleNewAnswerSubmit}
      />
    </View>
  );

  const getFormattedDate = (): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return now.toLocaleDateString('en-US', options);
  };

  const handleNewAnswerSubmit = (questionId: string, answer: string) => {
    setAnswers((prevAnswers) => [...prevAnswers, [questionId, answer]]);
  };

  async function SaveDay(): Promise<void> {
    try {
      await DayEntryService.saveDayEntry(answers);
      Alert.alert('Success', 'Your answers have been saved!');
      // Add a delay before navigating
      setTimeout(() => {
        navigation.navigate('DayEntries');
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to save your answers. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Fill Your Day</Text>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size='large' color='#87CEFA' />
          <Text style={styles.emptyText}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render empty state if no questions
  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Fill Your Day</Text>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddQuestion')}
          >
            <PlusCircle color='#87CEFA' size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No questions available. Add some!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddQuestion')}
            style={styles.addQuestionsButton}
          >
            <Text style={styles.addQuestionsButtonText}>Add Questions</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Fill Your Day</Text>
          <Text style={styles.dateText}>{getFormattedDate()}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => SaveDay()}>
          <PlusCircle color='#87CEFA' size={24} />
        </TouchableOpacity>
      </View>

      {questions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size='large' color='#87CEFA' />
          <Text style={styles.emptyText}>Loading questions...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={questions}
            keyExtractor={(index) => index.id.toString()}
            renderItem={renderItem}
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
  addQuestionsButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#87CEFA',
    borderRadius: 8,
  },
  addQuestionsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FillYourDay;
