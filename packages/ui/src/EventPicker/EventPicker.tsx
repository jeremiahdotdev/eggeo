'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { appText } from '@eggeo/domain';
import type { EggeoStyle } from '../types';
import { styles, webStyles } from './EventPicker.styles';

export type EggeoEventPickerEvent = {
  id: string;
  isOwner?: boolean | null;
  title: string;
};

type EggeoEventPickerProps = {
  allLabel?: string;
  events: EggeoEventPickerEvent[];
  label?: string;
  ownerOnly?: boolean;
  requireSelection?: boolean;
  selectedEventId: string;
  style?: EggeoStyle;
  webStyle?: CSSProperties;
  onSelect: (eventId: string) => void;
};

export function EggeoEventPicker({
  allLabel = appText.events.labels.allEggs,
  events,
  label,
  ownerOnly = false,
  requireSelection = false,
  selectedEventId,
  style,
  webStyle,
  onSelect,
}: EggeoEventPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleEvents = ownerOnly ? events.filter((event) => event.isOwner) : events;
  const selectedEvent = visibleEvents.find((event) => event.id === selectedEventId);
  const isDisabled = visibleEvents.length === 0;

  if (Platform.OS === 'web') {
    const select = (
      <select
        aria-label={label ?? 'Event'}
        disabled={visibleEvents.length === 0}
        required={requireSelection}
        onChange={(event) => onSelect(event.target.value)}
        style={webStyles.select}
        value={selectedEventId}
      >
        <option disabled={requireSelection} value="">
          {allLabel}
        </option>
        {visibleEvents.map((event) => (
          <option key={event.id} value={event.id}>
            {event.title}
          </option>
        ))}
      </select>
    );

    if (label) {
      return (
        <label style={{ ...webStyles.field, ...(StyleSheet.flatten(style) as CSSProperties | undefined), ...webStyle }}>
          <span>{label}</span>
          {select}
        </label>
      );
    }

    return (
      <form style={{ ...webStyles.form, ...(StyleSheet.flatten(style) as CSSProperties | undefined), ...webStyle }}>
        {select}
      </form>
    );
  }

  function selectEvent(nextEventId: string) {
    onSelect(nextEventId);
    setIsOpen(false);
  }

  return (
    <View style={[label ? styles.nativeField : undefined, style]}>
      {label && <Text style={styles.nativeLabel}>{label}</Text>}
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        onPress={() => setIsOpen(true)}
        style={[styles.nativeSelect, isDisabled ? styles.nativeSelectDisabled : undefined]}
      >
        <Text numberOfLines={1} style={styles.nativeSelectText}>
          {selectedEvent?.title ?? allLabel}
        </Text>
        <Text aria-hidden style={styles.nativeChevron}>
          v
        </Text>
      </Pressable>
      <Modal animationType="fade" onRequestClose={() => setIsOpen(false)} transparent visible={isOpen}>
        <Pressable onPress={() => setIsOpen(false)} style={styles.nativeOverlay}>
          <Pressable onPress={(event) => event.stopPropagation()} style={styles.nativeMenu}>
            <Text style={styles.nativeMenuTitle}>{label ?? 'Event'}</Text>
            <ScrollView contentContainerStyle={styles.nativeMenuList}>
              {!requireSelection && (
                <Pressable onPress={() => selectEvent('')} style={[styles.nativeOption, !selectedEventId ? styles.nativeOptionSelected : undefined]}>
                  <Text style={styles.nativeOptionText}>{allLabel}</Text>
                </Pressable>
              )}
              {visibleEvents.map((event) => (
                <Pressable key={event.id} onPress={() => selectEvent(event.id)} style={[styles.nativeOption, selectedEventId === event.id ? styles.nativeOptionSelected : undefined]}>
                  <Text style={styles.nativeOptionText}>{event.title}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
