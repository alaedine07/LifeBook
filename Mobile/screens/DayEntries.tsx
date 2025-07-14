import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppNavigationParams } from '../types';
import { Edit2, MoreVertical, Trash2 } from 'lucide-react-native';

import { mockReflections } from '../mocks/reflections.mocks';
import { DayEntry } from '../interfaces/day_entry';
import { DayEntryService } from '../services/DayEntryAPI';
import { formatDate } from '../utils/dateUtils';

const DayEntries: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppNavigationParams>>();
  const [days, setDays] = useState<DayEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchDays();
    }, [])
  );

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

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this day entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await DayEntryService.deleteDayEntry(id);
              setDays(days.filter((d) => d.id !== id));
              setSelectedEntryId(null);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const renderDayEntry = ({ item }: { item: DayEntry }) => {
    const uniqueReflectionsAnswered = item.responses
      ? item.responses.filter(
          (response: { answers: string[] }) =>
            response.answers && response.answers.length > 0
        ).length
      : 0;

    const isSelected = selectedEntryId === item.id;

    return (
      <View style={styles.entryCard}>
        <TouchableOpacity
          style={styles.entryHeader}
          onPress={() =>
            navigation.navigate('FillYourDay', { item, readOnly: true })
          }
        >
          <Text style={styles.entryDate}>{formatDate(item.entryDate)}</Text>
        </TouchableOpacity>
        <Text>
          {uniqueReflectionsAnswered} / {item.responses.length} Reflections
          Answered
        </Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() =>
            setSelectedEntryId(isSelected ? null : item.id ?? null)
          }
        >
          <MoreVertical color='#666' size={20} />
        </TouchableOpacity>
        {isSelected && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => {
                setSelectedEntryId(null);
                navigation.navigate('FillYourDay', { item });
              }}
            >
              <Edit2 size={16} color='#87CEFA' />
              <Text style={[styles.actionButtonText, styles.editButtonText]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(item.id ?? '')}
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
        keyExtractor={(item) => item.id ?? ''}
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
  moreButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'flex-end',
    gap: 12,
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
});

export default DayEntries;
