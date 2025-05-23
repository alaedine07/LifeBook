import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppNavigationParams } from '../types';
import { ChevronRight } from 'lucide-react-native';

import { mockQuestions } from '../mocks/questions.mocks';
import { DayEntry } from '../interfaces/day_entry.types';
import { DayEntryService } from '../services/DayEntryAPI';
import { formatDate } from '../utils/dateUtils';

const DayEntries: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppNavigationParams>>();
  const [days, setDays] = useState<DayEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDays();
  }, []);

  const fetchDays = async () => {
    try {
      setIsLoading(true);
      await setDays(await DayEntryService.fetchDays());
    } catch (error) {
      Alert.alert('Error', 'Failed to load days');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDayEntry = ({ item }: { item: DayEntry }) => {
    const uniqueQuestionsAnswered = item.responses
      ? new Set(
          item.responses.map(
            (response: { question_id: string }) => response.question_id
          )
        ).size
      : 0;

    return (
      <TouchableOpacity
        style={styles.entryCard}
        onPress={() => navigation.navigate('FillYourDay', { item })}
      >
        <View style={styles.entryHeader}>
          <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
          <ChevronRight color='#87CEFA' size={24} />
        </View>
        <Text>
          {uniqueQuestionsAnswered} / {mockQuestions.length} Questions Answered
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Day Entries</Text>
      </View>

      <View style={styles.addEntryContainer}>
        <TouchableOpacity
          style={styles.addEntryButton}
          onPress={() => navigation.navigate('FillYourDay', {})}
        >
          <Text style={styles.addEntryButtonText}>Add your day</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={days}
        renderItem={renderDayEntry}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  addEntryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  addEntryButton: {
    backgroundColor: '#87CEFA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  addEntryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  entryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});

export default DayEntries;
