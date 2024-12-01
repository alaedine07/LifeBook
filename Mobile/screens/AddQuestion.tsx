import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Question } from '../interfaces/question';
import { QuestionService } from '../services/questions_service';

const AddQuestion: React.FC = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const fetchedQuestions = await QuestionService.fetchQuestions();
      setQuestions(fetchedQuestions);
    } catch (error) {
      Alert.alert('Error', 'Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = async () => {
    if (newQuestion.trim()) {
      try {
        setIsLoading(true);
        const addedQuestion = await QuestionService.addQuestion(
          newQuestion.trim()
        );
        setQuestions([addedQuestion, ...questions]);
        setNewQuestion('');
        setIsAddingNew(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to add question');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion(question.question);
    setIsAddingNew(true);
    setSelectedQuestion(null);
  };

  const handleUpdate = async () => {
    if (editingQuestion && newQuestion.trim()) {
      try {
        setIsLoading(true);
        const updatedQuestion = await QuestionService.updateQuestion(
          editingQuestion.id,
          newQuestion.trim()
        );
        setQuestions(
          questions.map((q) =>
            q.id === updatedQuestion.id ? updatedQuestion : q
          )
        );
        setNewQuestion('');
        setIsAddingNew(false);
        setEditingQuestion(null);
      } catch (error) {
        Alert.alert('Error', 'Failed to update question');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = (questionId: string) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await QuestionService.deleteQuestion(questionId);
              setQuestions(questions.filter((q) => q.id !== questionId));
              setSelectedQuestion(null);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete question');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderQuestion = ({ item }: { item: Question }) => {
    const isSelected = selectedQuestion === item.id;

    return (
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionText}>{item.question}</Text>
          <TouchableOpacity
            onPress={() => setSelectedQuestion(isSelected ? null : item.id)}
          >
            <MoreVertical color='#666' size={20} />
          </TouchableOpacity>
        </View>

        {isSelected && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleEdit(item)}
            >
              <Edit2 size={16} color='#87CEFA' />
              <Text style={[styles.actionButtonText, styles.editButtonText]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(item.id)}
            >
              <Trash2 size={16} color='#FF6B6B' />
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color='#000' size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Questions</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setIsAddingNew(true);
            setEditingQuestion(null);
            setNewQuestion('');
          }}
        >
          <Plus color='#87CEFA' size={24} />
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color='#87CEFA' />
        </View>
      )}

      {isAddingNew ? (
        <View style={styles.addContainer}>
          <Text style={styles.label}>
            {editingQuestion ? 'Edit Question' : 'New Question'}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newQuestion}
              onChangeText={setNewQuestion}
              placeholder='Type your question here...'
              multiline
              autoFocus
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setIsAddingNew(false);
                setNewQuestion('');
                setEditingQuestion(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                !newQuestion.trim() && styles.saveButtonDisabled,
              ]}
              onPress={editingQuestion ? handleUpdate : handleAddNew}
              disabled={!newQuestion.trim() || isLoading}
            >
              <Text style={styles.saveButtonText}>
                {editingQuestion ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={questions}
          renderItem={renderQuestion}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
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
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#E6F4FF',
  },
  deleteButton: {
    backgroundColor: '#FFE6E6',
  },
  editButtonText: {
    color: '#87CEFA',
  },
  deleteButtonText: {
    color: '#FF6B6B',
  },
  separator: {
    height: 12,
  },
  addContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  input: {
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#87CEFA',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddQuestion;
