import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface QuestionPageProps {
  question: string;
}

const QuestionPage: React.FC<QuestionPageProps> = ({ question }) => {
  const [answer, setAnswer] = useState('');
  const [submittedAnswers, setSubmittedAnswers] = useState<string[]>([]);

  const handleSubmit = () => {
    if (answer.trim() !== '') {
      setSubmittedAnswers([...submittedAnswers, answer.trim()]);
      setAnswer('');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.page}>
          <Text style={styles.question}>{question}</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            value={answer}
            onChangeText={setAnswer}
            placeholder='Write something...'
          />
          <Button title='Submit' onPress={handleSubmit} color='#87CEFA' />
          {submittedAnswers.length > 0 && (
            <FlatList
              style={styles.answersList}
              data={submittedAnswers}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.submittedAnswer}>{item}</Text>
              )}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  answersList: {
    marginTop: 20,
    width: '100%',
  },
  submittedAnswer: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default QuestionPage;
