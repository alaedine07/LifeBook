import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface QuestionPageProps {
  question: string;
  answer: string;
  onAnswerChange: (text: string) => void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  question,
  answer,
  onAnswerChange,
}) => {
  return (
    <View style={styles.page}>
      <Text style={styles.question}>{question}</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={answer}
        onChangeText={onAnswerChange}
        placeholder='Write something...'
      />
      <Button
        title='Submit'
        onPress={() => console.log('Submitted')}
        color='#87CEFA'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    alignItems: 'center',
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
});

export default QuestionPage;
