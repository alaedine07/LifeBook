import React, { useState, useEffect } from 'react';
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
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  KeyboardEvent,
} from 'react-native';
import { Send, ChevronDown, ChevronUp, Edit2, X } from 'lucide-react-native';
import { Question } from '../interfaces/question';

interface Answer {
  id: string;
  text: string;
  isExpanded: boolean;
}

interface QuestionAnswerProps {
  question: Question;
  onAddNewAnswer: (questionId: string, answer: string) => void;
}

const MAX_COLLAPSED_LENGTH = 400;
const windowWidth = Dimensions.get('window').width;

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({
  question,
  onAddNewAnswer,
}) => {
  const [answer, setAnswer] = useState('');
  const [submittedAnswers, setSubmittedAnswers] = useState<Answer[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [actionButtonsOpacity] = useState(new Animated.Value(0));
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShow = (event: KeyboardEvent) => {
      setKeyboardHeight(event.endCoordinates.height);
    };

    const keyboardWillHide = () => {
      setKeyboardHeight(0);
    };

    const showSubscription =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillShow', keyboardWillShow)
        : Keyboard.addListener('keyboardDidShow', keyboardWillShow);
    const hideSubscription =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillHide', keyboardWillHide)
        : Keyboard.addListener('keyboardDidHide', keyboardWillHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSubmit = () => {
    if (answer.trim() !== '') {
      setSubmittedAnswers([
        {
          id: Date.now().toString(),
          text: answer.trim(),
          isExpanded: false,
        },
        ...submittedAnswers,
      ]);
      onAddNewAnswer(question.id, answer);
      setAnswer('');
      Keyboard.dismiss();
    }
  };

  const handleLongPress = (answerId: string) => {
    if (selectedAnswerId === answerId) {
      setSelectedAnswerId(null);
      Animated.timing(actionButtonsOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      setSelectedAnswerId(answerId);
      Animated.timing(actionButtonsOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleEdit = (answer: Answer) => {
    setEditingAnswer(answer);
    setEditText(answer.text);
    setEditModalVisible(true);
    setSelectedAnswerId(null);
    actionButtonsOpacity.setValue(0);
  };

  const handleDelete = (answerId: string) => {
    setSubmittedAnswers((answers) => answers.filter((a) => a.id !== answerId));
    setSelectedAnswerId(null);
    actionButtonsOpacity.setValue(0);
  };

  const handleEditSubmit = () => {
    if (editText.trim() && editingAnswer) {
      setSubmittedAnswers((answers) =>
        answers.map((answer) =>
          answer.id === editingAnswer.id
            ? { ...answer, text: editText.trim() }
            : answer
        )
      );
      setEditModalVisible(false);
      setEditingAnswer(null);
      setEditText('');
    }
  };

  const toggleExpand = (id: string) => {
    setSubmittedAnswers((answers) =>
      answers.map((answer) =>
        answer.id === id
          ? { ...answer, isExpanded: !answer.isExpanded }
          : answer
      )
    );
  };

  const renderAnswer = ({ item }: { item: Answer }) => {
    const needsExpansion = item.text.length > MAX_COLLAPSED_LENGTH;
    const displayText =
      needsExpansion && !item.isExpanded
        ? `${item.text.substring(0, MAX_COLLAPSED_LENGTH)}...`
        : item.text;

    const isSelected = selectedAnswerId === item.id;

    return (
      <TouchableOpacity
        style={styles.bubbleWrapper}
        onLongPress={() => handleLongPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.bubbleContainer}>
          {isSelected && (
            <Animated.View
              style={[styles.actionButtons, { opacity: actionButtonsOpacity }]}
            >
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(item)}
              >
                <Edit2 size={18} color='#87CEFA' />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <X size={18} color='#FF6B6B' />
              </TouchableOpacity>
            </Animated.View>
          )}
          <View style={[styles.bubble, isSelected && styles.selectedBubble]}>
            <Text style={styles.bubbleText}>{displayText}</Text>
            {needsExpansion && (
              <TouchableOpacity
                onPress={() => toggleExpand(item.id)}
                style={styles.expandButton}
              >
                {item.isExpanded ? (
                  <ChevronUp size={16} color='#87CEFA' />
                ) : (
                  <ChevronDown size={16} color='#87CEFA' />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setSelectedAnswerId(null);
        actionButtonsOpacity.setValue(0);
      }}
    >
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.question}>{question.question}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              multiline
              value={answer}
              onChangeText={setAnswer}
              placeholder='Write your answer...'
              placeholderTextColor='#666'
            />
            <TouchableOpacity
              style={[
                styles.submitButton,
                !answer.trim() && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!answer.trim()}
            >
              <Send color={answer.trim() ? '#87CEFA' : '#ccc'} size={20} />
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

        <Modal
          visible={editModalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalDismissArea}
              activeOpacity={1}
              onPress={() => setEditModalVisible(false)}
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Answer</Text>
                  <TouchableOpacity
                    onPress={() => setEditModalVisible(false)}
                    style={styles.modalCloseButton}
                  >
                    <X size={24} color='#000' />
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.modalInput}
                  multiline
                  value={editText}
                  onChangeText={setEditText}
                  autoFocus
                />

                <TouchableOpacity
                  style={[
                    styles.modalSubmitButton,
                    !editText.trim() && styles.modalSubmitButtonDisabled,
                  ]}
                  onPress={handleEditSubmit}
                  disabled={!editText.trim()}
                >
                  <Text style={styles.modalSubmitButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
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
  bubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButtons: {
    flexDirection: 'row',
    marginRight: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  editButton: {
    backgroundColor: '#FFFFFF',
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
  },
  bubble: {
    backgroundColor: '#87CEFA',
    borderRadius: 20,
    padding: 12,
    borderTopRightRadius: 4,
  },
  selectedBubble: {
    backgroundColor: '#7AC1F1',
  },
  bubbleText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalDismissArea: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalSubmitButton: {
    backgroundColor: '#87CEFA',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSubmitButtonDisabled: {
    opacity: 0.5,
  },
  modalSubmitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuestionAnswer;
