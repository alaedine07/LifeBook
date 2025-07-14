import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReflectionAnswer from '../components/ReflectionAnswer';
import PageIndicator from '../components/PageIndicator';
import { ReflectionService } from '../services/ReflectionsAPI';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PlusCircle } from 'lucide-react-native';
import { AppNavigationParams } from '../types';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { Reflection } from '../interfaces/Reflection';
import { DayEntryService } from '../services/DayEntryAPI';
import { DayEntry } from '../interfaces/day_entry';

const windowWidth = Dimensions.get('window').width;

const FillYourDay: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppNavigationParams>>();
  const route = useRoute();
  const dayEntryParam = (route as any).params?.item;
  const [isLoading, setIsLoading] = useState(!dayEntryParam);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const readOnly = (route as any).params?.readOnly || false;
  // Initialize dayEntry with the passed parameter or default values
  // If dayEntryParam is provided, use it; otherwise, create a new DayEntry object
  const [dayEntry, setDayEntry] = useState<DayEntry>(
    dayEntryParam
      ? { ...dayEntryParam }
      : {
          entryDate: new Date().toISOString(),
          description: '',
          responses: [],
        }
  );
  // Initialize reflections with the passed parameter otherwise empty array
  const [reflections, setReflections] = useState<Reflection[]>(
    dayEntryParam
      ? dayEntryParam.responses.map((r: any, idx: number) => ({
          id: idx.toString(),
          content: r.reflection_text,
        }))
      : []
  );

  // If dayEntryParam is provided, set reflections from it; otherwise, fetch reflections
  useEffect(() => {
    if (!dayEntryParam) {
      fetchReflections();
    }
  }, []);

  // If reflections are fetched and dayEntry has no responses, initialize responses
  // with the fetched reflections
  // This ensures that when the user opens the form, they have a structure to fill out
  // If dayEntryParam is provided, it will not reinitialize responses
  // This is useful for editing existing entries where responses are already set
  useEffect(() => {
    if (
      !dayEntryParam &&
      reflections.length > 0 &&
      dayEntry.responses.length === 0
    ) {
      setDayEntry((prev) => ({
        ...prev,
        responses: reflections.map((reflection) => ({
          reflection_text: reflection.content,
          answers: [],
        })),
      }));
    }
  }, [reflections, dayEntryParam]);

  const fetchReflections = async () => {
    try {
      setIsLoading(true);
      setReflections(await ReflectionService.fetchReflections());
    } catch (error) {
      Alert.alert('Error', 'Failed to load reflections');
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
    item: reflection,
  }: {
    item: Reflection;
    index: number;
  }) => {
    return (
      <View style={[styles.pageContainer, { width: windowWidth }]}>
        <ReflectionAnswer
          reflection={reflection}
          dayEntry={dayEntry}
          setDayEntry={setDayEntry}
          isReadOnly={readOnly}
        />
      </View>
    );
  };

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

  async function SaveDay(dayEntry: DayEntry): Promise<void> {
    try {
      if (dayEntry.id) {
        // update existing entry
        await DayEntryService.updateDayEntry(dayEntry.id, dayEntry);
      } else {
        await DayEntryService.saveDayEntry(dayEntry);
      }
      Alert.alert('Success', 'Your answers have been saved!');
      // Add a delay before navigating
      setTimeout(() => {
        navigation.navigate('Home');
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
          <Text style={styles.emptyText}>Loading reflections...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render empty state if no reflections
  if (reflections.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Fill Your Day</Text>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddReflection')}
          >
            <PlusCircle color='#87CEFA' size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No reflections available. Add some!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddReflection')}
            style={styles.addReflectionsButton}
          >
            <Text style={styles.addReflectionsButtonText}>Add Reflections</Text>
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
        {!readOnly && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => SaveDay(dayEntry)}
          >
            <PlusCircle color='#87CEFA' size={24} />
          </TouchableOpacity>
        )}
      </View>

      {reflections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size='large' color='#87CEFA' />
          <Text style={styles.emptyText}>Loading reflections...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={reflections}
            keyExtractor={(index) => index.id.toString()}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            style={styles.flatList}
          />
          <PageIndicator
            count={reflections.length}
            currentIndex={currentPage}
          />
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
  addReflectionsButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#87CEFA',
    borderRadius: 8,
  },
  addReflectionsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FillYourDay;
