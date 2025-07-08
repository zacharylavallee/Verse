import React, { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BibleProvider, useBible } from '@/contexts/BibleContext';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { scanAvailableTranslations, getDefaultSelection, type LanguageTranslations } from '@/utils/bibleScanner';

// Bible Header Title Component with Language/Translation Selection
function BibleHeaderTitle() {
  const {
    selectedLanguage,
    selectedTranslation,
    languageTranslations,
    setSelectedLanguage,
    setSelectedTranslation
  } = useBible();
  
  // Available languages
  const languages = ['English']; // Spanish temporarily removed until better JSON is available
  
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [translationDropdownOpen, setTranslationDropdownOpen] = useState(false);
  
  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
    setTranslationDropdownOpen(false); // Close other dropdown
  };
  
  const toggleTranslationDropdown = () => {
    setTranslationDropdownOpen(!translationDropdownOpen);
    setLanguageDropdownOpen(false); // Close other dropdown
  };
  
  const selectLanguage = (lang: string) => {
    // Force immediate UI update by using the context function directly
    setSelectedLanguage(lang);
    
    // Close dropdown immediately for better UX
    setLanguageDropdownOpen(false);
  };
  
  const selectTranslation = (translation: string) => {
    setSelectedTranslation(translation);
    setTranslationDropdownOpen(false);
  };
  
  return (
    <View style={headerStyles.titleContainer}>
      <View style={headerStyles.dropdownContainer}>
        <TouchableOpacity style={headerStyles.dropdownButton} onPress={toggleLanguageDropdown}>
          <Text style={headerStyles.dropdownText} numberOfLines={1}>{selectedLanguage}</Text>
        </TouchableOpacity>
        {languageDropdownOpen && (
          <View style={headerStyles.dropdownList}>
            {Object.keys(languageTranslations).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={headerStyles.dropdownItem}
                onPress={() => selectLanguage(lang)}
              >
                <Text style={headerStyles.dropdownItemText}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      <Text style={headerStyles.bibleTitle}>Bible</Text>
      
      <View style={headerStyles.dropdownContainer}>
        <TouchableOpacity style={headerStyles.dropdownButton} onPress={toggleTranslationDropdown}>
          <Text style={headerStyles.dropdownText} numberOfLines={1}>{selectedTranslation}</Text>
        </TouchableOpacity>
        {translationDropdownOpen && (
          <View style={headerStyles.dropdownList}>
            {[...languageTranslations[selectedLanguage]].sort().map((translation) => (
              <TouchableOpacity
                key={translation}
                style={headerStyles.dropdownItem}
                onPress={() => selectTranslation(translation)}
              >
                <Text style={headerStyles.dropdownItemText}>{translation}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <BibleProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: () => (
              <BibleHeaderTitle />
            ),
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
          }}
        />
      </Tabs>
    </BibleProvider>
  );
}

// Header styles for the Bible title component
const headerStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: 280,
    paddingHorizontal: 10,
    zIndex: 1000,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 90,
    maxWidth: 120,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  dropdownList: {
    position: 'absolute',
    top: 34,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1001,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  dropdownItemText: {
    fontSize: 12,
    color: '#495057',
  },
  bibleTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
    marginTop: 6,
  },
});
