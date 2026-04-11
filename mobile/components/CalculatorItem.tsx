import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from '@/components/Themed';
import { Trash2 } from 'lucide-react-native';
import { CalculatorItem as CalculatorItemType, useCalculatorStore } from '../stores/calculator-store';
import { formatInputDisplay } from '../utils/format';

interface Props {
  item: CalculatorItemType;
}

export function CalculatorItem({ item }: Props) {
  const updateItem = useCalculatorStore((state) => state.updateItem);
  const removeItem = useCalculatorStore((state) => state.removeItem);

  const handleAmountChange = (text: string) => {
    updateItem(item.id, { amount: formatInputDisplay(text) });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.descriptionInput}
          value={item.description}
          onChangeText={(text) => updateItem(item.id, { description: text })}
          placeholder="Descripción"
          placeholderTextColor="rgba(255,255,255,0.4)"
        />
        <TextInput
          style={styles.amountInput}
          value={item.amount}
          onChangeText={handleAmountChange}
          placeholder="0.00"
          placeholderTextColor="rgba(255,255,255,0.4)"
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}>
        <Trash2 size={24} color="#F1C40F" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  descriptionInput: {
    flex: 2,
    backgroundColor: '#1B6B3E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#448A44',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  amountInput: {
    flex: 1.2,
    backgroundColor: '#1B6B3E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#448A44',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#F1C40F',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
