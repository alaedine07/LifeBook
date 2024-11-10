import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import { Send, ChevronDown, ChevronUp } from 'lucide-react-native';

interface Answer {
  id: string;
  text: string;
  isExpanded: boolean;
}

interface QuestionAnswerProps {
  question: string;
}

const MAX_COLLAPSED_LENGTH = 100;
const windowWidth = Dimensions.get('window').width;

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({ question }) => {
  const [answer, setAnswer] = useState('');
  const [submittedAnswers, setSubmittedAnswers] = useState<Answer[]>([]);

  const handleSubmit = () => {
    if (answer.trim() !== '') {
      setSubmittedAnswers([
        {
          id: Date.now().toString(),
          text: answer.trim(),
          isExpanded: false,
        },
        ...submittedAnswers, // Add new answers at the top
      ]);
      setAnswer('');
      Keyboard.dismiss();
    }
  };

  const toggleExpand = (id: string) => {
    setSubmittedAnswers(answers =>
      answers.map(answer =>
        answer.id === id
          ? { ...answer, isExpanded: !answer.isExpanded }
          : answer
      )
    );
  };

  const renderAnswer = ({ item }: { item: Answer }) => {
    const needsExpansion = item.text.length > MAX_COLLAPSED_LENGTH;
    const displayText = needsExpansion && !item.isExpanded
      ? `${item.text.substring(0, MAX_COLLAPSED_LENGTH)}...`
      : item.text;

    return (
      <View style={styles.bubbleWrapper}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{displayText}</Text>
          {needsExpansion && (
            <TouchableOpacity
              onPress={() => toggleExpand(item.id)}
              style={styles.expandButton}
            >
              {item.isExpanded ? (
                <ChevronUp size={16} color="#87CEFA" />
              ) : (
                <ChevronDown size={16} color="#87CEFA" />
              )}
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.timestamp}>
          {new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.question}>{question}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              multiline
              value={answer}
              onChangeText={setAnswer}
              placeholder="Write your answer..."
              placeholderTextColor="#666"
            />
            <TouchableOpacity
              style={[
                styles.submitButton,
                !answer.trim() && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!answer.trim()}
            >
              <Send
                color={answer.trim() ? "#87CEFA" : "#ccc"}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>

        {submittedAnswers.length > 0 ? (
          <FlatList
            style={styles.answersList}
            data={submittedAnswers}
            renderItem={renderAnswer}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.answersListContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Your answers will appear here
            </Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  topSection: {
    marginBottom: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  submitButton: {
    marginLeft: 8,
    padding: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  answersList: {
    flex: 1,
  },
  answersListContent: {
    paddingBottom: 20,
  },
  bubbleWrapper: {
    marginBottom: 16,
    maxWidth: windowWidth * 0.75,
    alignSelf: 'flex-end',
  },
  bubble: {
    backgroundColor: '#87CEFA',
    borderRadius: 20,
    padding: 12,
    borderTopRightRadius: 4,
  },
  bubbleText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  expandButton: {
    alignSelf: 'center',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default QuestionAnswer;
