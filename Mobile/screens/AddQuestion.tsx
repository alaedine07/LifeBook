import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const AddQuestion: React.FC = () => {
  const [newQuestion, setNewQuestion] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (newQuestion.trim()) {
      // Here you would typically add the question to your questions list
      Alert.alert('Success', 'Question added successfully!');
      setNewQuestion('');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please enter a question');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Question</Text>
          <TouchableOpacity
            style={[
              styles.saveButton,
              !newQuestion.trim() && styles.saveButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!newQuestion.trim()}
          >
            <Text style={[
              styles.saveButtonText,
              !newQuestion.trim() && styles.saveButtonTextDisabled
            ]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Question</Text>
          <TextInput
            style={styles.input}
            value={newQuestion}
            onChangeText={setNewQuestion}
            placeholder="Type your question here..."
            multiline
            textAlignVertical="top"
            autoFocus
          />
          <Text style={styles.hint}>
            Good questions are clear, open-ended, and encourage reflection.
          </Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#87CEFA',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonTextDisabled: {
    color: '#87CEFA',
  },
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    backgroundColor: 'white',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default AddQuestion;
